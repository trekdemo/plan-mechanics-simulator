import { useState } from 'react';
import { initialCommunication } from '../data/seeds';

export const useCommunications = (startDate) => {
  const [communications, setCommunications] = useState([initialCommunication(startDate)]);

  const addCommunication = (type, milestone, daysOffset = 0, options = {}, currentDate) => {
    const baseDate = new Date(currentDate);
    if (daysOffset > 0) {
      baseDate.setDate(baseDate.getDate() + daysOffset);
    }
    
    const newComm = {
      id: Date.now() + Math.random(),
      type,
      milestone: milestone ? { ...milestone } : null,
      date: new Date(baseDate),
      triggerEvent: options.triggerEvent ? { ...options.triggerEvent } : milestone ? { ...milestone } : null,
      description: options.description || `${milestone.name} - ${type}`
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