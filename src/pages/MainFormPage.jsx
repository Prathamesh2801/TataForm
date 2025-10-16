import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  User,
  Plane,
  Utensils,
} from "lucide-react";
import { heroData } from "../data/StartupData";
import { SubmitData } from "../api/SubmitUserData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MainFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    hasVisa: "",
    needsVisaAssistance: "",
    needsFlightBooking: "",
    departureCity: "",
    departureCityOther: "",
    arrivalCity: "",
    arrivalCityOther: "",
    seatPreference: "",
    leisureActivity: "",
    mealPreference: "",
    mealPreferenceOther: "",
    foodAllergies: "",
  });

  const cities = [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Kolkata",
    "Mumbai",
    "Pune",
    "Other",
  ];

  const seatOptions = ["Window", "Aisle", "Either"];

  const mealOptions = ["Vegetarian", "Non-Vegetarian", "Jain", "Other"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // wrapper for select changes to clear the "Other" text when not needed
  const handleSelectChange = (field, value) => {
    if (field === "departureCity") {
      setFormData((prev) => ({
        ...prev,
        departureCity: value,
        // clear other text when user picks a normal city
        departureCityOther: value === "Other" ? prev.departureCityOther : "",
      }));
    } else if (field === "arrivalCity") {
      setFormData((prev) => ({
        ...prev,
        arrivalCity: value,
        arrivalCityOther: value === "Other" ? prev.arrivalCityOther : "",
      }));
    } else if (field === "mealPreference") {
      setFormData((prev) => ({
        ...prev,
        mealPreference: value,
        mealPreferenceOther: value === "Other" ? prev.mealPreferenceOther : "",
      }));
    } else {
      handleInputChange(field, value);
    }
  };

  const isPage1Valid = () => {
    if (!formData.fullName || !formData.address || !formData.hasVisa)
      return false;
    if (formData.hasVisa === "No" && !formData.needsVisaAssistance)
      return false;
    return true;
  };

  const isPage2Valid = () => {
    if (!formData.needsFlightBooking) return false;
    if (formData.needsFlightBooking === "Yes") {
      // require departure & arrival — if "Other" chosen then require the corresponding Other text
      const hasDeparture =
        formData.departureCity &&
        (formData.departureCity !== "Other" ||
          (formData.departureCity === "Other" &&
            formData.departureCityOther?.trim() !== ""));
      const hasArrival =
        formData.arrivalCity &&
        (formData.arrivalCity !== "Other" ||
          (formData.arrivalCity === "Other" &&
            formData.arrivalCityOther?.trim() !== ""));
      if (!hasDeparture || !hasArrival) return false;
    }
    return true;
  };

  const isPage3Valid = () => {
    if (
      formData.mealPreference === "Other" &&
      !formData.mealPreferenceOther?.trim()
    ) {
      return false;
    }
    return true;
  };

  const nextPage = () => {
    if (currentPage === 1 && isPage1Valid()) setCurrentPage(2);
    else if (currentPage === 2 && isPage2Valid()) setCurrentPage(3);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await SubmitData(formData);
      console.log("Submitted Data : ", result);
      if (result.Status) {
        toast.success(result?.Message || "Form submitted successfully!", {
          duration: 1000,
        });
        console.log(result);
        navigate("/finalSubmit");
      } else {
        toast.error(result?.Message || "Invalid Inputs.");
      }
    } catch (err) {
      toast.error(err?.Message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: `url(${heroData.form_background_image})  center/contain`,
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white/100 backdrop-blur-md rounded-t-2xl shadow-lg p-6 md:p-8 border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              TATA AIG Edge Elite
            </h1>
            <div className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Singapore Edition
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentPage >= step
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentPage > step ? <Check size={20} /> : step}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden md:block">
                    {step === 1 ? "Personal" : step === 2 ? "Travel" : "Extras"}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      currentPage > step
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {currentPage === 1 && (
            <div className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="mb-2">
                When you submit this form, it will not automatically collect
                your details like name and email address unless you provide it
                yourself.
              </p>
              <p className="mb-2">
                We’re excited to make this journey a truly memorable one for
                you. To help us plan your travel seamlessly, we request you to
                share the information mentioned below.
              </p>
              <p className="mb-2">
                The details and documents you provide will be used exclusively
                for your travel and visa arrangements and will remain strictly
                confidential.
              </p>
              <p className="mb-2">
                Fields marked with an asterisk (
                <span className="text-red-500">*</span>) are mandatory and must
                be filled in order to proceed.
              </p>
              <p className="mb-2">
                Should you need any assistance while completing the form, please
                feel free to contact us at{" "}
                <span className="font-semibold">+919833187924</span> or write to
                us at{" "}
                <span className="font-semibold">edgeelite@ihmgroup.in</span> -
                our team will be happy to help.
              </p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-lg p-6 md:p-8">
          {/* Page 1: Personal Details */}
          {currentPage === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (As it appears on your Passport){" "}
                  <span className="text-red-500 mx-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500 mx-1">*</span>
                  <span className="block text-sm text-gray-500 font-normal mt-1">
                    (Your email will be recorded and used for form submission)
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address for Document Collection (Required for travel and visa
                  arrangements)<span className="text-red-500 mx-1">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you currently hold a valid Singapore visa (Valid until at
                  least December 15, 2025)?{" "}
                  <span className="text-red-500 mx-1">*</span>
                </label>
                <div className="space-y-3">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.hasVisa === option
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="hasVisa"
                        value={option}
                        checked={formData.hasVisa === option}
                        onChange={(e) =>
                          handleInputChange("hasVisa", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.hasVisa === "No" && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    We’d be delighted to assist you with arranging your visa to
                    ensure a seamless and hassle-free experience*
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        value: "Yes",
                        label:
                          "Yes, I would appreciate assistance with arranging my visa",
                      },
                      {
                        value: "No",
                        label:
                          "No, I'm comfortable managing the visa arrangements on my own",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.needsVisaAssistance === option.value
                            ? "border-purple-600 bg-white"
                            : "border-purple-200 hover:border-purple-400 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="needsVisaAssistance"
                          value={option.value}
                          checked={
                            formData.needsVisaAssistance === option.value
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "needsVisaAssistance",
                              e.target.value
                            )
                          }
                          className="w-4 h-4 text-purple-600 mt-1"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Page 2: Flight Bookings */}
          {currentPage === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Plane className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Flight Bookings
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  We’d be delighted to arrange your flights for a smooth
                  journey. If your company policy requires you to book your own,
                  just let us know <span className="text-red-500 mx-1">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "Yes",
                      label:
                        "Yes, I would appreciate assistance with my flight bookings",
                    },
                    {
                      value: "No",
                      label:
                        "No, I'm planning to book my flights independently",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.needsFlightBooking === option.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="needsFlightBooking"
                        value={option.value}
                        checked={formData.needsFlightBooking === option.value}
                        onChange={(e) =>
                          handleInputChange(
                            "needsFlightBooking",
                            e.target.value
                          )
                        }
                        className="w-4 h-4 text-blue-600 mt-1"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.needsFlightBooking === "Yes" && (
                <div className="space-y-6 bg-blue-50 p-6 rounded-lg border border-blue-200 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Departure & Arrival Details
                    </h3>
                  </div>

                  {/* Departure City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure City{" "}
                      <span className="text-red-500 mx-1">*</span>
                    </label>
                    <select
                      value={formData.departureCity}
                      onChange={(e) =>
                        handleSelectChange("departureCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">
                        Please select your Departure City
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    {/* Show input if "Other" is selected */}
                    {formData.departureCity === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter your Departure City"
                        value={formData.departureCityOther}
                        onChange={(e) =>
                          handleInputChange(
                            "departureCityOther",
                            e.target.value
                          )
                        }
                        className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      />
                    )}
                  </div>

                  {/* Arrival City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival City <span className="text-red-500 mx-1">*</span>
                    </label>
                    <select
                      value={formData.arrivalCity}
                      onChange={(e) =>
                        handleSelectChange("arrivalCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Please select your Arrival City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    {/* Show input if "Other" is selected */}
                    {formData.arrivalCity === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter your Arrival City"
                        value={formData.arrivalCityOther}
                        onChange={(e) =>
                          handleInputChange("arrivalCityOther", e.target.value)
                        }
                        className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      />
                    )}
                  </div>
                  {/* Seat Preference Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your seat preference
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      Got a favorite seat? Let us know, and we’ll try to snag it
                      for you! (Subject to availability)
                    </p>
                    <select
                      value={formData.seatPreference}
                      onChange={(e) =>
                        handleInputChange("seatPreference", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select seat preference</option>
                      {seatOptions.map((seat) => (
                        <option key={seat} value={seat}>
                          {seat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Page 3: Journey Extras */}
          {currentPage === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Utensils className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Journey Extras
                </h2>
              </div>
              <p className="text-sm text-gray-600 italic">
                To help us enhance your experience!
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preference for Leisure Activity on the 13th of December, 2025
                  <span className="text-red-500 mx-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.leisureActivity}
                  onChange={(e) =>
                    handleInputChange("leisureActivity", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your leisure activity preference"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Options work in progress
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Preference
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Let us know your meal preferences so we can accommodate your
                  needs
                </p>
                <select
                  value={formData.mealPreference}
                  onChange={(e) =>
                    handleSelectChange("mealPreference", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select meal preference</option>
                  {mealOptions.map((meal) => (
                    <option key={meal} value={meal}>
                      {meal}
                    </option>
                  ))}
                </select>
                {formData.mealPreference === "Other" && (
                  <input
                    type="text"
                    placeholder="Enter your meal preference"
                    value={formData.mealPreferenceOther}
                    onChange={(e) =>
                      handleInputChange("mealPreferenceOther", e.target.value)
                    }
                    className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Allergies (If any)
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Let us know if there's anything that makes your taste buds
                  rebel!
                </p>
                <textarea
                  value={formData.foodAllergies}
                  onChange={(e) =>
                    handleInputChange("foodAllergies", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="List any food allergies or dietary restrictions"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 md:p-8 flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {currentPage < 3 ? (
            <button
              onClick={nextPage}
              disabled={
                (currentPage === 1 && !isPage1Valid()) ||
                (currentPage === 2 && !isPage2Valid())
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                (currentPage === 1 && !isPage1Valid()) ||
                (currentPage === 2 && !isPage2Valid())
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              disabled={!isPage3Valid()}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Check size={20} />
              {loading ? "Submitting ..." : "Submit"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MainFormPage;
