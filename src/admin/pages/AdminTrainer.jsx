import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { addTrainerAPI, getAllTrainerAPI, deleteTrainerAPI } from "../../services/allAPI"; 
import { FaTrash } from 'react-icons/fa'; 

function AdminTrainer() {
  const [trainerDetails, setTrainerDetails] = useState({
    name: "",
    email: "",
    experience: "",
    specialization: "",
    password: "" 
  });
  const [token, setToken] = useState("");
  const [allTrainers, setAllTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addTrainerStatus, setAddTrainerStatus] = useState(true);
  const [viewTrainerStatus, setViewTrainerStatus] = useState(false); 

  const reset = () => {
    setTrainerDetails({ name: "", email: "", experience: "", specialization: "", password: "" }); 
  };

  const handleAddTrainer = async () => {
    const { name, email, experience, specialization, password } = trainerDetails; 
    if (!name || !email || !experience || !specialization || !password) { 
      toast.info("Fill the form completely");
      return;
    }

    try {
      const result = await addTrainerAPI(
        { name, email, experience, specialization, password }, 
        { Authorization: `Bearer ${token}` }
      );

      if (result?.status === 200) {
        toast.success("Trainer added successfully!");
        reset(); 
        getAllTrainers();
      } else {
        toast.error(result?.data || "Error in adding trainer");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Something went wrong");
    }
  };

  const getAllTrainers = async () => {
    if (!token) return; 
    setLoading(true); 
    try {
      const result = await getAllTrainerAPI({ Authorization: `Bearer ${token}` });
      if (result.status === 200) {
        setAllTrainers(result.data);
      } else {
        toast.error("Failed to load trainers");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false); 
    }
  };

  const handleDeleteTrainer = (id) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this trainer?</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={async () => {
              try {
                const reqHeader = { Authorization: `Bearer ${token}` };
                const result = await deleteTrainerAPI(id, reqHeader);
  
                if (result.status === 200) {
                  toast.dismiss();
                  toast.success("Trainer deleted successfully!");
                  getAllTrainers();
                } else {
                  toast.dismiss();
                  toast.error("Failed to delete trainer");
                }
              } catch (error) {
                toast.dismiss();
                toast.error("Something went wrong while deleting");
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
      {
        autoClose: false
      }
    );
  };
  
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) getAllTrainers();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <div className="flex justify-center items-center my-8 font-medium text-lg">
          <p
            onClick={() => {
              setAddTrainerStatus(true);
              setViewTrainerStatus(false);
            }}
            className={
              addTrainerStatus
                ? "text-blue-500 p-4 border-gray-200 border-t border-l border-r rounded cursor-pointer"
                : "p-4 border-b border-gray-200 cursor-pointer"
            }
          >
            Add Trainer
          </p>
          <p
            onClick={() => {
              setViewTrainerStatus(true);
              setAddTrainerStatus(false);
            }}
            className={
              viewTrainerStatus
                ? "text-blue-500 p-4 border-gray-200 border-t border-l border-r rounded cursor-pointer"
                : "p-4 border-b border-gray-200 cursor-pointer"
            }
          >
            View Trainers
          </p>
        </div>

        {addTrainerStatus && (
          <div className="bg-white rounded-xl shadow p-6 mb-10 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Trainer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Trainer Name</label>
                <input
                  type="text"
                  value={trainerDetails.name}
                  onChange={(e) => setTrainerDetails({ ...trainerDetails, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter trainer name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={trainerDetails.email}
                  onChange={(e) => setTrainerDetails({ ...trainerDetails, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Experience</label>
                <input
                  type="number"
                  value={trainerDetails.experience}
                  onChange={(e) => setTrainerDetails({ ...trainerDetails, experience: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Years of experience"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Specialization</label>
                <select
                  value={trainerDetails.specialization}
                  onChange={(e) => setTrainerDetails({ ...trainerDetails, specialization: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select specialization</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={trainerDetails.password}
                  onChange={(e) => setTrainerDetails({ ...trainerDetails, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={reset}
                className="bg-amber-700 text-white rounded px-5 py-3 hover:border hover:border-amber-700 hover:text-amber-700 hover:bg-white transition"
              >
                Reset
              </button>
              <button
                onClick={handleAddTrainer}
                className="bg-green-700 text-white rounded px-5 py-3 hover:border hover:border-green-700 hover:text-green-700 hover:bg-white transition"
              >
                Add Trainer
              </button>
            </div>
          </div>
        )}

        {viewTrainerStatus && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Trainers</h2>
            {loading ? (
              <p className="text-gray-600">Loading trainers...</p>
            ) : allTrainers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTrainers.map((trainer, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{trainer.name}</h3>
                    <p className="text-gray-600">Email: {trainer.email}</p>
                    <p className="text-gray-600">Experience: {trainer.experience} years</p>
                    <p className="text-gray-600">Specialization: {trainer.specialization}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleDeleteTrainer(trainer._id)}
                        className="p-2 rounded bg-red-600 text-white hover:bg-gray-200 hover:text-red-600 hover:border hover:border-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No trainers found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminTrainer;
