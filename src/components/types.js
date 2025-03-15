import PropTypes from 'prop-types';

export const MilestoneShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['milestone', 'session']).isRequired,
  state: PropTypes.oneOf(['locked', 'unlocked', 'completed']).isRequired,
  optional: PropTypes.bool.isRequired
});

export const CommunicationShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['plan_start', 'milestone_unlocked', 'milestone_unlocked_followup']).isRequired,
  milestone: PropTypes.oneOfType([MilestoneShape, PropTypes.null]),
  date: PropTypes.instanceOf(Date).isRequired,
  description: PropTypes.string.isRequired
}); 