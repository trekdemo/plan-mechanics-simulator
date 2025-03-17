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

  const handleDateChange = (e) => {
    setCurrentDate(new Date(e.target.value));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMilestone();
    }
  };

  const resetPlanMilestones = () => {
    setUnlockStrategy(UNLOCK_STRATEGIES.BY_COMPLETION);
    setMilestones([
      { id: 1, name: 'Milestone 1', type: 'milestone', state: 'unlocked', optional: false },
      { id: 2, name: 'Milestone 2', type: 'milestone', state: 'locked', optional: true },
      { id: 3, name: 'Milestone 3', type: 'milestone', state: 'locked', optional: false },
      { id: 4, name: 'Milestone 4', type: 'milestone', state: 'locked', optional: false },
      { id: 5, name: 'Milestone 5', type: 'milestone', state: 'locked', optional: false }
    ]);
    resetCommunications();
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Plan Mechanics Simulator</h1>
      
      <PlanConfigurations 
        unlockStrategy={unlockStrategy}
        setUnlockStrategy={setUnlockStrategy}
      />
      
      <AddMilestone
        newMilestoneName={newMilestoneName}
        setNewMilestoneName={setNewMilestoneName}
        newMilestoneType={newMilestoneType}
        setNewMilestoneType={setNewMilestoneType}
        newMilestoneOptional={newMilestoneOptional}
        setNewMilestoneOptional={setNewMilestoneOptional}
        currentDate={currentDate}
        handleDateChange={handleDateChange}
        addMilestone={addMilestone}
        handleKeyPress={handleKeyPress}
        resetPlanMilestones={resetPlanMilestones}
      />
      
      <MilestoneList
        milestones={milestones}
        changeState={changeState}
        changeType={changeType}
        toggleOptional={toggleOptional}
        removeMilestone={removeMilestone}
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