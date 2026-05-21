import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../services/api';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll({
        page,
        limit: 5,
        search,
      });
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTotalStudents(response.data.totalStudents);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentAPI.delete(id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 Students</h1>
        <Link
          to="/students/add"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition text-center"
        >
          + Add Student
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or course..."
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Total Count */}
      <p className="text-gray-500 mb-4 text-sm">
        Showing {students.length} of {totalStudents} students
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-lg">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg">
            No students found.{' '}
            <Link to="/students/add" className="text-indigo-600 hover:underline">
              Add one!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Student</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Age</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Course</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-t hover:bg-gray-50 transition">
                    {/* Profile + Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {student.profilePicture ? (
                          <img
                            src={student.profilePicture}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                    <td className="p-4 text-gray-600">{student.age}</td>
                    <td className="p-4">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                        {student.course}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/students/edit/${student._id}`}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Students;