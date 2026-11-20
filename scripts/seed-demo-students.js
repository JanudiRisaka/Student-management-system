
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Counter = require("../models/counterModel");

const students = [
  ["Nimal", "Perera", "Kandy", "Computer Science", "Programming"],
  ["Kavindi", "Silva", "Colombo", "Information Technology", "Database Systems"],
  ["Kasun", "Fernando", "Galle", "Software Engineering", "Web Development"],
  ["Tharushi", "Jayasinghe", "Matara", "Cybersecurity", "Network Security"],
  ["Dinuka", "Bandara", "Kurunegala", "Data Science", "Machine Learning"],
  ["Sanduni", "Rathnayake", "Negombo", "Computer Science", "Algorithms"],
  ["Isuru", "Wickramasinghe", "Kandy", "Information Technology", "Cloud Computing"],
  ["Hiruni", "Gunasekara", "Gampaha", "Software Engineering", "Software Testing"],
  ["Chamod", "Dissanayake", "Colombo", "Cybersecurity", "Ethical Hacking"],
  ["Amaya", "Senanayake", "Badulla", "Data Science", "Data Analytics"]
];

async function seed() {
  if (process.env.CONFIRM_DEMO_RESET !== "yes") {
    throw new Error("Set CONFIRM_DEMO_RESET=yes to replace records.");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const dbName = mongoose.connection.db.databaseName;
  console.log("Connected database:", dbName);

  if (!dbName.endsWith("-demo")) {
    throw new Error("Refusing to reset a non-demo database.");
  }

  // Delete existing demo students and reset the ID counter.
  await Student.deleteMany({});
  await Counter.deleteOne({ _id: "studentSID" });

  const dummyStudents = students.map((s, i) => ({
    SID: i + 1,
    firstName: s[0],
    lastName: s[1],
    email: `${s[0].toLowerCase()}.${s[1].toLowerCase()}@example.com`,
    nearCity: s[2],
    course: [s[3]],
    guardian: "Demo Guardian",
    subject: [s[4]]
  }));

  await Student.insertMany(dummyStudents);

  await Counter.updateOne(
    { _id: "studentSID" },
    { $set: { seq: dummyStudents.length } },
    { upsert: true }
  );

  console.log(`Successfully added ${dummyStudents.length} demo students.`);
}

seed()
  .catch(console.error)
  .finally(() => mongoose.disconnect());