const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Path to JSON file
const filePath = path.join(__dirname, "students.json");

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend files

// Get all students (Read)
app.get("/students", (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  const data = fs.readFileSync(filePath, "utf8");
  res.json(JSON.parse(data || "[]"));
});

// Add student (Create)
app.post("/students", (req, res) => {
  const { name, rollNo, department } = req.body;

  let students = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    students = JSON.parse(data || "[]");
  }

  students.push({ name, rollNo, department });
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2), "utf8");

  res.json({ message: "✅ Student added successfully!" });
});

// Delete student by roll number
app.delete("/students/:rollNo", (req, res) => {
  const rollNo = req.params.rollNo;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No student data found!" });
  }

  const data = fs.readFileSync(filePath, "utf8");
  let students = JSON.parse(data || "[]");

  const updatedStudents = students.filter((s) => s.rollNo !== rollNo);

  fs.writeFileSync(filePath, JSON.stringify(updatedStudents, null, 2), "utf8");
  res.json({ message: "❌ Student deleted successfully!" });
});

// Update student by roll number
app.put("/students/:rollNo", (req, res) => {
  const rollNo = req.params.rollNo;
  const { name, department } = req.body;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No student data found!" });
  }

  const data = fs.readFileSync(filePath, "utf8");
  let students = JSON.parse(data || "[]");

  let student = students.find((s) => s.rollNo === rollNo);
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }

  // Update fields
  student.name = name;
  student.department = department;

  fs.writeFileSync(filePath, JSON.stringify(students, null, 2), "utf8");
  res.json({ message: "✏️ Student updated successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
