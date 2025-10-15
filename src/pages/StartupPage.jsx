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
    }, 1000);
  };
  return (
    <div className="bg-gray-900">
      <div className="relative isolate overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 -z-10 w-full h-full object-cover"
        />
        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-20 sm:px-5 sm:py-24 lg:py-32 text-center flex flex-col gap-4 items-center justify-center">
            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {data.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-3xl text-indigo-400 font-semibold mb-2">
              {data.subtitle}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mb-8">
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
