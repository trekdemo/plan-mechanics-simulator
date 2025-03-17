import React from 'react';
import PropTypes from 'prop-types';
import { UNLOCK_STRATEGIES } from '../utils';

const PlanConfigurations = ({ 
  unlockStrategy, 
  setUnlockStrategy,
  resetPlanMilestones
}) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Plan Configurations</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Unlocking Strategy */}
        <div>
          <h3 className="text-lg font-medium mb-3">Unlocking Strategy</h3>
          <div className="space-y-2">
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_COMPLETION}
                onChange={() => setUnlockStrategy(UNLOCK_STRATEGIES.BY_COMPLETION)}
              />
              <span className="ml-2 text-sm text-left block">
                By completion of all prior non-optional milestones
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_DATE}
                onChange={() => setUnlockStrategy(UNLOCK_STRATEGIES.BY_DATE)}
              />
              <span className="ml-2 text-sm text-left block">
                By start date
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                checked={unlockStrategy === UNLOCK_STRATEGIES.BY_BOTH}
                onChange={() => setUnlockStrategy(UNLOCK_STRATEGIES.BY_BOTH)}
              />
              <span className="ml-2 text-sm text-left block">
                By start date passed and completion of all prior non-optional milestones
              </span>
            </label>
          </div>
        </div>

        {/* Right Column - Completion Strategy */}
        <div>
          <h3 className="text-lg font-medium mb-3">Completion Strategy</h3>
          <div className="space-y-2">
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                disabled
                checked={false}
              />
              <span className="ml-2 text-sm text-gray-500 text-left block">
                Complete milestones when all activities are clicked
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                disabled
                checked={false}
              />
              <span className="ml-2 text-sm text-gray-500 text-left block">
                Complete milestones when all activities are completed
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                className="mt-1"
                disabled
                checked={false}
              />
              <span className="ml-2 text-sm text-gray-500 text-left block">
                Complete milestones when only assessment activities are completed
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="flex justify-between items-start">
          <div className="text-sm text-gray-600 text-left">
            <div className="mb-1"><span className="font-medium">Types:</span> 🏆 Milestone, 📝 Session</div>
            <div className="mb-1"><span className="font-medium">States:</span> 🔴 Locked, 🟡 Unlocked, 🟢 Completed</div>
            <div><span className="font-medium">Optional:</span> Milestones that are not required for progression</div>
          </div>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-left"
            onClick={resetPlanMilestones}
          >
            Reset Plan
          </button>
        </div>
      </div>
    </div>
  );
};

PlanConfigurations.propTypes = {
  unlockStrategy: PropTypes.string.isRequired,
  setUnlockStrategy: PropTypes.func.isRequired,
  resetPlanMilestones: PropTypes.func.isRequired
};

export default PlanConfigurations; 