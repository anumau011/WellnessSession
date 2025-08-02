const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  jsonUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    enum: ['yoga', 'meditation', 'breathing', 'mindfulness', 'other'],
    default: 'other'
  },
  lastSaved: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isModified() && !this.isNew) {
    this.lastSaved = Date.now();
  }
  next();
});

// Index for better query performance
sessionSchema.index({ author: 1, status: 1 });
sessionSchema.index({ tags: 1 });
sessionSchema.index({ category: 1 });

module.exports = mongoose.model('Session', sessionSchema);
