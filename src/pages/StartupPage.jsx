"use client";
import { useState } from "react";
import { heroData } from "../data/StartupData";
import { useNavigate } from "react-router-dom";

export default function StartupPage({ data = heroData }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStarted = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/form");
      setLoading(false);
    }, 300);
  };
  return (
    <div className="bg-gray-900">
      <div className="relative isolate overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 -z-10 w-full h-full bg-center 
             bg-no-repeat bg-cover 
             sm:bg-repeat sm:bg-contain"
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
          }}
        ></div>

        {/* Tata Logo - Top Left with very little space */}
        <img
          src={data.tataLogo}
          alt="Tata Logo"
          className="absolute top-3 right-0  left-3 sm:top-4 sm:left-6 lg:top-6 lg:left-8 h-16 sm:h-20 lg:h-24 w-auto z-10"
        />

        {/* Edge Logo - Top Center with minimal spacing */}
        <img
          src={data.edgeLogo}
          alt="Edge Logo"
          className="sm:hidden absolute top-14 left-1/2 transform -translate-x-1/2 h-28 sm:h-36 lg:h-44 w-auto"
        />

        {/* Bottom Right Design - Fixed position, larger size */}
        <img
          src={data.rightDesign}
          alt="Design"
          className="fixed bottom-0 right-0 h-32 sm:h-40 lg:h-48 w-auto z-10"
        />

        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-2xl text-center flex flex-col  items-center justify-center">
            {/* Edge Logo - Top Center with minimal spacing */}

            <img
              src={data.edgeLogo}
              alt="Edge Logo"
              className="hidden sm:block h-28 sm:h-36 lg:h-44 w-auto mb-6 sm:mb-8 lg:mb-10"
            />

            {/* Title */}
            <h1 className="text-5xl  lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 lg:mb-6 font-myfont ">
              {data.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-indigo-400 font-semibold mb-2 sm:mb-3 font-myfont">
              {data.subtitle}
            </h2>

            {/* Description */}
            <p className="text-md  lg:text-lg text-gray-300 max-w-2xl mb-6 sm:mb-8 font-myfont">
              {data.description} 
            </p>

            {/* Primary Button Only */}
            <button
              onClick={handleStarted}
              disabled={loading}
              className={`rounded-md px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
    ${
      loading
        ? "bg-indigo-800 cursor-not-allowed opacity-70"
        : "bg-indigo-500 hover:bg-indigo-400"
    }`}
            >
              {loading ? "Getting Started ..." : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
