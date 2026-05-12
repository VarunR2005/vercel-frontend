const Goal = require('../models/Goal');

// @desc    Create goal
// @route   POST /api/goals
const createGoal = async (req, res, next) => {
  try {
    const { title, type, targetValue, unit, deadline, priority, notes } = req.body;
    const goal = await Goal.create({
      user: req.user._id, title, type, targetValue, unit, deadline, priority, notes,
    });
    res.status(201).json({ success: true, goal });
  } catch (error) { next(error); }
};

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = async (req, res, next) => {
  try {
    const { achieved } = req.query;
    const query = { user: req.user._id };
    if (achieved !== undefined) query.achieved = achieved === 'true';
    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, goals });
  } catch (error) { next(error); }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
const updateGoal = async (req, res, next) => {
  try {
    const { currentValue, title, targetValue, deadline, priority, notes } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    if (title !== undefined) goal.title = title;
    if (targetValue !== undefined) goal.targetValue = targetValue;
    if (deadline !== undefined) goal.deadline = deadline;
    if (priority !== undefined) goal.priority = priority;
    if (notes !== undefined) goal.notes = notes;
    if (currentValue !== undefined) {
      goal.currentValue = currentValue;
      if (currentValue >= goal.targetValue && !goal.achieved) {
        goal.achieved = true;
        goal.achievedAt = new Date();
      }
    }
    await goal.save();
    res.json({ success: true, goal });
  } catch (error) { next(error); }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) { next(error); }
};

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };
