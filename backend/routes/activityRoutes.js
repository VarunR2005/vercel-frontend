const express = require('express');
const router = express.Router();
const {
  addActivity, getActivities, getActivity,
  updateActivity, deleteActivity, getTodaySummary, getWeeklyStats,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/today', getTodaySummary);
router.get('/weekly', getWeeklyStats);
router.route('/').get(getActivities).post(addActivity);
router.route('/:id').get(getActivity).put(updateActivity).delete(deleteActivity);

module.exports = router;
