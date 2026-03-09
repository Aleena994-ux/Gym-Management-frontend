import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserAttendancesAPI } from '../../services/allAPI';
import UserSidebar from '../components/UserSidebar';

function UserAttendance() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userAttendances, setUserAttendances] = useState([]);

  // Fetch attendances
  const getUserAttendances = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getUserAttendancesAPI(userId, reqHeader);
      if (result.status === 200) setUserAttendances(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load your attendances");
    }
  };

  // Load token and userId
  useEffect(() => {
    const tokenFromStorage = sessionStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      const decoded = JSON.parse(atob(tokenFromStorage.split('.')[1]));
      setUserId(decoded.userId);
    }
  }, []);

  useEffect(() => {
    if (token && userId) getUserAttendances();
  }, [token, userId]);

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <UserSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">My Attendance</h1>

        {/* Attendance Grid */}
        <div className="md:grid grid-cols-3 gap-6 w-full my-5">
          {userAttendances.length > 0 ? (
            userAttendances.map((attendance, index) => (
              <div
                key={attendance._id || index}
                className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-lg transition"
              >
                <p className="text-gray-800 font-semibold mb-2">
                  Date: {attendance?.date ? new Date(attendance.date).toLocaleDateString() : "Invalid Date"}
                </p>
                <p className="text-gray-600">Status: {attendance?.status || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="text-red-600 font-semibold text-center mt-10 text-xl col-span-3">
              No attendance records...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserAttendance;
