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
import { useUnlockStrategies } from './hooks/useUnlockStrategies';
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
    changeState: originalChangeState,
    changeType,
    toggleOptional,
    removeMilestone
  } = useMilestones(wrappedAddCommunication);

  const { updateMilestoneStates, changeState: strategyChangeState } = useUnlockStrategies(
    milestones,
    setMilestones,
    currentDate,
    unlockStrategy
  );

  // Wrap the original changeState to use strategy-based state changes
  const changeState = useCallback((id, newState) => {
    strategyChangeState(id, newState, originalChangeState);
  }, [strategyChangeState, originalChangeState]);

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

  const handleDateChange = useCallback((e) => {
    // Add time component and handle timezone properly
    const dateStr = `${e.target.value}T00:00:00`;
    const newDate = new Date(dateStr);
    setCurrentDate(newDate);
    
    if ([UNLOCK_STRATEGIES.BY_DATE, UNLOCK_STRATEGIES.BY_BOTH].includes(unlockStrategy)) {
      updateMilestoneStates(newDate);
    }
  }, [unlockStrategy, updateMilestoneStates]);

  const handleUnlockStrategyChange = useCallback((newStrategy) => {
    // Reset current date to today
    const today = new Date();
    setCurrentDate(today);
    
    // Set the new strategy
    setUnlockStrategy(newStrategy);
    
    // Reset the plan with the new strategy
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
    updateMilestoneDates(today);
    
    // Update milestone states based on the new strategy
    if ([UNLOCK_STRATEGIES.BY_DATE, UNLOCK_STRATEGIES.BY_BOTH].includes(newStrategy)) {
      updateMilestoneStates(today);
    }
  }, [updateMilestoneDates, updateMilestoneStates, resetCommunications]);

  // Initialize dates on component mount
  React.useEffect(() => {
    if (shouldAutoSetDates(unlockStrategy)) {
      updateMilestoneDates(currentDate);
    }
    if (unlockStrategy === UNLOCK_STRATEGIES.BY_DATE) {
      updateMilestoneStates(currentDate);
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleNextDay = useCallback(() => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
    
    if ([UNLOCK_STRATEGIES.BY_DATE, UNLOCK_STRATEGIES.BY_BOTH].includes(unlockStrategy)) {
      updateMilestoneStates(nextDay);
    }
  }, [currentDate, unlockStrategy, updateMilestoneStates]);

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