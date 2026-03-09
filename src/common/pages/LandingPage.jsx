import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaDumbbell, FaUserAlt, FaRunning, FaClipboardList } from "react-icons/fa";
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      <Header />

      <div className="bg-black text-white min-h-screen">

        <section
          className="flex flex-col items-center justify-center text-center px-6 py-24 min-h-[90vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://cdn.prod.website-files.com/636ad79c285d5e42665bb269/6679cbc219540c9f037d7318_January-9-2024%20The%20Bridge%20Gym%20South-99.jpg')",
          }}
        >
          <div className="bg-black/50 p-6 rounded-xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Transform Your Fitness Journey
            </h1>
            <p className="text-gray-300 max-w-2xl mb-6 text-lg">
              A complete Gym Management System to manage trainers, members, workout plans,
              payments and progress — all in one seamless platform.
            </p>

            <button className="bg-red-900 hover:bg-red-800 px-8 py-3 rounded-full text-white text-lg transition">
              Get Started
            </button>
          </div>
        </section>


        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Explore Our Physical Gym Facility</h2>
          <p className="text-gray-300 mb-8">
            Experience a premium fitness environment
          </p>

          <div className="grid md:grid-cols-2 gap-10">

            <div>
              <img
                src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba"
                className="w-full"
                alt="Gym Facility"
              />
            </div>

            <div className='ps-24 pt-16 '>


              <p className="text-lg  text-gray-300 ">
                <span className="font-bold text-white">Fitora</span> <br />
                Near Lulu Mall, Kochi, Kerala<br />
                Pin: 682024 <br />
                <span className="font-semibold">Timing:</span> 5:00 AM – 10:00 PM (All Days)<br />
                <span>📞+91 98765 43210 </span><br />
                <span>📞+91 77589 84949 </span><br />
                <span >📧 fitora@gmail.com</span>

              </p>
            </div>

          </div>
        </section>



        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Inside Our Gym
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-700 transition">
              <img
                src="https://i.shgcdn.com/d61f124a-5eb2-41c7-abd1-ace0dd6f7d97/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
                className="w-full h-60 object-cover"
                alt="Workout Area"
              />
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">Fully Equipped Workout Area</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-700 transition">
              <img
                src="https://www.nuffieldhealth.com/content/dam/nuffieldhealth/pt-pages-images/Pt%20image%20-%20man%20in%20grey%201.jpg"
                className="w-full h-60 object-cover"
                alt="Training Zone"
              />
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">Personal Training Zone</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-700 transition">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5696733025981d28a35ef8ab/a6ee8679-f3b1-4326-b6e6-46f01a5acc82/38.jpg"
                className="w-full h-60 object-cover"
                alt="Fitness Area"
              />
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">Clean & Professional Environment</p>
              </div>
            </div>

          </div>
        </section>

        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">Membership Plans</h2>
            <p className="text-gray-300">
              Choose a plan duration that fits your fitness goals. No hidden charges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:scale-105 transition flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">1 Month</h3>
              <p className="text-gray-400 mb-6">Flexible short-term plan.</p>
              <h4 className="text-4xl font-bold mb-6">₹1,000<span className="text-lg"> / month</span></h4>
              <ul className="text-gray-300 space-y-3 mb-6">
                <li>✔ Full Gym Access</li>
                <li>✔ Personal Trainer Support</li>
                <li>✔ Custom Diet Plan</li>
                <li>✔ Locker & Shower Access</li>
                <li>✔ Basic Fitness Assessment</li>
              </ul>
            </div>

            <div className="bg-red-900 p-8 rounded-2xl shadow-xl hover:scale-105 transition flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">3 Months</h3>
              <p className="text-gray-100 mb-6">Most popular choice.</p>
              <h4 className="text-4xl font-bold mb-6">₹2800<span className="text-lg"> / 3 months</span></h4>
              <ul className="text-white space-y-3 mb-6">
                <li>✔ All 1 Month Features</li>
                <li>✔ Dedicated Personal Trainer</li>
                <li>✔ Personalized Diet Plan</li>
                <li>✔ Progress Tracking</li>
                <li>✔ Workout Plan Updates</li>
              </ul>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:scale-105 transition flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">6 Months</h3>
              <p className="text-gray-400 mb-6">Best value for long-term results.</p>
              <h4 className="text-4xl font-bold mb-6">₹5,500<span className="text-lg"> / 6 months</span></h4>
              <ul className="text-gray-300 space-y-3 mb-6">
                <li>✔ All 3 Month Features</li>
                <li>✔ Priority Personal Trainer Access</li>
                <li>✔ Advanced Diet & Nutrition Plan</li>
                <li>✔ Injury Prevention Guidance</li>
              </ul>
            </div>

          </div>


          <div className="mt-12 text-center">
            <Link to={"/user-request"}
              className="bg-red-900 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition text-lg inline-block"
            >
              Enquire Now
            </Link>
          </div>
        </section>


      </div>

      <Footer />
    </>
  );
}

export default LandingPage;
