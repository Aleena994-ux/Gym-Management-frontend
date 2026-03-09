import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI, registerAPI, trainerLoginAPI } from "../../services/allAPI";
import { toast } from "react-toastify";

function Auth({ register }) {
  const [viewPassword, setViewPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [emailError, setEmailError] = useState("");
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // REGISTER
  const HandleRegister = async () => {
    const { username, email, password } = userDetails;

    if (!username || !email || !password) {
      toast.warning("Fill the form completely");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      const result = await registerAPI(userDetails);
      if (result.status === 200) {
        toast.success("Registered Successfully");
        setUserDetails({ username: "", email: "", password: "" });
        navigate("/user-request");
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Server Error");
    }
  };

  // LOGIN
  const handleLogin = async () => {
    const { email, password } = userDetails;

    if (!email || !password) {
      toast.warning("Fill the form completely");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      let result;

      // TRAINER LOGIN
      if (role === "trainer") {
        result = await trainerLoginAPI({ email, password });
        if (result.status === 200) {
          sessionStorage.setItem(
            "existingTrainer",
            JSON.stringify(result.data.trainer)
          );
          sessionStorage.setItem("token", result.data.token);
          toast.success("Trainer login successful");
          navigate("/trainer-home");
        }
        return;
      }

      result = await loginAPI({ email, password });

      if (result.status === 200) {
        const user = result.data.existingUser;

        if (
          user.role !== "admin" &&
          (user.membershipStatus === "expired" ||
            (user.membershipEndDate &&
              new Date(user.membershipEndDate) < new Date()))
        ) {
          sessionStorage.setItem("existingUser", JSON.stringify(user));
          sessionStorage.setItem("token", result.data.token);

          toast.error("Membership Expired! Please renew to continue.");
          navigate("/user-payment");
          return;
        }

        // NORMAL LOGIN
        sessionStorage.setItem("existingUser", JSON.stringify(user));
        sessionStorage.setItem("token", result.data.token);
        toast.success("Login Successful");

        if (user.role === "admin") {
          navigate("/admin-home");
        } else {
          if (user.status === "registered") navigate("/user-request");
          else if (user.status === "enquiry-submitted") {
            toast.info("Please wait for admin approval");
            navigate("/");
          } else if (user.status === "approved") navigate("/user-payment");
          else if (user.status === "active-member") navigate("/user-home");
        }
      }

      setUserDetails({ username: "", email: "", password: "" });
      setEmailError("");
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#8b2c2c] p-6">
      <FaHome
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white text-2xl cursor-pointer"
      />

      <div className="max-w-6xl w-full mx-auto bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden flex shadow-2xl">
        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 p-10 bg-white/60 backdrop-blur-2xl rounded-l-2xl">
          <h1 className="text-3xl font-bold mb-2">
            {register ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-700 mb-6">
            A brand new day is here. It’s your day to shape.
          </p>

          {!register && (
            <div className="mb-4">
              <label className="text-sm text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-gray-300"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
              </select>
            </div>
          )}

          {register && (
            <div className="mb-4">
              <label className="text-sm text-gray-700">Username</label>
              <input
                type="text"
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
                className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-gray-300"
              />
            </div>
          )}

          <div className="mb-1">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => {
                setUserDetails({ ...userDetails, email: e.target.value });
                setEmailError("");
              }}
              className={`w-full mt-1 p-3 rounded-lg bg-white/70 border ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {emailError && (
            <p className="text-xs text-red-600 mb-3">{emailError}</p>
          )}

          <div className="mb-4 relative">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={viewPassword ? "text" : "password"}
              value={userDetails.password}
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
              className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-gray-300 pr-10"
            />
            <span className="absolute right-3 top-10 cursor-pointer text-gray-600">
              {viewPassword ? (
                <GoEye onClick={() => setViewPassword(false)} />
              ) : (
                <GoEyeClosed onClick={() => setViewPassword(true)} />
              )}
            </span>
          </div>

          <button
            onClick={register ? HandleRegister : handleLogin}
            className="w-full py-3 rounded-lg text-white font-semibold bg-red-800"
          >
            {register ? "Sign up" : "Login"}
          </button>

          <p className="text-center text-sm mt-6">
            {register ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-red-600 font-semibold">
                  Login
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <Link to="/register" className="text-red-600 font-semibold">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://i.pinimg.com/736x/b9/ca/e2/b9cae2853ae3d51a1be64b4b5f24ea01.jpg"
            alt="gym"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;
