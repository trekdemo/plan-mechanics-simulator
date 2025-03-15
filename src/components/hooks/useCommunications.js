import { useState } from 'react';
import { initialCommunication } from '../data/seeds';

export const useCommunications = (startDate) => {
  const [communications, setCommunications] = useState([initialCommunication(startDate)]);

  const getCommunicationDescription = (type, milestone, daysOffset) => {
    switch(type) {
      case 'plan_start':
        return 'Plan begins';
      case 'milestone_unlocked':
        return `${milestone.name} unlocked`;
      case 'milestone_unlocked_followup':
        return `${milestone.name} followup (${daysOffset} days after unlock)`;
      default:
        return 'Communication';
    }
  };

  const addCommunication = (type, milestone, daysOffset = 0, currentDate) => {
    const baseDate = new Date(currentDate);
    if (daysOffset > 0) {
      baseDate.setDate(baseDate.getDate() + daysOffset);
    }
    
    const newComm = {
      id: Date.now() + Math.random(),
      type,
      milestone: milestone ? { ...milestone } : null,
      date: new Date(baseDate),
      description: getCommunicationDescription(type, milestone, daysOffset)
    };
    
    setCommunications(prev => [...prev, newComm]);
  };

  const resetCommunications = () => {
    setCommunications([initialCommunication(startDate)]);
  };

  return {
    communications,
    addCommunication,
    resetCommunications
  };
}; 