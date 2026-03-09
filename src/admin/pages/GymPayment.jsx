import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { getAllUsersAPI } from "../../services/allAPI";

function GymPayment() {
  const [token, setToken] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchName, setSearchName] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  const getAllUsers = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getAllUsersAPI(reqHeader);
      if (result.status === 200) {
        // Show ONLY paid users 
        const paidUsers = result.data.filter(
          (user) =>
            user.role !== "admin" && user.paymentStatus === "paid"
        );
        setAllUsers(paidUsers);
      }
    } catch {
      toast.error("Failed to load users");
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchName.toLowerCase())
  );

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      getAllUsers();
    }
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <div className="px-8 py-4 bg-white shadow">
          <h1 className="text-xl font-semibold">PAYMENT MANAGEMENT</h1>
        </div>

        <div className="p-8">
          {/* SEARCH */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">Search by Username</h3>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-3 border rounded w-full max-w-md"
              placeholder="Enter username..."
            />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">Membership Duration</th>
                  <th className="p-3">Membership Start</th>
                  <th className="p-3">Membership End</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className="font-semibold text-green-600">
                        {user.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.membershipDuration || "N/A"} Months
                    </td>
                    <td className="p-3">
                      {user.membershipStartDate
                        ? new Date(
                            user.membershipStartDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {user.membershipEndDate
                        ? new Date(
                            user.membershipEndDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-red-500">
                      No users found
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

export default GymPayment;