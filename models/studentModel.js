const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  SID: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nearCity: {
    type: String,
    required: true
  },
  course: {
    type: [String],
    default: []
  },
  guardian: {
    type: String,
    required: true
  },
  subject: {
    type: [String],
    default: []
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;