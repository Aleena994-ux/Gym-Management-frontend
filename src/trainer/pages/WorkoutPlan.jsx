import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  assignWorkoutPlanAPI,
  getAllWorkoutPlansAPI,
  getAllUsersForTrainerAPI,
} from "../../services/allAPI";
import TrainerSidebar from "../components/TrainerSidebar";

function WorkoutPlan() {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [viewAssign, setViewAssign] = useState(true);
  const [expanded, setExpanded] = useState({});

  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [planDetails, setPlanDetails] = useState({
    userId: "",
    planType: "",
    workoutDetails: "",
    dietDetails: "",
    assignedDate: "",
  });

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  /* ---------------- FETCH USERS (ACTIVE ONLY) ---------------- */
  const getAllUsers = async () => {
    if (!token) return;

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

        setUsers(activeUsers);
      }
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  /* ---------------- FETCH PLANS ---------------- */
  const getAllPlans = async () => {
    if (!token) return;

    try {
      const result = await getAllWorkoutPlansAPI({
        Authorization: `Bearer ${token}`,
      });

      if (result.status === 200) {
        const filteredPlans = result.data.filter((plan) =>
          users.some((u) => u._id === plan.userId)
        );
        setPlans(filteredPlans);
      }
    } catch {
      toast.error("Failed to fetch workout plans");
    }
  };

  useEffect(() => {
    if (token) getAllUsers();
  }, [token]);

  useEffect(() => {
    if (token && users.length > 0) getAllPlans();
  }, [token, users]);

  /* ---------------- SHOW MORE TOGGLE ---------------- */
  const toggleShowMore = (id, type) => {
    setExpanded((prev) => ({
      ...prev,
      [`${id}-${type}`]: !prev[`${id}-${type}`],
    }));
  };

  /* ---------------- ASSIGN PLAN ---------------- */
  const handleAssignPlan = async () => {
    const { userId, planType, workoutDetails, dietDetails, assignedDate } =
      planDetails;

    if (!userId || !planType || !assignedDate) {
      toast.info("Fill all required fields");
      return;
    }

    if (planType !== "Diet" && !workoutDetails) {
      toast.info("Enter workout details");
      return;
    }

    if (planType !== "Workout" && !dietDetails) {
      toast.info("Enter diet details");
      return;
    }

    try {
      const result = await assignWorkoutPlanAPI(planDetails, {
        Authorization: `Bearer ${token}`,
      });

      if (result.status === 200) {
        toast.success("Workout plan assigned");
        setPlanDetails({
          userId: "",
          planType: "",
          workoutDetails: "",
          dietDetails: "",
          assignedDate: "",
        });
        getAllPlans();
      }
    } catch {
      toast.error("Error assigning plan");
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const user = users.find((u) => u._id === plan.userId);

    const matchName = searchName
      ? user?.username
          ?.toLowerCase()
          .includes(searchName.toLowerCase())
      : true;

    const matchDate = searchDate
      ? new Date(plan.assignedDate).toISOString().slice(0, 10) === searchDate
      : true;

    return matchName && matchDate;
  });

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <TrainerSidebar />

      <main className="flex-1 p-10">
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => setViewAssign(true)}
            className={`px-6 py-2 rounded font-semibold ${
              viewAssign ? "bg-red-700 text-white" : "bg-gray-300"
            }`}
          >
            Assign Plan
          </button>

          <button
            onClick={() => setViewAssign(false)}
            className={`px-6 py-2 rounded font-semibold ${
              !viewAssign ? "bg-red-700 text-white" : "bg-gray-300"
            }`}
          >
            View Plans
          </button>
        </div>

        {/* ASSIGN PLAN */}
        {viewAssign && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-6">Assign Workout Plan</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <select
                value={planDetails.userId}
                onChange={(e) =>
                  setPlanDetails({ ...planDetails, userId: e.target.value })
                }
                className="p-3 border rounded bg-gray-50"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>

              <select
                value={planDetails.planType}
                onChange={(e) =>
                  setPlanDetails({
                    ...planDetails,
                    planType: e.target.value,
                    workoutDetails: "",
                    dietDetails: "",
                  })
                }
                className="p-3 border rounded bg-gray-50"
              >
                <option value="">Plan Type</option>
                <option value="Workout">Workout</option>
                <option value="Diet">Diet</option>
                <option value="Workout + Diet">Workout + Diet</option>
              </select>

              <input
                type="date"
                value={planDetails.assignedDate}
                onChange={(e) =>
                  setPlanDetails({
                    ...planDetails,
                    assignedDate: e.target.value,
                  })
                }
                className="p-3 border rounded bg-gray-50"
              />

              {planDetails.planType !== "Diet" &&
                planDetails.planType !== "" && (
                  <textarea
                    placeholder="Workout Details"
                    value={planDetails.workoutDetails}
                    onChange={(e) =>
                      setPlanDetails({
                        ...planDetails,
                        workoutDetails: e.target.value,
                      })
                    }
                    className="p-3 border rounded col-span-2 bg-gray-50"
                  />
                )}

              {planDetails.planType !== "Workout" &&
                planDetails.planType !== "" && (
                  <textarea
                    placeholder="Diet Details"
                    value={planDetails.dietDetails}
                    onChange={(e) =>
                      setPlanDetails({
                        ...planDetails,
                        dietDetails: e.target.value,
                      })
                    }
                    className="p-3 border rounded col-span-2 bg-gray-50"
                  />
                )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAssignPlan}
                className="bg-green-700 px-6 py-3 rounded text-white font-semibold hover:bg-green-600"
              >
                Assign Plan
              </button>
            </div>
          </div>
        )}

        {/* VIEW PLANS */}
        {!viewAssign && (
          <>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by username"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="p-2 border rounded w-64"
              />

              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Plan Type</th>
                    <th className="px-6 py-3">Assigned Date</th>
                    <th className="px-6 py-3">Workout Details</th>
                    <th className="px-6 py-3">Diet Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlans.map((plan) => {
                    const user = users.find((u) => u._id === plan.userId);
                    const showWorkout = expanded[`${plan._id}-workout`];
                    const showDiet = expanded[`${plan._id}-diet`];

                    return (
                      <tr key={plan._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4">{user?.username}</td>
                        <td className="px-6 py-4">{plan.planType}</td>
                        <td className="px-6 py-4">
                          {new Date(plan.assignedDate).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p className={showWorkout ? "" : "line-clamp-2"}>
                            {plan.workoutDetails}
                          </p>
                          {plan.workoutDetails?.length > 80 && (
                            <button
                              onClick={() =>
                                toggleShowMore(plan._id, "workout")
                              }
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showWorkout ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p className={showDiet ? "" : "line-clamp-2"}>
                            {plan.dietDetails}
                          </p>
                          {plan.dietDetails?.length > 80 && (
                            <button
                              onClick={() =>
                                toggleShowMore(plan._id, "diet")
                              }
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showDiet ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WorkoutPlan;
