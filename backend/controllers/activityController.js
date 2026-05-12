const Activity = require('../models/Activity');

// @desc    Log new activity
// @route   POST /api/activities
const addActivity = async (req, res, next) => {
  try {
    const { date, calories, water, sleep, exercise, exerciseType, steps, mood, notes, caloriesBurned } = req.body;
    const activity = await Activity.create({
      user: req.user._id,
      date, calories, water, sleep, exercise,
      exerciseType, steps, mood, notes, caloriesBurned,
    });
    res.status(201).json({ success: true, activity });
  } catch (error) { next(error); }
};

// @desc    Get all activities for logged-in user
// @route   GET /api/activities
const getActivities = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;
    const query = { user: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [activities, total] = await Promise.all([
      Activity.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Activity.countDocuments(query),
    ]);
    res.json({ success: true, count: activities.length, total, page: parseInt(page), activities });
  } catch (error) { next(error); }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, user: req.user._id });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, activity });
  } catch (error) { next(error); }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, activity });
  } catch (error) { next(error); }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) { next(error); }
};

// @desc    Get today's summary
// @route   GET /api/activities/today
const getTodaySummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    const summary = activities.reduce(
      (acc, a) => ({
        calories: acc.calories + (a.calories || 0),
        water: acc.water + (a.water || 0),
        sleep: acc.sleep + (a.sleep || 0),
        exercise: acc.exercise + (a.exercise || 0),
        steps: acc.steps + (a.steps || 0),
        caloriesBurned: acc.caloriesBurned + (a.caloriesBurned || 0),
      }),
      { calories: 0, water: 0, sleep: 0, exercise: 0, steps: 0, caloriesBurned: 0 }
    );

    res.json({ success: true, summary, activities });
  } catch (error) { next(error); }
};

// @desc    Get weekly stats (last 7 days)
// @route   GET /api/activities/weekly
const getWeeklyStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Group by day
    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      grouped[key] = { date: key, calories: 0, water: 0, sleep: 0, exercise: 0, steps: 0, caloriesBurned: 0 };
    }

    activities.forEach((a) => {
      const key = new Date(a.date).toISOString().split('T')[0];
      if (grouped[key]) {
        grouped[key].calories += a.calories || 0;
        grouped[key].water += a.water || 0;
        grouped[key].sleep += a.sleep || 0;
        grouped[key].exercise += a.exercise || 0;
        grouped[key].steps += a.steps || 0;
        grouped[key].caloriesBurned += a.caloriesBurned || 0;
      }
    });

    res.json({ success: true, weeklyData: Object.values(grouped) });
  } catch (error) { next(error); }
};

module.exports = { addActivity, getActivities, getActivity, updateActivity, deleteActivity, getTodaySummary, getWeeklyStats };
