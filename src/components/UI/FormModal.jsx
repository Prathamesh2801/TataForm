import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { heroData } from "../data/StartupData";
import toast from "react-hot-toast";
import { fetchAllUsers } from "../../api/FetchAllUsersAPI";

const FormModal = ({ isOpen, onClose, email }) => {
  const [loading, setLoading] = useState(false);
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
  const mealOptions = ["Vegetarian", "Non-Vegetarian", "Jain", "Other"];

  useEffect(() => {
    if (isOpen && email) fetchUserData(email);
  }, [isOpen, email]);

  const fetchUserData = async (email) => {
    setLoading(true);
    try {
      const response = await fetchAllUsers(email);
      const result = await response.json();

      if (result?.Status) {
        setFormData(result.Data);
        toast.success("Data loaded successfully");
      } else {
        toast.error(result?.Message || "Failed to load data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{
          background: `url(${heroData.form_background_image}) no-repeat center/cover`,
        }}
      >
        {/* Header */}
        <div className="bg-white/95 p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            User Form Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 bg-white/95">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-600">
              <Loader2 className="animate-spin mr-2" /> Fetching user data...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Visa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Singapore Visa
                </label>
                <select
                  value={formData.hasVisa}
                  onChange={(e) => handleInputChange("hasVisa", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Flight Booking */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Need Flight Booking Assistance
                </label>
                <select
                  value={formData.needsFlightBooking}
                  onChange={(e) =>
                    handleInputChange("needsFlightBooking", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Departure City */}
              {formData.needsFlightBooking === "Yes" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure City
                    </label>
                    <select
                      value={formData.departureCity}
                      onChange={(e) =>
                        handleInputChange("departureCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {formData.departureCity === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify Departure City"
                        value={formData.departureCityOther}
                        onChange={(e) =>
                          handleInputChange(
                            "departureCityOther",
                            e.target.value
                          )
                        }
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival City
                    </label>
                    <select
                      value={formData.arrivalCity}
                      onChange={(e) =>
                        handleInputChange("arrivalCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {formData.arrivalCity === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify Arrival City"
                        value={formData.arrivalCityOther}
                        onChange={(e) =>
                          handleInputChange("arrivalCityOther", e.target.value)
                        }
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Meal Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Preference
                </label>
                <select
                  value={formData.mealPreference}
                  onChange={(e) =>
                    handleInputChange("mealPreference", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {mealOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {formData.mealPreference === "Other" && (
                  <input
                    type="text"
                    placeholder="Specify Meal Preference"
                    value={formData.mealPreferenceOther}
                    onChange={(e) =>
                      handleInputChange("mealPreferenceOther", e.target.value)
                    }
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Allergies
                </label>
                <textarea
                  rows="3"
                  value={formData.foodAllergies}
                  onChange={(e) =>
                    handleInputChange("foodAllergies", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
