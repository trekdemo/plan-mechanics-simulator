import React, { useState, useCallback } from 'react';
import AddMilestone from './AddMilestone/AddMilestone';
import MilestoneList from './MilestoneList/MilestoneList';
import ProgressPath from './ProgressPath/ProgressPath';
import CommunicationsSchedule from './CommunicationsSchedule/CommunicationsSchedule';
import Rules from './Rules/Rules';
import PlanConfigurations from './PlanConfigurations/PlanConfigurations';
import { UNLOCK_STRATEGIES } from './utils';
import { useMilestones } from './hooks/useMilestones';
import { useCommunications } from './hooks/useCommunications';

const PlanMechanicsSimulator = () => {
  const startDate = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unlockStrategy, setUnlockStrategy] = useState(UNLOCK_STRATEGIES.BY_COMPLETION);
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

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setCurrentDate(newDate);
    if (shouldAutoSetDates(unlockStrategy)) {
      updateMilestoneDates(newDate);
    }
  };

  const handleUnlockStrategyChange = useCallback((newStrategy) => {
    setUnlockStrategy(newStrategy);
    if (shouldAutoSetDates(newStrategy)) {
      updateMilestoneDates(currentDate);
    }
  }, [currentDate, updateMilestoneDates, shouldAutoSetDates]);

  // Initialize dates on component mount
  React.useEffect(() => {
    if (shouldAutoSetDates(unlockStrategy)) {
      updateMilestoneDates(currentDate);
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMilestone();
    }
  };

  const resetPlanMilestones = () => {
    const newStrategy = UNLOCK_STRATEGIES.BY_COMPLETION;
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
      
      <PlanConfigurations 
        unlockStrategy={unlockStrategy}
        setUnlockStrategy={handleUnlockStrategyChange}
        currentDate={currentDate}
        handleDateChange={handleDateChange}
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