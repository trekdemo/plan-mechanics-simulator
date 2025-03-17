import React from 'react';
import PropTypes from 'prop-types';
import { formatDateForInput } from '../utils';

const CurrentDateControl = ({ currentDate, handleDateChange, handleNextDay }) => {
  return (
    <div className="fixed right-4 top-4 bg-white p-4 rounded-lg shadow-lg border border-blue-200 z-50">
      <div className="flex flex-col space-y-2">
        <label htmlFor="currentDate" className="font-medium text-sm">Current Date:</label>
        <div className="flex items-center space-x-2">
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
    </div>
  );
};

CurrentDateControl.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleNextDay: PropTypes.func.isRequired
};

export default CurrentDateControl; 