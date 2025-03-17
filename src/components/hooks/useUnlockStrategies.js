import { useCallback } from 'react';
import { UNLOCK_STRATEGIES } from '../utils';

export const useUnlockStrategies = (milestones, setMilestones, currentDate, unlockStrategy, onStateChange) => {
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
    const oldState = milestone.state;
    let newState = oldState;
    
    // If the current date is before the start date, milestone should be locked
    if (currentDateStripped < startDateStripped) {
      newState = 'locked';
    }
    // If the current date is >= start date and milestone is locked, unlock it
    else if (milestone.state === 'locked') {
      newState = 'unlocked';
    }
    
    // If state changed, notify
    if (oldState !== newState) {
      onStateChange(milestone, oldState, newState);
    }
    
    return { ...milestone, state: newState };
  }, [stripTimeFromDate, onStateChange]);

  const handleByBothStrategy = useCallback((milestone, currentDateStripped, index, allMilestones) => {
    if (!milestone.startDate) return milestone;
    
    const startDateStripped = stripTimeFromDate(milestone.startDate);
    const dateCondition = currentDateStripped >= startDateStripped;
    const completionCondition = arePriorRequiredMilestonesCompleted(index, allMilestones);
    const oldState = milestone.state;
    let newState = oldState;
    
    // If either condition is not met, milestone should be locked
    if (!dateCondition || !completionCondition) {
      newState = 'locked';
    }
    // If both conditions are met and milestone is locked, unlock it
    else if (milestone.state === 'locked') {
      newState = 'unlocked';
    }
    
    // If state changed, notify
    if (oldState !== newState) {
      onStateChange(milestone, oldState, newState);
    }
    
    return { ...milestone, state: newState };
  }, [stripTimeFromDate, arePriorRequiredMilestonesCompleted, onStateChange]);

  const handleByCompletionStrategy = useCallback((milestone, index, allMilestones) => {
    const oldState = milestone.state;
    let newState = oldState;
    
    // If prior required milestones are not completed, milestone should be locked
    if (!arePriorRequiredMilestonesCompleted(index, allMilestones)) {
      newState = 'locked';
    }
    // If prior required milestones are completed and milestone is locked, unlock it
    else if (milestone.state === 'locked') {
      newState = 'unlocked';
    }
    
    // If state changed, notify
    if (oldState !== newState) {
      onStateChange(milestone, oldState, newState);
    }
    
    return { ...milestone, state: newState };
  }, [arePriorRequiredMilestonesCompleted, onStateChange]);

  const updateMilestoneStates = useCallback((date) => {
    const currentDateStripped = stripTimeFromDate(date);
    
    setMilestones(prevMilestones => {
      return prevMilestones.map((milestone, index, array) => {
        switch (unlockStrategy) {
          case UNLOCK_STRATEGIES.BY_DATE:
            return handleByDateStrategy(milestone, currentDateStripped);
          case UNLOCK_STRATEGIES.BY_BOTH:
            return handleByBothStrategy(milestone, currentDateStripped, index, array);
          case UNLOCK_STRATEGIES.BY_COMPLETION:
            return handleByCompletionStrategy(milestone, index, array);
          default:
            return milestone;
        }
      });
    });
  }, [unlockStrategy, handleByDateStrategy, handleByBothStrategy, handleByCompletionStrategy, stripTimeFromDate]);

  const changeState = useCallback((id, newState) => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone || !milestone.startDate) return;

    const currentDateStripped = stripTimeFromDate(currentDate);
    const startDateStripped = stripTimeFromDate(milestone.startDate);
    const milestoneIndex = milestones.findIndex(m => m.id === id);
    const oldState = milestone.state;

    switch (unlockStrategy) {
      case UNLOCK_STRATEGIES.BY_DATE: {
        // Only allow state changes if current date >= start date
        if (currentDateStripped >= startDateStripped) {
          setMilestones(prevMilestones => 
            prevMilestones.map(m => 
              m.id === id ? { ...m, state: newState } : m
            )
          );
          onStateChange(milestone, oldState, newState);
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
            return updatedMilestones.map((m, idx) => {
              if (idx <= milestoneIndex) return m;
              return handleByBothStrategy(m, currentDateStripped, idx, updatedMilestones);
            });
          });
          onStateChange(milestone, oldState, newState);
        }
        break;
      }
      case UNLOCK_STRATEGIES.BY_COMPLETION: {
        setMilestones(prevMilestones => {
          const updatedMilestones = prevMilestones.map(m => 
            m.id === id ? { ...m, state: newState } : m
          );
          // After changing state, we need to update all subsequent milestones
          return updatedMilestones.map((m, idx) => {
            if (idx <= milestoneIndex) return m;
            return handleByCompletionStrategy(m, idx, updatedMilestones);
          });
        });
        onStateChange(milestone, oldState, newState);
        break;
      }
      default: {
        setMilestones(prevMilestones => 
          prevMilestones.map(m => 
            m.id === id ? { ...m, state: newState } : m
          )
        );
        onStateChange(milestone, oldState, newState);
      }
    }
  }, [milestones, currentDate, unlockStrategy, stripTimeFromDate, handleByBothStrategy, handleByCompletionStrategy, arePriorRequiredMilestonesCompleted, onStateChange]);

  return {
    updateMilestoneStates,
    changeState
  };
}; 