import { useCallback } from 'react';

export const useMilestoneCommunications = (addCommunication) => {
  const handleMilestoneStateChange = useCallback((milestone, oldState, newState) => {
    // Only send communications when a milestone becomes unlocked
    if (oldState === 'locked' && newState === 'unlocked') {
      // Send the "unlocked" communication immediately
      addCommunication('unlocked', milestone, 0, {
        triggerEvent: milestone,
        description: 'New milestone unlocked'
      });
      
      // Schedule "reminder" communications for 3 and 7 days after unlock
      // Note: The trigger event is still the milestone that unlocked
      addCommunication('reminder', milestone, 3, {
        triggerEvent: milestone,
        description: '3 day reminder'
      });
      
      addCommunication('reminder', milestone, 7, {
        triggerEvent: milestone,
        description: '7 day reminder'
      });
    }
  }, [addCommunication]);

  return {
    handleMilestoneStateChange
  };
}; 