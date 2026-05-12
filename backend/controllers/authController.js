const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, height, weight } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, age, gender, height, weight });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        age: user.age, gender: user.gender, height: user.height,
        weight: user.weight, bmi: user.bmi,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyWaterGoal: user.dailyWaterGoal,
        dailySleepGoal: user.dailySleepGoal,
        dailyExerciseGoal: user.dailyExerciseGoal,
      },
    });
  } catch (error) { next(error); }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        age: user.age, gender: user.gender, height: user.height,
        weight: user.weight, bmi: user.bmi,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyWaterGoal: user.dailyWaterGoal,
        dailySleepGoal: user.dailySleepGoal,
        dailyExerciseGoal: user.dailyExerciseGoal,
      },
    });
  } catch (error) { next(error); }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, age, gender, height, weight,
      dailyCalorieGoal, dailyWaterGoal, dailySleepGoal, dailyExerciseGoal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, gender, height, weight,
        dailyCalorieGoal, dailyWaterGoal, dailySleepGoal, dailyExerciseGoal },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
