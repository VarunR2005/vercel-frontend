const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['weight', 'calories', 'water', 'sleep', 'exercise', 'steps', 'custom'],
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    deadline: { type: Date },
    achieved: { type: Boolean, default: false },
    achievedAt: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    notes: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

goalSchema.virtual('progressPercent').get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min(100, parseFloat(((this.currentValue / this.targetValue) * 100).toFixed(1)));
});

goalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);
