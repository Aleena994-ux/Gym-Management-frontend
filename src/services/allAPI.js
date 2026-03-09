import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

// Register
export const registerAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVERURL}/register`, reqBody);
};

// Login
export const loginAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVERURL}/login`, reqBody);
};

// ------------- Admin ----------------
// Add trainer
export const addTrainerAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${SERVERURL}/add-trainer`,
    reqBody,
    reqHeader,
  );
};

// View trainer
export const getAllTrainerAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVERURL}/all-trainer`, {}, reqHeader);
};

// Delete trainer
export const deleteTrainerAPI = async (id) => {
  return await commonAPI("DELETE", `${SERVERURL}/delete-trainer/${id}`);
};

// Add user
export const addUserAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST", `${SERVERURL}/add-user`, reqBody, reqHeader);
};

// Get all users
export const getAllUsersAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVERURL}/all-users`, {}, reqHeader);
};

// Delete user
export const deleteUserAPI = async (id, reqHeader) => {
  return await commonAPI(
    "DELETE",
    `${SERVERURL}/delete-user/${id}`,
    {},
    reqHeader,
  );
};

// Get all requests (admin)
export const getAllRequestsAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVERURL}/all-requests`, {}, reqHeader);
};

// Approve request
export const approveRequestAPI = async (id, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/approve-request/${id}`,
    {},
    reqHeader,
  );
};

// Reject request
export const rejectRequestAPI = async (id, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/reject-request/${id}`,
    {},
    reqHeader,
  );
};

// Delete request
export const deleteRequestAPI = async (id, reqHeader) => {
  return await commonAPI(
    "DELETE",
    `${SERVERURL}/delete-request/${id}`,
    {},
    reqHeader,
  );
};

// Mark attendance
export const markAttendanceAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${SERVERURL}/mark-attendance`,
    reqBody,
    reqHeader,
  );
};

// Get all attendances
export const getAllAttendancesAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVERURL}/all-attendances`, {}, reqHeader);
};
export const updateAttendanceAPI = async (id, reqBody, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/update-attendance/${id}`,
    reqBody,
    reqHeader,
  );
};

// ------------- User ----------------
// Submit request

export const submitRequestAPI = (reqBody, reqHeader) => {
  return commonAPI("POST", `${SERVERURL}/submit-request`, reqBody, reqHeader);
};

// Get user attendances
export const getUserAttendancesAPI = async (userId, reqHeader) => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/user-attendances/${userId}`,
    {},
    reqHeader,
  );
};
export const updateProfileAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/update-profile`,
    reqBody,
    reqHeader,
  );
};
// Get user's own workout plans
export const getUserWorkoutPlansAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/user-workout-plans`,
    {},
    reqHeader,
  );
};
export const makeGymPaymentAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/make-gym-payment`,
    reqBody,
    reqHeader,
  );
};
export const confirmPaymentAPI = (reqHeader) => {
  return commonAPI("PUT", `${SERVERURL}/confirm-gym-payment`, {}, reqHeader);
};

//   ---------------trainer--------------

// Trainer login
export const trainerLoginAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVERURL}/trainer-login`, reqBody);
};

// Assign workout plan
export const assignWorkoutPlanAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${SERVERURL}/assign-workout-plan`,
    reqBody,
    reqHeader,
  );
};
// Get all workout plans
export const getAllWorkoutPlansAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/all-workout-plans`,
    {},
    reqHeader,
  );
};

// Get all users for trainer
export const getAllUsersForTrainerAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/all-users-trainer`,
    {},
    reqHeader,
  );
};
// UPDATE TRAINER PROFILE
export const updateTrainerProfileAPI = (reqBody, reqHeader) => {
  return commonAPI(
    "PUT",
    `${SERVERURL}/trainer/update-profile`,
    reqBody,
    reqHeader,
  );
};
