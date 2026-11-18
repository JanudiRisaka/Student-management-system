
// =====================================================
// Student Management System
// Backend Server
// =====================================================

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Student = require('./models/studentModel');

const app = express();

// =====================================================
// Configuration
// =====================================================

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// =====================================================
// Middleware
// =====================================================

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Serve frontend files only from the public directory.
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// Helper Functions
// =====================================================

// Validate and parse a student ID.
function parseStudentId(value) {
    const id = Number(value);

    if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !/^\d+$/.test(String(value))
    ) {
        return null;
    }

    return id;
}

// Normalize student input and allow only expected fields.
function sanitizeStudentInput(data) {
    const allowedFields = [
        'SID',
        'firstName',
        'lastName',
        'email',
        'nearCity',
        'course',
        'guardian',
        'subject'
    ];

    const sanitizedData = {};

    for (const field of allowedFields) {
        if (!Object.prototype.hasOwnProperty.call(data, field)) {
            continue;
        }

        const value = data[field];

        // Handle course and subject arrays.
        if (field === 'course' || field === 'subject') {
            const values = Array.isArray(value) ? value : [value];

            if (
                !values.every(
                    item => typeof item === 'string'
                )
            ) {
                throw new Error(`Invalid ${field} format.`);
            }

            sanitizedData[field] = values
                .map(item => item.trim())
                .filter(item => item.length > 0);

            if (sanitizedData[field].some(item => item.length > 100)) {
                throw new Error(`${field} values cannot exceed 100 characters.`);
            }

            continue;
        }

        if (field === 'SID') {
            const id = parseStudentId(value);

            if (id === null) {
                throw new Error('Student ID must be a positive integer.');
            }

            sanitizedData.SID = id;
            continue;
        }

        if (typeof value !== 'string') {
            throw new Error(`${field} must be a string.`);
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length > 150) {
            throw new Error(`${field} cannot exceed 150 characters.`);
        }

        sanitizedData[field] = trimmedValue;
    }

    // Basic email format validation.
    if (
        sanitizedData.email !== undefined &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)
    ) {
        throw new Error('Please provide a valid email address.');
    }

    return sanitizedData;
}

// Check mandatory fields when creating a student.
function validateRequiredFields(data) {
    const requiredFields = [
        'SID',
        'firstName',
        'lastName',
        'email',
        'nearCity',
        'guardian'
    ];

    for (const field of requiredFields) {
        if (
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ''
        ) {
            throw new Error(`${field} is required.`);
        }
    }
}

// =====================================================
// Frontend Routes
// =====================================================

// Home page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// =====================================================
// STUDENT API ROUTES
// =====================================================

// GET: Retrieve all students.
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();

        return res.status(200).json(students);

    } catch (error) {
        console.error('Error fetching students:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve student records.'
        });
    }
});

// POST: Add a new student.
app.post('/students', async (req, res) => {
    try {
        if (
            !req.body ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                message: 'Invalid request body.'
            });
        }

        const studentData = sanitizeStudentInput(req.body);

        validateRequiredFields(studentData);

        const student = await Student.create(studentData);

        return res.status(201).json(student);

    } catch (error) {
        console.error('Error adding student:', error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A student with this information already exists.'
            });
        }

        if (
            error.message.includes('Invalid') ||
            error.message.includes('required') ||
            error.message.includes('cannot exceed') ||
            error.message.includes('must be') ||
            error.message.includes('valid email address')
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid student information.'
            });
        }

        return res.status(500).json({
            message: 'Unable to add student.'
        });
    }
});

// DELETE: Delete a student using SID.
app.delete('/students/:id', async (req, res) => {
    try {
        const studentId = parseStudentId(req.params.id);

        if (studentId === null) {
            return res.status(400).json({
                message: 'Invalid student ID.'
            });
        }

        const deletedStudent = await Student.findOneAndDelete({
            SID: studentId
        });

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Student not found.'
            });
        }

        return res.status(200).json({
            message: 'Student deleted successfully.',
            student: deletedStudent
        });

    } catch (error) {
        console.error('Error deleting student:', error.message);

        return res.status(500).json({
            message: 'Unable to delete student.'
        });
    }
});

// PUT: Update an existing student using SID.
app.put('/students/update/:option', async (req, res) => {
    try {
        const studentId = parseStudentId(req.params.option);

        if (studentId === null) {
            return res.status(400).json({
                message: 'Invalid student ID.'
            });
        }

        if (
            !req.body ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                message: 'Invalid request body.'
            });
        }

        // Student ID is immutable and cannot be updated.
        if (Object.prototype.hasOwnProperty.call(req.body, 'SID')) {
            return res.status(400).json({
                message: 'Student ID cannot be updated.'
            });
        }

        const updateData = sanitizeStudentInput(req.body);

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: 'No valid fields provided for updating.'
            });
        }

        const updatedStudent = await Student.findOneAndUpdate(
            { SID: studentId },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: 'Student not found.'
            });
        }

        return res.status(200).json(updatedStudent);

    } catch (error) {
        console.error('Error updating student:', error.message);

        if (
            error.message.includes('Invalid') ||
            error.message.includes('cannot exceed') ||
            error.message.includes('must be') ||
            error.message.includes('valid email address')
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid student information.'
            });
        }

        return res.status(500).json({
            message: 'Unable to update student.'
        });
    }
});

// GET: Search students using different criteria.
app.get('/students/search/:option/:value', async (req, res) => {
    try {
        const { option, value } = req.params;

        const searchFields = {
            firstname: 'firstName',
            lastname: 'lastName',
            email: 'email',
            city: 'nearCity',
            course: 'course',
            guardian: 'guardian'
        };

        let searchQuery;

        if (option === 'SID') {
            const studentId = parseStudentId(value);

            if (studentId === null) {
                return res.status(400).json({
                    message: 'Invalid student ID.'
                });
            }

            searchQuery = { SID: studentId };

        } else if (searchFields[option]) {
            searchQuery = {
                [searchFields[option]]: value
            };

        } else {
            return res.status(400).json({
                message: 'Invalid search option.'
            });
        }

        const students = await Student.find(searchQuery);

        if (students.length === 0) {
            return res.status(404).json({
                message: 'No students found.'
            });
        }

        return res.status(200).json(students);

    } catch (error) {
        console.error('Error searching students:', error.message);

        return res.status(500).json({
            message: 'Unable to search student records.'
        });
    }
});

// =====================================================
// Error Handling
// =====================================================

// Handle unknown API routes.
app.use('/students', (req, res) => {
    res.status(404).json({
        message: 'Student API endpoint not found.'
    });
});

// Handle malformed JSON.
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            message: 'Invalid JSON request body.'
        });
    }

    console.error('Unexpected server error:', error.message);

    return res.status(500).json({
        message: 'An unexpected server error occurred.'
    });
});

// =====================================================
// Database Connection and Server Startup
// =====================================================

async function startServer() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is missing from environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);

        console.log('Connected to MongoDB successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Application: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

startServer();