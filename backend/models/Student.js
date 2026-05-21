const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [100, 'Age must be less than 100'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    // timestamps automatically adds:
    // createdAt — when the record was created
    // updatedAt — when the record was last updated
  }
);

module.exports = mongoose.model('Student', studentSchema);