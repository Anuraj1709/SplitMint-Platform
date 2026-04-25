import mongoose from 'mongoose';

const SplitSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },
  amount: {
    type: Number,
    required: false,
  },
  percentage: {
    type: Number,
    required: false,
  },
});

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage'],
    default: 'equal',
  },
  splits: [SplitSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);