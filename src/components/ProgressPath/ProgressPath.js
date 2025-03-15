import React from 'react';
import { getStateEmoji, getTypeIcon } from '../utils';

const ProgressPath = ({ milestones }) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold mb-2 text-blue-700">Visual Progress Path:</h3>
      <div className="flex flex-wrap items-center my-2">
        {milestones.map((milestone, index) => (
          <React.Fragment key={milestone.id}>
            <div className={`
              px-3 py-2 rounded-lg border flex flex-col items-center
              ${milestone.state === 'locked' ? 'bg-red-50 border-red-300 text-red-700' : 
                milestone.state === 'unlocked' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 
                'bg-green-50 border-green-300 text-green-700'}
            `}>
              <div>{getTypeIcon(milestone.type)}</div>
              <div className="text-xs font-medium mt-1">{getStateEmoji(milestone.state)}</div>
              <div className="text-xs mt-1 flex items-center">
                {milestone.name}
                {milestone.optional && <span className="ml-1 text-purple-500">*</span>}
              </div>
            </div>
            
            {index < milestones.length - 1 && (
              <div className={`w-8 h-1 mx-1 ${
                milestone.state === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressPath; 