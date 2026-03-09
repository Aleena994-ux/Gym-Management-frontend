import React, { useEffect, useState } from "react";
import Header from "../../common/components/Header";
import Footer from "../../common/components/Footer";
import { toast } from "react-toastify";
import { getAllTrainerAPI, submitRequestAPI } from "../../services/allAPI";
import { useNavigate } from "react-router-dom";

function UserRequest() {
  const navigate = useNavigate();

  const [requestDetails, setRequestDetails] = useState({
    userName: "",
    timeSlot: "",
    bodyTypeGoal: "",
    preferredTrainer: ""
  });

  const [allTrainers, setAllTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check login & load trainers
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.info("Please login to send enquiry");
      navigate("/login");
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("existingUser"));
    if (user) {
      setRequestDetails((prev) => ({
        ...prev,
        userName: user.username
      }));
    }

    getAllTrainers();
  }, []);

  // Fetch all trainers
  const getAllTrainers = async () => {
    setLoading(true);
    try {
      const result = await getAllTrainerAPI();
      if (result.status === 200) {
        setAllTrainers(result.data);
      } else {
        toast.error("Failed to load trainers");
      }
    } catch (error) {
      toast.error("Trainer fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // Submit enquiry
  const handleSubmitRequest = async () => {
    const { timeSlot, bodyTypeGoal, preferredTrainer } = requestDetails;

    if (!timeSlot || !bodyTypeGoal || !preferredTrainer) {
      toast.info("Fill the form completely");
      return;
    }

    const token = sessionStorage.getItem("token");

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    try {
      const result = await submitRequestAPI(requestDetails, reqHeader);
      if (result.status === 200) {
        toast.success("Enquiry sent. Please wait for admin approval");
        setRequestDetails((prev) => ({
          userName: prev.userName,
          timeSlot: "",
          bodyTypeGoal: "",
          preferredTrainer: ""
        }));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
        <main className="flex-1 p-10">
          <h2 className="text-4xl font-bold mb-2">Membership Enquiry</h2>
          <p className="text-gray-400 mb-10">
            Fill the form and wait for admin approval
          </p>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form className="grid md:grid-cols-2 gap-6">

              {/* Username */}
              <div>
                <label className="block text-gray-300 mb-2">User Name</label>
                <input
                  type="text"
                  value={requestDetails.userName}
                  disabled
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white cursor-not-allowed"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-gray-300 mb-2">Time Slot</label>
                <select
                  value={requestDetails.timeSlot}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      timeSlot: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select time slot</option>
                  <option value="6 AM - 7 AM">6 AM - 7 AM</option>
                  <option value="7 AM - 8 AM">7 AM - 8 AM</option>
                  <option value="5 PM - 6 PM">5 PM - 6 PM</option>
                </select>
              </div>

              {/* Body Goal */}
              <div>
                <label className="block text-gray-300 mb-2">Body Goal</label>
                <select
                  value={requestDetails.bodyTypeGoal}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      bodyTypeGoal: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select goal</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Body Recomposition">Body Recomposition</option>
                </select>
              </div>

              {/* Preferred Trainer */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Preferred Trainer
                </label>
                <select
                  value={requestDetails.preferredTrainer}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      preferredTrainer: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select trainer</option>
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    allTrainers.map((trainer) => (
                      <option key={trainer._id} value={trainer._id}>
                        {trainer.name} ({trainer.specialization})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </form>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitRequest}
                className="mt-8 px-10 py-3 rounded-lg font-semibold 
                           bg-gradient-to-r from-red-800 to-red-600 
                           hover:from-red-900 hover:to-red-700 
                           transition shadow-lg"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default UserRequest;
