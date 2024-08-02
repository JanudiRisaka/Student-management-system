const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Student = require('./models/studentModel');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

const htmlFiles = ['home.html', 'delete.html', 'display.html', 'edit.html', 'add.html'];

htmlFiles.forEach((file) => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

app.get('/', (req, res) => {
  res.send('Express is working');
});

// GET request for student data
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log('Error fetching student data:', error.message);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

// POST request to add a student
app.post('/students', async (req, res) => {
    try {
      console.log('Received request body:', req.body); // Add this line for logging
      const student = await Student.create(req.body);
      console.log('Student added to MongoDB:', student);
      res.status(201).json(student);
    } catch (error) {
      console.log('Error adding student to MongoDB:', error);
      res.status(500).json({ message: 'Error adding student to MongoDB', error: error.message });
    }
});
//delete
app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
      const deletedStudent = await Student.findOneAndDelete({ SID: parseInt(studentId, 10) });
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      console.log('Student deleted from MongoDB:', deletedStudent);
      res.status(200).json(deletedStudent);
    } catch (error) {
      console.error('Error deleting student:', error); 
      res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
});   
//PUT request to update a student
app.put('/students/update/:option', async (req, res) => {
    const studentId = req.params.option;
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { SID: parseInt(studentId, 10) },
            req.body, // Update data
            { new: true } // Options
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log('Student updated in MongoDB:', updatedStudent);
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
});

// Search for students by different criteria
app.get('/students/search/:option/:value', async (req, res) => {
  const option = req.params.option;
    const value = req.params.value;

    console.log('Search Option:', option);
    console.log('Search Value:', value);

  try {
      let students;

      // Your search logic based on 'option' and 'value'
      switch (option) {
          case 'SID':
            students = await Student.find({ SID: parseInt(value, 10) });
              break;
          case 'firstname':
              students = await Student.find({ firstName: value });
              break;
          case 'lastname':
              students = await Student.find({ lastName: value });
              break;
          case 'email':
              students = await Student.find({ email: value });
              break;
          case 'city':
              students = await Student.find({ nearCity: value });
              break;
          case 'course':
              students = await Student.find({ course: value });
              break;
          case 'guardian':
              students = await Student.find({ guardian: value });
              break;
          default:
              return res.status(400).json({ message: 'Invalid search option' });
      }

      if (students.length === 0) {
          return res.status(404).json({ message: 'No students found' });
      }

      res.status(200).json(students);
  } catch (error) {
      console.error('Error searching for students:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
mongoose
  .connect('mongodb+srv://jrsemini:1234@student-management.q4ui3th.mongodb.net/stu-management?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, function() {
      console.log('Server is running on 3000');
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

