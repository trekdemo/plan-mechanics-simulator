import React from 'react';
import PropTypes from 'prop-types';
import { UNLOCK_STRATEGIES, formatDateForInput } from '../utils';

const PlanConfigurations = ({ 
  unlockStrategy, 
  setUnlockStrategy,
  currentDate,
  handleDateChange,
  resetPlanMilestones
}) => {
  const handleUnlockStrategyChange = (e) => {
    setUnlockStrategy(e.target.value);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    handleDateChange({ target: { value: formatDateForInput(nextDay) } });
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h2 className="text-xl font-semibold mb-3 text-center">Plan Configurations</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unlocking Strategy
          </label>
          <div className="space-y-2">
            <div className="flex items-start">
              <input
                id="unlock-by-date"
                name="unlockStrategy"
                type="radio"
                value={UNLOCK_STRATEGIES.BY_DATE}
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_DATE}
                onChange={handleUnlockStrategyChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="unlock-by-date" className="ml-2 block text-sm text-gray-700 text-left">
                <div className="font-medium">By start date passed</div>
                <p className="text-gray-500 text-xs mt-1">
                  Milestones unlock when their start date has passed.
                </p>
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                id="unlock-by-completion"
                name="unlockStrategy"
                type="radio"
                value={UNLOCK_STRATEGIES.BY_COMPLETION}
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_COMPLETION}
                onChange={handleUnlockStrategyChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="unlock-by-completion" className="ml-2 block text-sm text-gray-700 text-left">
                <div className="font-medium">By completion of all prior non-optional milestones</div>
                <p className="text-gray-500 text-xs mt-1">
                  Milestones unlock when all preceding required milestones are completed.
                </p>
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                id="unlock-by-both"
                name="unlockStrategy"
                type="radio"
                value={UNLOCK_STRATEGIES.BY_BOTH}
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_BOTH}
                onChange={handleUnlockStrategyChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="unlock-by-both" className="ml-2 block text-sm text-gray-700 text-left">
                <div className="font-medium">By start date passed and completion of all prior non-optional milestones</div>
                <p className="text-gray-500 text-xs mt-1">
                  Milestones unlock when both their start date has passed and all preceding required milestones are completed.
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <div className="flex items-center space-x-2">
            <label htmlFor="currentDate" className="font-medium text-sm">Current Date:</label>
            <input 
              type="date" 
              id="currentDate"
              className="p-2 border rounded"
              value={formatDateForInput(currentDate)}
              onChange={handleDateChange}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
              onClick={handleNextDay}
            >
              Next
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <div className="text-sm text-gray-600 text-left">
            <div className="mb-1"><span className="font-medium">Types:</span> 🏆 Milestone, 📝 Session</div>
            <div className="mb-1"><span className="font-medium">States:</span> 🔴 Locked, 🟡 Unlocked, 🟢 Completed</div>
            <div><span className="font-medium">Optional:</span> Milestones that are not required for progression</div>
          </div>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <div className="flex justify-start">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-left"
              onClick={resetPlanMilestones}
            >
              Reset Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PlanConfigurations.propTypes = {
  unlockStrategy: PropTypes.string.isRequired,
  setUnlockStrategy: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  handleDateChange: PropTypes.func.isRequired,
  resetPlanMilestones: PropTypes.func.isRequired
};

export default PlanConfigurations; 