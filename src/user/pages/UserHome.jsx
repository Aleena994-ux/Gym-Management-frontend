import React, { useEffect, useState } from 'react';
import UserSidebar from "../components/UserSidebar";
import { toast } from 'react-toastify';
import { updateProfileAPI, makeGymPaymentAPI, confirmPaymentAPI, getAllTrainerAPI } from '../../services/allAPI';
import SERVERURL from '../../services/serverURL';
import { FaUserTie, FaCalendarAlt } from 'react-icons/fa';

function UserHome() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(1);

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profile: ""
  });

  const [existingProfile, setExistingProfile] = useState("");
  const [preview, setPreview] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // =====================
  // PAYMENT HANDLER
  // =====================
  const handlePayment = async () => {
    const reqHeader = { Authorization: `Bearer ${token}` };
    const reqBody = { duration: selectedDuration };

    try {
      const result = await makeGymPaymentAPI(reqBody, reqHeader);
      if (result.status === 200) {
        window.location.href = result.data.url;
      } else {
        toast.error("Payment failed");
      }
    } catch {
      toast.error("Payment failed");
    }
  };

  // =====================
  // RESET
  // =====================
  const handleReset = () => {
    setUserDetails({
      username: user.username,
      password: user.password,
      confirmPassword: user.password,
      bio: user.bio || "",
      profile: ""
    });
    setExistingProfile(user.profile);
    setPreview("");
  };

  // =====================
  // FILE HANDLER
  // =====================
  const handleFile = (e) => {
    setUserDetails({ ...userDetails, profile: e.target.files[0] });
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  // =====================
  // UPDATE PROFILE
  // =====================
  const handleSubmit = async () => {
    const { username, password, confirmPassword, bio } = userDetails;

    if (!username || !password || !confirmPassword) {
      toast.info("Fill details completely");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password do not match");
      return;
    }

    const reqHeader = { Authorization: `Bearer ${token}` };
    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append("password", password);
    reqBody.append("bio", bio);
    preview
      ? reqBody.append("profile", userDetails.profile)
      : reqBody.append("profile", existingProfile);

    try {
      const result = await updateProfileAPI(reqBody, reqHeader);
      if (result.status === 200) {
        toast.success("Profile updated");
        sessionStorage.setItem("existingUser", JSON.stringify(result.data));
        setUser(result.data);
        setExistingProfile(result.data.profile);
        setPreview("");
        setModalOpen(false);
      }
    } catch {
      toast.error("Profile update failed");
    }
  };

  // =====================
  // FETCH TRAINERS
  // =====================
  const getAllTrainers = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getAllTrainerAPI(reqHeader);
      if (result.status === 200) {
        setAllTrainers(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =====================
  // GET TRAINER NAME
  // =====================
  const getTrainerName = (trainerId) => {
    const trainer = allTrainers.find((t) => t._id === trainerId);
    return trainer ? trainer.name : "Not Assigned";
  };

  
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const storedUser = JSON.parse(sessionStorage.getItem("existingUser"));
      setToken(sessionStorage.getItem("token"));
      setUser(storedUser);

      setUserDetails({
        username: storedUser.username,
        password: storedUser.password,
        confirmPassword: storedUser.password,
        bio: storedUser.bio || "",
        profile: ""
      });

      setExistingProfile(storedUser.profile);

      //  Handle payment success
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        const reqHeader = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
        confirmPaymentAPI(reqHeader)
          .then(() => {
            toast.success("Payment successful 🎉");
            const updatedUser = { ...storedUser, status: "active-member", paymentStatus: "paid" };
            sessionStorage.setItem("existingUser", JSON.stringify(updatedUser));
            setUser(updatedUser);
          })
          .catch(() => toast.error("Payment confirmation failed"));
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      getAllTrainers();
    }
  }, [token]);

  if (!user) return null;

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-10 lg:p-12 space-y-10">

        <div className="rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Welcome Back, <span className="text-yellow-400">{user.username}</span> 👋
          </h2>
          <p className="text-gray-200 text-lg pt-5">
            Manage your profile below.
          </p>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex flex-col items-center p-8 rounded-2xl bg-gray-800 shadow-md w-full max-w-md">
            <img
              src={preview ? preview : existingProfile ? `${SERVERURL}/imguploads/${existingProfile}` : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"}
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover shadow-md"
              alt="user"
            />
            <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
            <p className="text-gray-300 mt-1">{user.bio}</p>

            {/* Assigned Trainer */}
            <div className="flex items-center gap-2 mt-4 text-gray-300">
              <FaUserTie className="text-blue-400" />
              <span className="font-semibold">Assigned Trainer:</span>
              <span className="text-white">{getTrainerName(user.assignedTrainer)}</span>
            </div>

            {/* Membership Dates */}
            {user.membershipStartDate && user.membershipEndDate && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendarAlt className="text-green-400" />
                  <span className="font-semibold">Plan Start:</span>
                  <span className="text-white">{new Date(user.membershipStartDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendarAlt className="text-green-400" />
                  <span className="font-semibold">Plan End:</span>
                  <span className="text-white font-bold">{new Date(user.membershipEndDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {user.status === "approved" && user.paymentStatus === "unpaid" && (
              <button onClick={handlePayment} className="mt-6 bg-green-600 px-6 py-3 rounded-xl hover:bg-green-500 transition shadow-lg">
                Pay Now
              </button>
            )}

            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-500 transition shadow-lg"
            >
              Update Profile
            </button>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg relative">
              <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>

              <div className="flex justify-center mb-4">
                <label htmlFor="userProfile">
                  <input type="file" id="userProfile" onChange={handleFile} hidden />
                  <img
                    src={preview ? preview : existingProfile ? `${SERVERURL}/imguploads/${existingProfile}` : "https://cdn-icons-png.freepik.com/512/8608/8608769.png"}
                    className="w-32 h-32 rounded-full border-2 border-green-500 object-cover cursor-pointer hover:opacity-80 transition"
                    alt="edit"
                  />
                </label>
              </div>

              <input
                value={userDetails.username}
                onChange={e => setUserDetails({ ...userDetails, username: e.target.value })}
                placeholder="Username"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={userDetails.password}
                onChange={e => setUserDetails({ ...userDetails, password: e.target.value })}
                placeholder="Password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={userDetails.confirmPassword}
                onChange={e => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <textarea
                value={userDetails.bio}
                onChange={e => setUserDetails({ ...userDetails, bio: e.target.value })}
                placeholder="Bio"
                className="w-full p-3 rounded-xl bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              <div className="flex gap-4">
                <button onClick={handleReset} className="flex-1 bg-amber-600 p-3 rounded-xl hover:bg-amber-500 transition">
                  Reset
                </button>
                <button onClick={handleSubmit} className="flex-1 bg-green-600 p-3 rounded-xl hover:bg-green-500 transition">
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

export default UserHome;
