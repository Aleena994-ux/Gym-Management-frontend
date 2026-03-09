import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { makeGymPaymentAPI } from "../../services/allAPI";
import { FaHome } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

function Payment() {
  const navigate = useNavigate(); 

  const handleGymPayment = async (duration) => {
    const stripe = await loadStripe(
      "pk_test_51ScrrcRXMmxRbyh1EJVdNS2fWmS9ca3VetFOipQVzgC9rbLQPJGXpR3WFcHYwVQjgCFMGwuPJcl2zohWTUcAerEc00UcZ98XJR"
    );

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Please login");
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    const reqBody = {
      duration: duration,
    };

    try {
      const result = await makeGymPaymentAPI(reqBody, reqHeader);
      if (result.status === 200) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex justify-center items-center p-6 relative">
     
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 p-3 rounded-full shadow-md"
        title="Go to Home"
      >
        <FaHome className="text-white text-xl" />
      </button>

      <div className="bg-gray-900/90 p-10 rounded-2xl text-center space-y-6 shadow-2xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-extrabold tracking-wide mb-6">
          Choose Your Plan
        </h2>

        <button
          onClick={() => handleGymPayment(1)}
          className="bg-green-600 hover:bg-green-700 transition-colors duration-300 px-8 py-4 rounded-lg w-full text-lg font-semibold shadow-md hover:shadow-lg"
        >
          1 Month – ₹1000
        </button>

        <button
          onClick={() => handleGymPayment(3)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-8 py-4 rounded-lg w-full text-lg font-semibold shadow-md hover:shadow-lg"
        >
          3 Months – ₹2800
        </button>

        <button
          onClick={() => handleGymPayment(6)}
          className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300 px-8 py-4 rounded-lg w-full text-lg font-semibold shadow-md hover:shadow-lg"
        >
          6 Months – ₹5500
        </button>

        <p className="text-gray-300 mt-4 text-sm">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}

export default Payment;