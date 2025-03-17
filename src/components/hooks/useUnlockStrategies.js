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

  const updateMilestoneStates = useCallback((date) => {
    const currentDateStripped = stripTimeFromDate(date);
    
    setMilestones(prevMilestones => {
      return prevMilestones.map(milestone => {
        switch (unlockStrategy) {
          case UNLOCK_STRATEGIES.BY_DATE:
            return handleByDateStrategy(milestone, currentDateStripped);
          // Add other strategies here as we implement them
          default:
            return milestone;
        }
      });
    });
  }, [unlockStrategy, handleByDateStrategy, stripTimeFromDate]);

  const changeState = useCallback((id, newState, originalChangeState) => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone || !milestone.startDate) return;

    switch (unlockStrategy) {
      case UNLOCK_STRATEGIES.BY_DATE: {
        const currentDateStripped = stripTimeFromDate(currentDate);
        const startDateStripped = stripTimeFromDate(milestone.startDate);

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
      default:
        // For other strategies, use original behavior
        originalChangeState(id, newState);
    }
  }, [milestones, currentDate, unlockStrategy, stripTimeFromDate]);

  return {
    updateMilestoneStates,
    changeState
  };
}; 