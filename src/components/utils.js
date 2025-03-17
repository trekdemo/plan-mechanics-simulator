// Date formatting utilities
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// UI utilities
export const getStateColor = (state) => {
  switch(state) {
    case 'locked': return 'bg-red-100 border-red-300';
    case 'unlocked': return 'bg-yellow-100 border-yellow-300';
    case 'completed': return 'bg-green-100 border-green-300';
    default: return 'bg-gray-100 border-gray-300';
  }
};

export const getStateEmoji = (state) => {
  switch(state) {
    case 'locked': return '🔴';
    case 'unlocked': return '🟡';
    case 'completed': return '🟢';
    default: return '⚪';
  }
};

export const getTypeIcon = (type) => {
  return type === 'session' 
    ? <span className="text-blue-500">📝</span> 
    : <span className="text-purple-500">🏆</span>;
};

export const UNLOCK_STRATEGIES = {
  BY_DATE: 'BY_DATE',
  BY_COMPLETION: 'BY_COMPLETION',
  BY_BOTH: 'BY_BOTH'
}; 