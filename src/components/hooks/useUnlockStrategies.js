import { useCallback } from 'react';
import { UNLOCK_STRATEGIES } from '../utils';

export const useUnlockStrategies = (milestones, setMilestones, currentDate, unlockStrategy) => {
  const stripTimeFromDate = useCallback((date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }, []);

  const arePriorRequiredMilestonesCompleted = useCallback((currentIndex, milestonesList) => {
    // Check all milestones before the current one
    for (let i = 0; i < currentIndex; i++) {
      const milestone = milestonesList[i];
      // If we find a non-optional milestone that isn't completed, return false
      if (!milestone.optional && milestone.state !== 'completed') {
        return false;
      }
    }
    return true;
  }, []);

  const handleByDateStrategy = useCallback((milestone, currentDateStripped) => {
    if (!milestone.startDate) return milestone;
    
    const startDateStripped = stripTimeFromDate(milestone.startDate);
    
    // If the current date is before the start date, milestone should be locked
    if (currentDateStripped < startDateStripped) {
      return { ...milestone, state: 'locked' };
    }
    
    // If the current date is >= start date and milestone is locked, unlock it
    if (milestone.state === 'locked' && currentDateStripped >= startDateStripped) {
      return { ...milestone, state: 'unlocked' };
    }
    
    return milestone;
  }, [stripTimeFromDate]);

  const handleByBothStrategy = useCallback((milestone, currentDateStripped, index, allMilestones) => {
    if (!milestone.startDate) return milestone;
    
    const startDateStripped = stripTimeFromDate(milestone.startDate);
    const dateCondition = currentDateStripped >= startDateStripped;
    const completionCondition = arePriorRequiredMilestonesCompleted(index, allMilestones);
    
    // If either condition is not met, milestone should be locked
    if (!dateCondition || !completionCondition) {
      return { ...milestone, state: 'locked' };
    }
    
    // If both conditions are met and milestone is locked, unlock it
    if (milestone.state === 'locked') {
      return { ...milestone, state: 'unlocked' };
    }
    
    return milestone;
  }, [stripTimeFromDate, arePriorRequiredMilestonesCompleted]);

  const updateMilestoneStates = useCallback((date) => {
    const currentDateStripped = stripTimeFromDate(date);
    
    setMilestones(prevMilestones => {
      return prevMilestones.map((milestone, index, array) => {
        switch (unlockStrategy) {
          case UNLOCK_STRATEGIES.BY_DATE:
            return handleByDateStrategy(milestone, currentDateStripped);
          case UNLOCK_STRATEGIES.BY_BOTH:
            return handleByBothStrategy(milestone, currentDateStripped, index, array);
          default:
            return milestone;
        }
      });
    });
  }, [unlockStrategy, handleByDateStrategy, handleByBothStrategy, stripTimeFromDate]);

  const changeState = useCallback((id, newState, originalChangeState) => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone || !milestone.startDate) return;

    const currentDateStripped = stripTimeFromDate(currentDate);
    const startDateStripped = stripTimeFromDate(milestone.startDate);
    const milestoneIndex = milestones.findIndex(m => m.id === id);

    switch (unlockStrategy) {
      case UNLOCK_STRATEGIES.BY_DATE: {
        // Only allow state changes if current date >= start date
        if (currentDateStripped >= startDateStripped) {
          setMilestones(prevMilestones => 
            prevMilestones.map(m => 
              m.id === id ? { ...m, state: newState } : m
            )
          );
        }
        break;
      }
      case UNLOCK_STRATEGIES.BY_BOTH: {
        // Only allow state changes if both conditions are met
        const dateCondition = currentDateStripped >= startDateStripped;
        const completionCondition = arePriorRequiredMilestonesCompleted(milestoneIndex, milestones);
        
        if (dateCondition && completionCondition) {
          setMilestones(prevMilestones => {
            const updatedMilestones = prevMilestones.map(m => 
              m.id === id ? { ...m, state: newState } : m
            );
            // After changing state, we need to update all subsequent milestones
            // as they might need to be locked/unlocked based on this change
            return updatedMilestones.map((m, idx) => {
              if (idx <= milestoneIndex) return m;
              return handleByBothStrategy(m, currentDateStripped, idx, updatedMilestones);
            });
          });
        }
        break;
      }
      default:
        // For other strategies, use original behavior
        originalChangeState(id, newState);
    }
  }, [milestones, currentDate, unlockStrategy, stripTimeFromDate, handleByBothStrategy, arePriorRequiredMilestonesCompleted]);

  return {
    updateMilestoneStates,
    changeState
  };
}; 