
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        SID: {
            type: Number,
            required: [true, 'Student ID is required'],
            unique: true,
            min: [1, 'Student ID must be a positive number'],
            validate: {
                validator: Number.isSafeInteger,
                message: 'Student ID must be a safe integer'
            }
        },

        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [1, 'First name cannot be empty'],
            maxlength: [50, 'First name cannot exceed 50 characters']
        },

        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [1, 'Last name cannot be empty'],
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            maxlength: [254, 'Email cannot exceed 254 characters'],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address'
            ]
        },

        nearCity: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
            maxlength: [100, 'City cannot exceed 100 characters']
        },

        course: {
            type: [{
                type: String,
                trim: true,
                maxlength: [100, 'Course name cannot exceed 100 characters']
            }],
            default: []
        },

        guardian: {
            type: String,
            required: [true, 'Guardian name is required'],
            trim: true,
            maxlength: [100, 'Guardian name cannot exceed 100 characters']
        },

        subject: {
            type: [{
                type: String,
                trim: true,
                maxlength: [100, 'Subject name cannot exceed 100 characters']
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
