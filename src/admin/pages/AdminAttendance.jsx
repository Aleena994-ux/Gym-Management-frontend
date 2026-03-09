import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { FaEdit, FaCheck } from "react-icons/fa";
import {
  getAllAttendancesAPI,
  markAttendanceAPI,
  getAllUsersAPI,
} from "../../services/allAPI";

function AdminAttendance() {
  const [token, setToken] = useState("");
  const [allAttendances, setAllAttendances] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [attendanceDetails, setAttendanceDetails] = useState({
    userId: "",
    date: "",
    status: "present",
  });

  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("present");
  const [editDate, setEditDate] = useState("");

  /* ---------------- FETCH ATTENDANCES ---------------- */
  const getAllAttendances = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getAllAttendancesAPI(reqHeader);

      if (result.status === 200) {
        const filtered = result.data.filter((att) => {
          const user = att.userId;
          if (!user) return false;

          const isExpired =
            user.membershipStatus === "expired" ||
            (user.membershipEndDate &&
              new Date(user.membershipEndDate) < new Date());

          return user.status === "active-member" && !isExpired;
        });

        setAllAttendances(filtered);
      }
    } catch {
      toast.error("Failed to load attendances");
    }
  };

  /* ---------------- FETCH USERS ---------------- */
  const getAllUsers = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getAllUsersAPI(reqHeader);

      if (result.status === 200) {
        const filteredUsers = result.data.filter((user) => {
          const isExpired =
            user.membershipStatus === "expired" ||
            (user.membershipEndDate &&
              new Date(user.membershipEndDate) < new Date());

          return (
            user.role !== "admin" &&
            user.status === "active-member" &&
            !isExpired
          );
        });

        setAllUsers(filteredUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- MARK ATTENDANCE ---------------- */
  const handleMarkAttendance = async () => {
    const { userId, date, status } = attendanceDetails;
    if (!userId || !date) {
      toast.info("Fill the form completely");
      return;
    }

    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await markAttendanceAPI(attendanceDetails, reqHeader);

      if (result.status === 200) {
        toast.success("Attendance marked");
        setAttendanceDetails({ userId: "", date: "", status: "present" });
        getAllAttendances();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ---------------- UPDATE ATTENDANCE ---------------- */
  const handleUpdateAttendance = async (attendance) => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const payload = {
        userId: attendance.userId._id,
        date: editDate,
        status: editStatus,
      };

      const result = await markAttendanceAPI(payload, reqHeader);
      if (result.status === 200) {
        toast.success("Attendance updated");

        setAllAttendances((prev) =>
          prev.map((att) =>
            att._id === attendance._id
              ? { ...att, date: editDate, status: editStatus }
              : att
          )
        );

        setEditId(null);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredAttendances = allAttendances.filter((att) => {
    const matchName = att.userId?.username
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchDate = searchDate
      ? new Date(att.date).toISOString().slice(0, 10) === searchDate
      : true;

    return matchName && matchDate;
  });

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      getAllAttendances();
      getAllUsers();
    }
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <div className="px-8 py-4 bg-white shadow">
          <h1 className="text-xl font-semibold">TAKE ATTENDANCE</h1>
        </div>

        <div className="p-8">
          {/* MARK ATTENDANCE */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={attendanceDetails.userId}
                onChange={(e) =>
                  setAttendanceDetails({
                    ...attendanceDetails,
                    userId: e.target.value,
                  })
                }
                className="p-3 border rounded"
              >
                <option value="">Select User</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={attendanceDetails.date}
                onChange={(e) =>
                  setAttendanceDetails({
                    ...attendanceDetails,
                    date: e.target.value,
                  })
                }
                className="p-3 border rounded"
              />

              <select
                value={attendanceDetails.status}
                onChange={(e) =>
                  setAttendanceDetails({
                    ...attendanceDetails,
                    status: e.target.value,
                  })
                }
                className="p-3 border rounded"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <div className="text-right mt-4">
              <button
                onClick={handleMarkAttendance}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Mark
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">Search by Username</h3>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="p-3 border rounded w-full"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">Search by Date</h3>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="p-3 border rounded w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendances.map((att) => (
                  <tr key={att._id} className="border-b">
                    <td className="p-3">{att.userId?.username}</td>

                    <td className="p-3">
                      {editId === att._id ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        new Date(att.date).toLocaleDateString()
                      )}
                    </td>

                    <td className="p-3">
                      {editId === att._id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="border p-1 rounded w-full"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      ) : (
                        <span
                          className={`font-semibold ${
                            att.status === "present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {att.status}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {editId === att._id ? (
                        <FaCheck
                          className="text-green-600 cursor-pointer"
                          onClick={() => handleUpdateAttendance(att)}
                        />
                      ) : (
                        <FaEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => {
                            setEditId(att._id);
                            setEditStatus(att.status);
                            setEditDate(
                              new Date(att.date).toISOString().slice(0, 10)
                            );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}

                {filteredAttendances.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-red-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;
