import React from 'react';
import { formatDateForInput } from '../utils';

const AddMilestone = ({
  newMilestoneName,
  setNewMilestoneName,
  newMilestoneType,
  setNewMilestoneType,
  newMilestoneOptional,
  setNewMilestoneOptional,
  currentDate,
  handleDateChange,
  addMilestone,
  handleKeyPress,
  resetPlanMilestones
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Milestone</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Milestone Name"
          className="p-2 border rounded flex-grow"
          value={newMilestoneName}
          onChange={(e) => setNewMilestoneName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <select
          className="p-2 border rounded"
          value={newMilestoneType}
          onChange={(e) => setNewMilestoneType(e.target.value)}
        >
          <option value="milestone">Milestone</option>
          <option value="session">Session</option>
        </select>
        <div className="flex items-center p-2">
          <input
            type="checkbox"
            id="newMilestoneOptional"
            checked={newMilestoneOptional}
            onChange={(e) => setNewMilestoneOptional(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="newMilestoneOptional" className="text-sm">Optional</label>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          onClick={addMilestone}
        >
          Add Milestone
        </button>
      </div>
      
      <div className="flex flex-wrap justify-between items-center border-t pt-4 mt-2">
        <div className="flex items-center">
          <label htmlFor="currentDate" className="mr-2 font-medium">Current Date:</label>
          <input 
            type="date" 
            id="currentDate"
            className="p-2 border rounded"
            value={formatDateForInput(currentDate)}
            onChange={handleDateChange}
          />
          <span className="text-sm text-gray-500 ml-2">
            All events will occur on this date
          </span>
        </div>
        
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded mt-2 sm:mt-0"
          onClick={resetPlanMilestones}
        >
          Reset
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-1"><span className="font-medium">Types:</span> 🏆 Milestone, 📝 Session</p>
        <p className="mb-1"><span className="font-medium">States:</span> 🔴 Locked, 🟡 Unlocked, 🟢 Completed</p>
        <p><span className="font-medium">Optional:</span> Milestones that are not required for progression</p>
      </div>
    </div>
  );
};

export default AddMilestone; 