import React, { useEffect, useState } from 'react';
import UserSidebar from "../components/UserSidebar";
import { toast } from 'react-toastify';
import { getUserWorkoutPlansAPI, getAllTrainerAPI } from '../../services/allAPI';
import jsPDF from 'jspdf';

function UserWorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [token, setToken] = useState("");
  const [expanded, setExpanded] = useState({}); 

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch all trainers
  const getAllTrainers = async () => {
    if (!token) return;
    try {
      const result = await getAllTrainerAPI({ Authorization: `Bearer ${token}` });
      if (result.status === 200) setTrainers(result.data);
    } catch {
      toast.error("Failed to fetch trainers");
    }
  };

  // Fetch user's workout plans
  const getUserPlans = async () => {
    if (!token) return;
    try {
      const result = await getUserWorkoutPlansAPI({ Authorization: `Bearer ${token}` });
      if (result.status === 200) setPlans(result.data);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => {
    if (token) {
      getAllTrainers();
      getUserPlans();
    }
  }, [token]);

  const getTrainerName = (id) => {
    const trainer = trainers.find(t => t._id === id);
    return trainer ? trainer.name : "Unknown";
  };

  // Toggle show more
  const toggleShowMore = (id, type) => {
    setExpanded(prev => ({
      ...prev,
      [`${id}-${type}`]: !prev[`${id}-${type}`]
    }));
  };

  // Generate PDF
  const generatePDF = (plan) => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Workout Plan Details", 105, y, { align: "center" });
    y += 20;

    pdf.setFontSize(12);
    pdf.text(`Plan Type: ${plan.planType}`, 20, y); y += 10;
    pdf.text(`Assigned By: ${getTrainerName(plan.assignedBy)}`, 20, y); y += 10;
    pdf.text(`Assigned Date: ${new Date(plan.assignedDate).toLocaleDateString()}`, 20, y); y += 15;

    if (plan.workoutDetails) {
      pdf.text("Workout Details:", 20, y); y += 10;
      pdf.text(pdf.splitTextToSize(plan.workoutDetails, 170), 20, y);
      y += 20;
    }

    if (plan.dietDetails) {
      pdf.text("Diet Details:", 20, y); y += 10;
      pdf.text(pdf.splitTextToSize(plan.dietDetails, 170), 20, y);
    }

    pdf.save(`workout-plan-${plan._id}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <UserSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">My Workout Plans</h1>

        {plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Plan Type</th>
                  <th className="px-6 py-3">Assigned By</th>
                  <th className="px-6 py-3">Assigned Date</th>
                  <th className="px-6 py-3">Workout Details</th>
                  <th className="px-6 py-3">Diet Details</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {plans.map(plan => {
                  const showWorkout = expanded[`${plan._id}-workout`];
                  const showDiet = expanded[`${plan._id}-diet`];

                  return (
                    <tr key={plan._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{plan.planType}</td>
                      <td className="px-6 py-4">{getTrainerName(plan.assignedBy)}</td>
                      <td className="px-6 py-4">
                        {new Date(plan.assignedDate).toLocaleDateString()}
                      </td>

                      {/* Workout Details */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className={showWorkout ? "" : "line-clamp-2"}>
                          {plan.workoutDetails}
                        </p>
                        {plan.workoutDetails?.length > 80 && (
                          <button
                            onClick={() => toggleShowMore(plan._id, "workout")}
                            className="text-blue-600 text-sm mt-1"
                          >
                            {showWorkout ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </td>

                      {/* Diet Details */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className={showDiet ? "" : "line-clamp-2"}>
                          {plan.dietDetails}
                        </p>
                        {plan.dietDetails?.length > 80 && (
                          <button
                            onClick={() => toggleShowMore(plan._id, "diet")}
                            className="text-blue-600 text-sm mt-1"
                          >
                            {showDiet ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => generatePDF(plan)}
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Download as PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-red-600 mt-10 text-xl">
            No workout plans assigned yet.
          </p>
        )}
      </main>
    </div>
  );
}

export default UserWorkoutPlan;
