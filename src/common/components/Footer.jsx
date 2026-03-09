import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaDumbbell } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 mt-0">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="flex items-center text-white text-xl font-semibold mb-3">
            <FaDumbbell className="text-red-900 mr-2" /> Fitora
          </h2>
          <p className="text-sm leading-6">
            Your complete fitness companion. Manage workouts, <br/>
            trainers and memberships — all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-red-900 cursor-pointer">Home</li>
            <li className="hover:text-red-900 cursor-pointer">Membership Plans</li>
            <li className="hover:text-red-900 cursor-pointer">Trainers</li>
            <li className="hover:text-red-900 cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact & Location</h3>
          
          <p className="text-sm leading-6">
            Fitora <br />
            Near Lulu Mall, Kochi, Kerala <br />
            Pin: 682024
          </p>

          <p className="text-sm leading-6 mt-3">
            📞+91 98765 43210 <br />
            📧 fitora@gmail.com
          </p>

          <div className="flex space-x-4 text-xl mt-4">
            <FaFacebook className="cursor-pointer hover:text-red-900" />
            <FaInstagram className="cursor-pointer hover:text-red-900" />
            <FaTwitter className="cursor-pointer hover:text-red-900" />
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Fitora. All rights reserved.
      </div>
    </footer>
  );
}
