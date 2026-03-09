import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  updateTrainerProfileAPI,
  getAllUsersForTrainerAPI,
} from "../../services/allAPI";
import SERVERURL from "../../services/serverURL";
import { useNavigate } from "react-router-dom";
import TrainerSidebar from "../components/TrainerSidebar";

export default function TrainerHome() {
  const [token, setToken] = useState("");
  const [trainerDetails, setTrainerDetails] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profile: "",
  });
  const [existingProfile, setExistingProfile] = useState("");
  const [preview, setPreview] = useState("");
  const [assignedUsersCount, setAssignedUsersCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch trainer details & assigned users
  useEffect(() => {
    const storedTrainer = sessionStorage.getItem("existingTrainer");
    const storedToken = sessionStorage.getItem("token");

    if (!storedTrainer || !storedToken) {
      navigate("/login");
      return;
    }

    const trainer = JSON.parse(storedTrainer);

    setToken(storedToken);
    setTrainerDetails({
      name: trainer.name,
      password: trainer.password,
      confirmPassword: trainer.password,
      bio: trainer.bio || "Fitness Trainer",
      profile: "",
    });
    setExistingProfile(trainer.profile || "");

    fetchAssignedUsersCount(storedToken);
  }, [navigate]);

  // Fetch assigned users for trainer
  const fetchAssignedUsersCount = async (token) => {
    try {
      const result = await getAllUsersForTrainerAPI({
        Authorization: `Bearer ${token}`,
      });

      if (result.status === 200) {
        const activeUsers = result.data.filter((user) => {
          const isExpired =
            user.membershipStatus === "expired" ||
            (user.membershipEndDate &&
              new Date(user.membershipEndDate) < new Date());
          return !isExpired;
        });
        setAssignedUsersCount(activeUsers.length);
      }
    } catch (error) {
      console.log("Failed to fetch assigned users", error);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setTrainerDetails({ ...trainerDetails, profile: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleReset = () => {
    const trainer = JSON.parse(sessionStorage.getItem("existingTrainer"));
    setTrainerDetails({
      name: trainer.name,
      password: trainer.password,
      confirmPassword: trainer.password,
      bio: trainer.bio || "Fitness Trainer",
      profile: "",
    });
    setExistingProfile(trainer.profile || "");
    setPreview("");
  };

  const handleSubmit = async () => {
    const { name, password, confirmPassword, bio } = trainerDetails;

    if (!name || !password || !confirmPassword) {
      toast.info("Fill details completely");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password does not match");
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    const reqBody = new FormData();
    reqBody.append("name", name);
    reqBody.append("password", password);
    reqBody.append("bio", bio);
    reqBody.append("role", "trainer");
    if (preview) reqBody.append("profile", trainerDetails.profile);
    else reqBody.append("profile", existingProfile);

    const result = await updateTrainerProfileAPI(reqBody, reqHeader);

    if (result.status === 200) {
      toast.success("Trainer profile updated");
      sessionStorage.setItem("existingTrainer", JSON.stringify(result.data));

      const updatedTrainer = result.data;
      setTrainerDetails({
        name: updatedTrainer.name,
        password: updatedTrainer.password,
        confirmPassword: updatedTrainer.password,
        bio: updatedTrainer.bio || "Fitness Trainer",
        profile: "",
      });
      setExistingProfile(updatedTrainer.profile || "");
      setPreview("");
      setModalOpen(false);
    } else {
      toast.error("Something went wrong");
      console.error("Update failed:", result);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <TrainerSidebar />

      <main className="flex-1 p-8 md:p-10 lg:p-12 space-y-10">
        <div className="rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Welcome Back,{" "}
            <span className="text-yellow-400">{trainerDetails.name}</span> 👋
          </h2>
          <p className="text-gray-200 text-lg">
            Manage your profile and assigned users below.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <div className="bg-blue-400 p-6 rounded-2xl shadow-md text-center w-56 md:w-150">
            <p className="text-3xl font-bold text-white">{assignedUsersCount}</p>
            <p className="text-white font-semibold">Active Assigned Users</p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <div className="relative flex flex-col items-center p-8 rounded-2xl shadow-md bg-gray-800 w-full max-w-md">
            <img
              src={
                preview
                  ? preview
                  : existingProfile
                  ? `${SERVERURL}/imguploads/${existingProfile}`
                  : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"
              }
              alt="trainer"
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover shadow-md"
            />
            <h3 className="text-2xl font-bold mt-4">{trainerDetails.name}</h3>
            <p className="text-gray-300 mt-2">{trainerDetails.bio}</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 bg-green-600 px-6 py-2 rounded-xl hover:bg-green-500 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg relative">
              <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

              <div className="flex justify-center mb-4">
                <label htmlFor="trainerProfile">
                  <input
                    type="file"
                    id="trainerProfile"
                    onChange={handleFile}
                    hidden
                  />
                  <img
                    src={
                      preview
                        ? preview
                        : existingProfile
                        ? `${SERVERURL}/imguploads/${existingProfile}`
                        : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"
                    }
                    className="w-32 h-32 rounded-full border-2 border-green-500 object-cover cursor-pointer hover:opacity-80 transition"
                    alt="edit profile"
                  />
                </label>
              </div>

              <input
                value={trainerDetails.name}
                onChange={(e) =>
                  setTrainerDetails({ ...trainerDetails, name: e.target.value })
                }
                placeholder="Name"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                value={trainerDetails.bio}
                onChange={(e) =>
                  setTrainerDetails({ ...trainerDetails, bio: e.target.value })
                }
                placeholder="Bio"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={trainerDetails.password}
                onChange={(e) =>
                  setTrainerDetails({ ...trainerDetails, password: e.target.value })
                }
                placeholder="Password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={trainerDetails.confirmPassword}
                onChange={(e) =>
                  setTrainerDetails({
                    ...trainerDetails,
                    confirmPassword: e.target.value,
                  })
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
