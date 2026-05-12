const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get weekly report
// @route   GET /api/reports/weekly
const getWeeklyReport = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo },
    });

    const count = activities.length || 1;
    const totals = activities.reduce(
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

    const averages = {
      calories: Math.round(totals.calories / count),
      water: Math.round(totals.water / count),
      sleep: parseFloat((totals.sleep / count).toFixed(1)),
      exercise: Math.round(totals.exercise / count),
      steps: Math.round(totals.steps / count),
      caloriesBurned: Math.round(totals.caloriesBurned / count),
    };

    const user = await User.findById(req.user._id);
    const insights = generateInsights(averages, user);

    res.json({ success: true, period: 'weekly', totals, averages, activeDays: count, insights });
  } catch (error) { next(error); }
};

// @desc    Get monthly report
// @route   GET /api/reports/monthly
const getMonthlyReport = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    const count = activities.length || 1;
    const totals = activities.reduce(
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

    const averages = {
      calories: Math.round(totals.calories / count),
      water: Math.round(totals.water / count),
      sleep: parseFloat((totals.sleep / count).toFixed(1)),
      exercise: Math.round(totals.exercise / count),
      steps: Math.round(totals.steps / count),
      caloriesBurned: Math.round(totals.caloriesBurned / count),
    };

    // Group by week for trend
    const weeklyTrend = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(thirtyDaysAgo);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekActivities = activities.filter((a) => {
        const d = new Date(a.date);
        return d >= weekStart && d <= weekEnd;
      });
      weeklyTrend.push({
        week: i + 1,
        calories: weekActivities.reduce((s, a) => s + (a.calories || 0), 0),
        exercise: weekActivities.reduce((s, a) => s + (a.exercise || 0), 0),
        water: weekActivities.reduce((s, a) => s + (a.water || 0), 0),
      });
    }

    const user = await User.findById(req.user._id);
    const insights = generateInsights(averages, user);

    res.json({ success: true, period: 'monthly', totals, averages, activeDays: count, weeklyTrend, insights });
  } catch (error) { next(error); }
};

// @desc    Get BMI info
// @route   GET /api/reports/bmi
const getBMI = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.height || !user.weight)
      return res.status(400).json({ success: false, message: 'Please update height and weight in your profile' });

    const bmi = user.bmi;
    let category, color;
    if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6'; }
    else if (bmi < 25) { category = 'Normal weight'; color = '#22c55e'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b'; }
    else { category = 'Obese'; color = '#ef4444'; }

    const idealWeightMin = parseFloat((18.5 * Math.pow(user.height / 100, 2)).toFixed(1));
    const idealWeightMax = parseFloat((24.9 * Math.pow(user.height / 100, 2)).toFixed(1));

    res.json({ success: true, bmi, category, color, idealWeightRange: { min: idealWeightMin, max: idealWeightMax }, height: user.height, weight: user.weight });
  } catch (error) { next(error); }
};

const generateInsights = (averages, user) => {
  const insights = [];
  if (user.dailyCalorieGoal && averages.calories > user.dailyCalorieGoal)
    insights.push({ type: 'warning', message: `Your average calorie intake (${averages.calories} kcal) exceeds your goal of ${user.dailyCalorieGoal} kcal.` });
  else if (averages.calories > 0)
    insights.push({ type: 'success', message: `Great job staying within your calorie goal! Average: ${averages.calories} kcal/day.` });

  if (averages.sleep < 7)
    insights.push({ type: 'warning', message: `You're averaging only ${averages.sleep}h of sleep. Aim for 7–9 hours for optimal health.` });
  else
    insights.push({ type: 'success', message: `Excellent sleep average of ${averages.sleep}h per night!` });

  if (averages.water < 2000)
    insights.push({ type: 'info', message: `Try to drink more water. Current average: ${averages.water}ml/day. Target: 2500ml.` });

  if (averages.exercise >= 30)
    insights.push({ type: 'success', message: `Great exercise routine! Averaging ${averages.exercise} minutes per day.` });
  else
    insights.push({ type: 'warning', message: `Try to exercise at least 30 minutes daily. Current: ${averages.exercise} min/day.` });

  return insights;
};

module.exports = { getWeeklyReport, getMonthlyReport, getBMI };
