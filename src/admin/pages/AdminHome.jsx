import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { updateProfileAPI, getAllUsersAPI, getAllTrainerAPI } from "../../services/allAPI";
import SERVERURL from "../../services/serverURL";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const [token, setToken] = useState("");
  const [adminDetails, setAdminDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profile: ""
  });
  const [existingProfile, setExistingProfile] = useState("");
  const [preview, setPreview] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [totalTrainers, setTotalTrainers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("existingUser");
    const storedToken = sessionStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login");
      return;
    }

    const admin = JSON.parse(storedUser);

    if (admin.role !== "admin") {
      navigate("/login");
      return;
    }

    setToken(storedToken);
    setAdminDetails({
      username: admin.username,
      password: admin.password,
      confirmPassword: admin.password,
      bio: admin.bio || "Gym Admin",
      profile: ""
    });
    setExistingProfile(admin.profile || "");

    fetchStats(storedToken);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const trainersRes = await getAllTrainerAPI({ Authorization: `Bearer ${token}` });
      if (trainersRes.status === 200) setTotalTrainers(trainersRes.data.length);

      const usersRes = await getAllUsersAPI({ Authorization: `Bearer ${token}` });
      if (usersRes.status === 200) {
        const activeCount = usersRes.data.filter(u => u.status === "active-member").length;
        setActiveMembers(activeCount);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFile = (e) => {
    setAdminDetails({ ...adminDetails, profile: e.target.files[0] });
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleReset = () => {
    const admin = JSON.parse(sessionStorage.getItem("existingUser"));
    setAdminDetails({
      username: admin.username,
      password: admin.password,
      confirmPassword: admin.password,
      bio: admin.bio || "Gym Admin",
      profile: ""
    });
    setExistingProfile(admin.profile || "");
    setPreview("");
  };

  const handleSubmit = async () => {
    const { username, password, confirmPassword, bio } = adminDetails;

    if (!username || !password || !confirmPassword) {
      toast.info("Fill details completely");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password does not match");
      return;
    }

    const reqHeader = { Authorization: `Bearer ${token}` };
    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append("password", password);
    reqBody.append("bio", bio);
    reqBody.append("role", "admin");
    if (preview) reqBody.append("profile", adminDetails.profile);
    else reqBody.append("profile", existingProfile);

    const result = await updateProfileAPI(reqBody, reqHeader);

    if (result.status === 200) {
      toast.success("Admin profile updated");
      sessionStorage.setItem("existingUser", JSON.stringify(result.data));
      setExistingProfile(result.data.profile);
      setPreview("");
      setModalOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-10 lg:p-12 space-y-10">
        <div className="rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Welcome Back, <span className="text-yellow-400">{adminDetails.username}</span> 👋
          </h2>
          <p className="text-gray-200 text-lg">Manage your profile and settings below.</p>
        </div>


<div className="md:flex md:justify-center md:gap-10 mt-6">
  <div className="bg-blue-400 p-5 rounded-2xl shadow-md text-center w-65 md:w-110">
    <p className="text-3xl font-bold">{totalTrainers}</p>
    <p>Total Trainers</p>
  </div>
  <div className="bg-blue-400 p-5 rounded-2xl shadow-md text-center w-65 md:w-110">
    <p className="text-3xl font-bold">{activeMembers}</p>
    <p>Active Members</p>
  </div>
</div>


        <div className="flex justify-center mt-10">
          <div className="relative flex flex-col items-center p-8 rounded-2xl shadow-md bg-gray-800 w-full max-w-md">
            <img
              src={
                existingProfile
                  ? `${SERVERURL}/imguploads/${existingProfile}`
                  : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"
              }
              alt="admin"
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover shadow-md"
            />
            <h3 className="text-2xl font-bold mt-4">{adminDetails.username}</h3>
            <p className="text-gray-300 mt-2">{adminDetails.bio}</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 bg-green-600 px-6 py-2 rounded-xl hover:bg-green-500 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg relative">
              <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

              <div className="flex justify-center mb-4">
                <label htmlFor="adminProfile">
                  <input type="file" id="adminProfile" onChange={handleFile} hidden />
                  <img
                    src={
                      preview
                        ? preview
                        : existingProfile
                        ? `${SERVERURL}/imguploads/${existingProfile}`
                        : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"
                    }
                    className="w-32 h-32 rounded-full border-2 border-green-500 object-cover cursor-pointer hover:opacity-80 transition"
                    alt="edit"
                  />
                </label>
              </div>

              <input
                value={adminDetails.username}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, username: e.target.value })
                }
                placeholder="Username"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                value={adminDetails.bio}
                onChange={(e) => setAdminDetails({ ...adminDetails, bio: e.target.value })}
                placeholder="Bio"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={adminDetails.password}
                onChange={(e) => setAdminDetails({ ...adminDetails, password: e.target.value })}
                placeholder="Password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={adminDetails.confirmPassword}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, confirmPassword: e.target.value })
                }
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-amber-600 p-3 rounded-xl hover:bg-amber-500 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 p-3 rounded-xl hover:bg-green-500 transition"
                >
                  Update
                </button>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-white text-xl font-bold hover:text-red-500"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
