const Student = require('../models/Student');

// ─── GET ALL STUDENTS (with Search + Pagination) ──────────
// GET /api/students
const getStudents = async (req, res) => {
  try {
    // Get query parameters from URL
    // Example: /api/students?page=1&limit=5&search=John
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';

    // Calculate how many records to skip
    // Page 1 → skip 0, Page 2 → skip 5, Page 3 → skip 10
    const skip = (page - 1) * limit;

    // Build search filter
    // Search in name OR course fields (case-insensitive)
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Get students with filter, skip, and limit
    const students = await Student.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Newest first

    // Count total matching students (for pagination)
    const total = await Student.countDocuments(searchFilter);

    res.json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE STUDENT ───────────────────────────────────
// GET /api/students/:id
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CREATE STUDENT ───────────────────────────────────────
// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, age, course } = req.body;

    // Check if email already exists
    const emailExists = await Student.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Get profile picture path if uploaded
    const profilePicture = req.file ? req.file.filename : '';

    // Create the student
    const student = await Student.create({
      name,
      email,
      age,
      course,
      profilePicture,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE STUDENT ───────────────────────────────────────
// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, age, course } = req.body;

    // If new picture uploaded, use it. Otherwise keep existing.
    const profilePicture = req.file
      ? req.file.filename
      : student.profilePicture;

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, age, course, profilePicture },
      { new: true, runValidators: true }
      // new: true → returns the updated document
      // runValidators → runs schema validations on update too
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE STUDENT ───────────────────────────────────────
// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DASHBOARD ANALYTICS ──────────────────────────────────
// GET /api/students/analytics
const getAnalytics = async (req, res) => {
  try {
    // Total number of students
    const totalStudents = await Student.countDocuments();

    // Count students grouped by course
    const studentsByCourse = await Student.aggregate([
      {
        $group: {
          _id: '$course',         // Group by course field
          count: { $sum: 1 },     // Count each group
        },
      },
      {
        $sort: { count: -1 },     // Sort by most students first
      },
    ]);

    // Most recent 5 students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalStudents,
      studentsByCourse,
      recentStudents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getAnalytics,
};