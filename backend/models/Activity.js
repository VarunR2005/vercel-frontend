const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    calories: { type: Number, default: 0, min: 0 },
    water: { type: Number, default: 0, min: 0 },       // ml
    sleep: { type: Number, default: 0, min: 0, max: 24 }, // hours
    exercise: { type: Number, default: 0, min: 0 },    // minutes
    exerciseType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'sports', 'other'],
      default: 'other',
    },
    steps: { type: Number, default: 0, min: 0 },
    mood: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'bad', 'terrible'],
      default: 'neutral',
    },
    notes: { type: String, maxlength: 500 },
    caloriesBurned: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Index for fast date-range queries per user
activitySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
