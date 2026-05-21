import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await studentAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  // Format data for chart
  const chartData = analytics?.studentsByCourse?.map((item) => ({
    course: item._id,
    students: item.count,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500">
          <p className="text-gray-500 text-sm">Total Students</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {analytics?.totalStudents || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Courses</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {analytics?.studentsByCourse?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Recent Additions</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {analytics?.recentStudents?.length || 0}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Students per Course
        </h2>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-10">
            No data yet. Add some students first!
          </p>
        )}
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recently Added Students
        </h2>
        {analytics?.recentStudents?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Course</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Age</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentStudents.map((student) => (
                  <tr key={student._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                        {student.course}
                      </span>
                    </td>
                    <td className="p-3">{student.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">No students added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;