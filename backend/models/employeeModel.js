const mongoose = require('mongoose');

// Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [
        /^[0-9]{10,15}$/,
        'Phone number must be between 10 to 15 digits',
      ],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary must be positive'],
    },
    dateHired: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
