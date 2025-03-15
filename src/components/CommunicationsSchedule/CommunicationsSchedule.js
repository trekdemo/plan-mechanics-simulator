import React from 'react';
import { formatDate } from '../utils';

const CommunicationsSchedule = ({ communications, startDate, currentDate }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Communications Schedule</h2>
      <div className="flex items-center mb-4">
        <p className="text-sm text-gray-600 mr-4">Plan start date: {formatDate(startDate)}</p>
        <p className="text-sm text-gray-600">Current date: {formatDate(currentDate)}</p>
      </div>
      
      {communications.length === 0 ? (
        <p className="text-gray-500 italic">No communications scheduled yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trigger Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {communications
                .sort((a, b) => a.date - b.date)
                .map((comm) => (
                  <tr key={comm.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(comm.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {comm.type === 'plan_start' ? 'Plan Start' : 
                        comm.type === 'milestone_unlocked' ? 'Milestone Unlocked' :
                        comm.type === 'milestone_unlocked_followup' ? 'Timed Follow-up' : 
                        comm.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {comm.description}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommunicationsSchedule; 