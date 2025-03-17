import React, { useState, useCallback } from 'react';
import AddMilestone from './AddMilestone/AddMilestone';
import MilestoneList from './MilestoneList/MilestoneList';
import ProgressPath from './ProgressPath/ProgressPath';
import CommunicationsSchedule from './CommunicationsSchedule/CommunicationsSchedule';
import Rules from './Rules/Rules';
import PlanConfigurations from './PlanConfigurations/PlanConfigurations';
import CurrentDateControl from './CurrentDateControl/CurrentDateControl';
import { UNLOCK_STRATEGIES } from './utils';
import { useMilestones } from './hooks/useMilestones';
import { useCommunications } from './hooks/useCommunications';
import { initialUnlockStrategy } from './data/seeds';

const PlanMechanicsSimulator = () => {
  const startDate = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unlockStrategy, setUnlockStrategy] = useState(initialUnlockStrategy);
  const [newMilestoneStartDate, setNewMilestoneStartDate] = useState(new Date());
  const [newMilestoneEndDate, setNewMilestoneEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  
  const { communications, addCommunication, resetCommunications } = useCommunications(startDate);
  
  const wrappedAddCommunication = useCallback((type, milestone, daysOffset = 0) => {
    addCommunication(type, milestone, daysOffset, currentDate);
  }, [addCommunication, currentDate]);

  const {
    milestones,
    setMilestones,
    newMilestoneName,
    setNewMilestoneName,
    newMilestoneType,
    setNewMilestoneType,
    newMilestoneOptional,
    setNewMilestoneOptional,
    addMilestone,
    changeState,
    changeType,
    toggleOptional,
    removeMilestone
  } = useMilestones(wrappedAddCommunication);

  const shouldAutoSetDates = useCallback((strategy) => {
    return [
      UNLOCK_STRATEGIES.BY_COMPLETION,
      UNLOCK_STRATEGIES.BY_DATE,
      UNLOCK_STRATEGIES.BY_BOTH
    ].includes(strategy);
  }, []);

  const updateMilestoneDates = useCallback((startingDate) => {
    setMilestones(prevMilestones => {
      let currentStartDate = new Date(startingDate);
      
      return prevMilestones.map(milestone => {
        const startDate = new Date(currentStartDate);
        const endDate = new Date(currentStartDate);
        endDate.setDate(endDate.getDate() + 7); // 7 days later
        
        // Set the next start date to be the current end date
        currentStartDate = new Date(endDate);
        
        return {
          ...milestone,
          startDate,
          endDate
        };
      });
    });
  }, []);

  const updateMilestoneStatesByDate = useCallback((date) => {
    // Strip time component from the current date for comparison
    const currentDateStripped = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    setMilestones(prevMilestones => {
      return prevMilestones.map(milestone => {
        if (!milestone.startDate) return milestone;
        
        // Strip time component from the milestone start date
        const startDateStripped = new Date(
          milestone.startDate.getFullYear(),
          milestone.startDate.getMonth(),
          milestone.startDate.getDate()
        );
        
        // For BY_DATE strategy, we only change locked -> unlocked based on date
        // We don't want to affect milestones that are already completed
        if (milestone.state === 'locked' && startDateStripped <= currentDateStripped) {
          return { ...milestone, state: 'unlocked' };
        }
        return milestone;
      });
    });
  }, []);

  const handleDateChange = useCallback((e) => {
    // Add time component and handle timezone properly
    const dateStr = `${e.target.value}T00:00:00`;
    const newDate = new Date(dateStr);
    setCurrentDate(newDate);
    
    if (unlockStrategy === UNLOCK_STRATEGIES.BY_DATE) {
      updateMilestoneStatesByDate(newDate);
    }
  }, [unlockStrategy, updateMilestoneStatesByDate]);

  const handleUnlockStrategyChange = useCallback((newStrategy) => {
    setUnlockStrategy(newStrategy);
    if (newStrategy === UNLOCK_STRATEGIES.BY_DATE) {
      updateMilestoneStatesByDate(currentDate);
    }
  }, [currentDate, updateMilestoneStatesByDate]);

  // Initialize dates on component mount
  React.useEffect(() => {
    if (shouldAutoSetDates(unlockStrategy)) {
      updateMilestoneDates(currentDate);
    }
    if (unlockStrategy === UNLOCK_STRATEGIES.BY_DATE) {
      updateMilestoneStatesByDate(currentDate);
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMilestone();
    }
  };

  const resetPlanMilestones = () => {
    const newStrategy = initialUnlockStrategy;
    setUnlockStrategy(newStrategy);
    
    const baseMilestones = [
      { 
        id: 1, 
        name: 'Milestone 1', 
        type: 'milestone', 
        state: 'unlocked', 
        optional: false
      },
      { 
        id: 2, 
        name: 'Milestone 2', 
        type: 'milestone', 
        state: 'locked', 
        optional: true
      },
      { 
        id: 3, 
        name: 'Milestone 3', 
        type: 'milestone', 
        state: 'locked', 
        optional: false
      },
      { 
        id: 4, 
        name: 'Milestone 4', 
        type: 'milestone', 
        state: 'locked', 
        optional: false
      },
      { 
        id: 5, 
        name: 'Milestone 5', 
        type: 'milestone', 
        state: 'locked', 
        optional: false
      }
    ];

    setMilestones(baseMilestones);
    resetCommunications();
    
    // Set dates since we're using a strategy that requires dates
    updateMilestoneDates(currentDate);
  };

  const changeStartDate = useCallback((id, newDate) => {
    setMilestones(prevMilestones => 
      prevMilestones.map(milestone => 
        milestone.id === id ? { ...milestone, startDate: newDate } : milestone
      )
    );
  }, []);

  const changeEndDate = useCallback((id, newDate) => {
    setMilestones(prevMilestones => 
      prevMilestones.map(milestone => 
        milestone.id === id ? { ...milestone, endDate: newDate } : milestone
      )
    );
  }, []);

  const handleNextDay = useCallback(() => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
    
    if (unlockStrategy === UNLOCK_STRATEGIES.BY_DATE) {
      updateMilestoneStatesByDate(nextDay);
    }
  }, [currentDate, unlockStrategy, updateMilestoneStatesByDate]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Plan Mechanics Simulator</h1>
      
      <CurrentDateControl 
        currentDate={currentDate}
        handleDateChange={handleDateChange}
        handleNextDay={handleNextDay}
      />
      
      <PlanConfigurations 
        unlockStrategy={unlockStrategy}
        setUnlockStrategy={handleUnlockStrategyChange}
        resetPlanMilestones={resetPlanMilestones}
      />
      
      <AddMilestone
        newMilestoneName={newMilestoneName}
        setNewMilestoneName={setNewMilestoneName}
        newMilestoneType={newMilestoneType}
        setNewMilestoneType={setNewMilestoneType}
        newMilestoneOptional={newMilestoneOptional}
        setNewMilestoneOptional={setNewMilestoneOptional}
        addMilestone={addMilestone}
        handleKeyPress={handleKeyPress}
        newMilestoneStartDate={newMilestoneStartDate}
        setNewMilestoneStartDate={setNewMilestoneStartDate}
        newMilestoneEndDate={newMilestoneEndDate}
        setNewMilestoneEndDate={setNewMilestoneEndDate}
      />
      
      <MilestoneList
        milestones={milestones}
        changeState={changeState}
        changeType={changeType}
        toggleOptional={toggleOptional}
        removeMilestone={removeMilestone}
        changeStartDate={changeStartDate}
        changeEndDate={changeEndDate}
      />
      
      <Rules />
      
      <ProgressPath milestones={milestones} />
      
      <CommunicationsSchedule
        communications={communications}
        startDate={startDate}
        currentDate={currentDate}
      />
    </div>
  );
};

export default PlanMechanicsSimulator; 