
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './common/pages/LandingPage'
import Auth from './common/pages/Auth'
import Services from './common/pages/Services'
import AdminHome from './admin/pages/AdminHome'
import AdminUser from './admin/pages/AdminUser'
import AdminTrainer from './admin/pages/AdminTrainer'
import UserHome from './user/pages/UserHome'
import UserRequest from './user/pages/UserRequest'
import TrainerHome from './trainer/pages/TrainerHome'
import AssignedUsers from './trainer/pages/AssignedUsers'
import WorkoutPlan from './trainer/pages/WorkoutPlan'
import UserWorkoutPlan from './user/pages/UserWorkoutPlan'
import { ToastContainer } from 'react-toastify'
import AdminEnquiry from './admin/pages/AdminEnquiry'
import UserAttendance from './user/pages/UserAttendance'
import AdminAttendance from './admin/pages/AdminAttendance'
import Payment from './user/pages/Payment'
import GymPayment from './admin/pages/GymPayment'

function App() {


  return (
    <>
      <Routes>
        {/* common */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/services' element={<Services />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth register />} />

        {/* admin */}
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-enquiry" element={<AdminEnquiry />} />
        <Route path="/admin-trainer" element={<AdminTrainer />} />
        <Route path="/admin-user" element={<AdminUser />} />
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/admin-payment" element={<GymPayment />} />

        {/* user */}
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/user-request" element={<UserRequest />} />
        <Route path="/user-attendances" element={<UserAttendance />} />
        <Route path="/user-workoutplan" element={<UserWorkoutPlan />} />
        <Route path="/user-payment" element={<Payment />} />



        {/* trainer */}
        <Route path="/trainer-home" element={<TrainerHome />} />
        <Route path="/assigned-users" element={<AssignedUsers />} />
        <Route path="/workout-plan" element={<WorkoutPlan />} />

      </Routes>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        theme='colored'
      />

    </>
  )
}

export default App
