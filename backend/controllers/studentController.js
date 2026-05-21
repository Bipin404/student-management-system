const Student = require('../models/Student');

// ─── GET ALL STUDENTS (with Search + Pagination) ──────────
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const students = await Student.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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
const createStudent = async (req, res) => {
  try {
    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const emailExists = await Student.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Cloudinary returns full URL in req.file.path
    const profilePicture = req.file ? req.file.path : '';

    const student = await Student.create({
      name,
      email,
      age: Number(age),
      course,
      profilePicture,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE STUDENT ───────────────────────────────────────
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, age, course } = req.body;

    // Cloudinary returns full URL in req.file.path
    const profilePicture = req.file
      ? req.file.path
      : student.profilePicture;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, age: Number(age), course, profilePicture },
      { new: true, runValidators: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE STUDENT ───────────────────────────────────────
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
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const studentsByCourse = await Student.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

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