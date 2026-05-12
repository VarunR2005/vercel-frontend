const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    age: { type: Number, min: 1, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number, min: 50, max: 300 }, // cm
    weight: { type: Number, min: 10, max: 500 }, // kg
    profilePicture: { type: String, default: '' },
    dailyCalorieGoal: { type: Number, default: 2000 },
    dailyWaterGoal: { type: Number, default: 2500 }, // ml
    dailySleepGoal: { type: Number, default: 8 }, // hours
    dailyExerciseGoal: { type: Number, default: 30 }, // minutes
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hash password before save (Mongoose v9 async middleware — no next() needed)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual: BMI
userSchema.virtual('bmi').get(function () {
  if (this.height && this.weight) {
    const heightM = this.height / 100;
    return parseFloat((this.weight / (heightM * heightM)).toFixed(1));
  }
  return null;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
