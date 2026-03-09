import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import {
  addUserAPI,
  getAllUsersAPI,
  deleteUserAPI,
  getAllTrainerAPI
} from "../../services/allAPI";
import { FaTrash } from "react-icons/fa";

function AdminUser() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    assignedTrainer: "",
    membershipDuration: "",
    membershipStartDate: ""
  });

  const [token, setToken] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allTrainers, setAllTrainers] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [viewSubTab, setViewSubTab] = useState("registered");

  const reset = () => {
    setUserDetails({
      username: "",
      email: "",
      password: "",
      role: "user",
      assignedTrainer: "",
      membershipDuration: "",
      membershipStartDate: ""
    });
  };

  const handleAddUser = async () => {
    const {
      username,
      email,
      password,
      role,
      assignedTrainer,
      membershipDuration,
      membershipStartDate
    } = userDetails;

    if (!username || !email || !password) {
      toast.info("Fill the form completely");
      return;
    }

    try {
      const result = await addUserAPI(
        {
          username,
          email,
          password,
          role,
          assignedTrainer,
          membershipDuration,
          membershipStartDate
        },
        { Authorization: `Bearer ${token}` }
      );

      if (result.status === 200) {
        toast.success("User added successfully");
        reset();
        getAllUsers();
      } else toast.error("Error adding user");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const getAllUsers = async () => {
    try {
      const result = await getAllUsersAPI({
        Authorization: `Bearer ${token}`
      });
      if (result.status === 200) setAllUsers(result.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const getAllTrainers = async () => {
    try {
      const result = await getAllTrainerAPI({
        Authorization: `Bearer ${token}`
      });
      if (result.status === 200) setAllTrainers(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = (id) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={async () => {
              try {
                const result = await deleteUserAPI(id, {
                  Authorization: `Bearer ${token}`
                });
                if (result.status === 200) {
                  toast.dismiss();
                  toast.success("User deleted successfully");
                  getAllUsers();
                }
              } catch {
                toast.dismiss();
                toast.error("Delete failed");
              }
            }}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-600 px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const getUsersByStatus = (status) =>
    allUsers.filter((user) => user.status === status);

  const getRegisteredUsers = () =>
    getUsersByStatus("registered").filter((u) => u.role !== "admin");

  const getActiveMembers = () =>
    getUsersByStatus("active-member").filter(
      (u) => !u.membershipEndDate || new Date(u.membershipEndDate) >= new Date()
    );

  const getExpiredMembers = () =>
    allUsers.filter(
      (u) =>
        u.membershipEndDate &&
        new Date(u.membershipEndDate) < new Date()
    );

  const getTrainerDetails = (trainerId) => {
    const trainer = allTrainers.find((t) => t._id === trainerId);
    return trainer
      ? `${trainer.name} (${trainer.specialization})`
      : "Not Assigned";
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      getAllUsers();
      getAllTrainers();
    }
  }, [token]);

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-center gap-10 mb-10">
          <p
            onClick={() => setActiveTab("add")}
            className={`cursor-pointer ${
              activeTab === "add"
                ? "text-blue-500 border-b-2 border-blue-500"
                : ""
            }`}
          >
            Add User
          </p>
          <p
            onClick={() => setActiveTab("view")}
            className={`cursor-pointer ${
              activeTab === "view"
                ? "text-blue-500 border-b-2 border-blue-500"
                : ""
            }`}
          >
            View User
          </p>
        </div>

        {activeTab === "add" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-3xl font-bold mb-6">Add User</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="Username"
                className="p-3 border rounded"
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="p-3 border rounded"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="p-3 border rounded"
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              />

              <select
                className="p-3 border rounded"
                value={userDetails.assignedTrainer}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    assignedTrainer: e.target.value
                  })
                }
              >
                <option value="">Assign Trainer</option>
                {allTrainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </select>

              <select
                className="p-3 border rounded"
                value={userDetails.membershipDuration}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    membershipDuration: e.target.value
                  })
                }
              >
                <option value="">Select Membership Plan</option>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
              </select>

              <div>
                <p className="mb-1 text-sm font-semibold text-gray-700">
                  *Membership Starting Date
                </p>
                <input
                  type="date"
                  className="p-3 border rounded w-full"
                  value={userDetails.membershipStartDate}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      membershipStartDate: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={reset}
                className="bg-amber-700 text-white px-5 py-2 rounded"
              >
                Reset
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-700 text-white px-5 py-2 rounded"
              >
                Add User
              </button>
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <>
            <div className="flex justify-center gap-6 mb-8">
              <p
                onClick={() => setViewSubTab("registered")}
                className={`cursor-pointer ${
                  viewSubTab === "registered"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Registered
              </p>
              <p
                onClick={() => setViewSubTab("approved")}
                className={`cursor-pointer ${
                  viewSubTab === "approved"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Approved
              </p>
              <p
                onClick={() => setViewSubTab("active")}
                className={`cursor-pointer ${
                  viewSubTab === "active"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Active
              </p>
              <p
                onClick={() => setViewSubTab("expired")}
                className={`cursor-pointer ${
                  viewSubTab === "expired"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Expired
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(viewSubTab === "registered"
                ? getRegisteredUsers()
                : viewSubTab === "approved"
                ? getUsersByStatus("approved")
                : viewSubTab === "active"
                ? getActiveMembers()
                : getExpiredMembers()
              ).map((user) => {
                const isExpired =
                  user.membershipEndDate &&
                  new Date(user.membershipEndDate) < new Date();

                return (
                  <div
                    key={user._id}
                    className={`bg-white p-6 rounded-xl shadow ${
                      viewSubTab === "expired" ? "opacity-80" : ""
                    }`}
                  >
                    <h3 className="text-xl font-semibold">{user.username}</h3>
                    <p>Email: {user.email}</p>
                    <p>Trainer: {getTrainerDetails(user.assignedTrainer)}</p>

                    {(viewSubTab === "active" || viewSubTab === "expired") && (
                      <>
                        <p className="mt-2 font-semibold">
                          Membership Plan:{" "}
                          {user.membershipDuration
                            ? `${user.membershipDuration} Month(s)`
                            : "N/A"}
                        </p>
                        <p className="font-semibold">
                          Start:{" "}
                          {user.membershipStartDate
                            ? new Date(
                                user.membershipStartDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p
                          className={`font-semibold ${
                            isExpired ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          Expiry:{" "}
                          {user.membershipEndDate
                            ? new Date(
                                user.membershipEndDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </>
                    )}

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white p-2 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminUser;
