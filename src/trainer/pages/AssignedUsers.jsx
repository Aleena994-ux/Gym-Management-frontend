import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsersForTrainerAPI } from "../../services/allAPI";
import TrainerSidebar from "../components/TrainerSidebar";

function AssignedUsers() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getAssignedUsers = async () => {
    try {
      const result = await getAllUsersForTrainerAPI({
        Authorization: `Bearer ${token}`,
      });

      if (result.status === 200) {
        const filteredUsers = result.data.filter((user) => {
          const isExpired =
            user.membershipStatus === "expired" ||
            (user.membershipEndDate &&
              new Date(user.membershipEndDate) < new Date());

          return !isExpired;
        });

        setUsers(filteredUsers);
      }
    } catch (error) {
      toast.error("Failed to fetch assigned users");
    }
  };

  useEffect(() => {
    if (token) getAssignedUsers();
  }, [token]);

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <TrainerSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Assigned Users
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {user.username}
                </h3>
                <p className="text-gray-600 mb-1">Email: {user.email}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-red-600 col-span-2 mt-10 text-xl">
              No assigned users found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AssignedUsers;
