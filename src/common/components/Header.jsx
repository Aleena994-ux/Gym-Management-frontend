import React, { useState } from 'react'
import { FaDumbbell } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center text-xl font-semibold cursor-pointer">
          <FaDumbbell className="text-red-900 mr-2" size={22} />
          <span>Fitora</span>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-300">
          <Link to="/" className="hover:text-red-900">Home</Link>
          <Link to="/services" className="hover:text-red-900">Services</Link>
          <Link to="/login" className="hover:text-red-900">Login</Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="md:hidden bg-black text-gray-300 px-6 pb-4 space-y-3">
          <Link to="/" className="block hover:text-red-900">Home</Link>
          <Link to="/services" className="block hover:text-red-900">Services</Link>
          <Link to="/login" className="block hover:text-red-900">Login</Link>
        </div>
      )}
    </header>
  );
}
