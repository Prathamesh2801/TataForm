import React from "react";
import { X, User, MapPin, Plane, Utensils, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FormModal = ({ isOpen, onClose, userData, loading }) => {
  console.log("Specified User Data : ", userData);
  if (!isOpen) return null;

  const renderField = (label, value, icon) => (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="bg-blue-500/10 rounded-lg p-2 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">
            {label}
          </label>
          <p className="text-gray-200 text-sm break-words">
            {value || (
              <span className="text-gray-500 italic">Not provided</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSection = (title, icon, children) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-700/50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl w-full max-w-4xl shadow-2xl my-8"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileCheck className="text-white" size={24} />
                    <h2 className="text-2xl font-bold text-white">
                      Form Submission Details
                    </h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    TATA AIG Edge Elite Singapore Edition
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading user details...</p>
                </div>
              ) : userData ? (
                <div className="space-y-6">
                  {/* Personal Information */}
                  {renderSection(
                    "Personal Information",
                    <User size={20} className="text-white" />,
                    <>
                      {renderField(
                        "Full Name",
                        userData.Full_Name,
                        <User size={18} className="text-blue-400" />
                      )}
                      {renderField(
                        "Email Address",
                        userData.Email_ID,
                        <User size={18} className="text-blue-400" />
                      )}
                      <div className="md:col-span-2">
                        {renderField(
                          "Address for Document Collection",
                          userData.Address,
                          <MapPin size={18} className="text-blue-400" />
                        )}
                      </div>
                    </>
                  )}

                  {/* Visa Information */}
                  {renderSection(
                    "Visa Information",
                    <FileCheck size={20} className="text-white" />,
                    <div className="md:col-span-2 space-y-4">
                      {renderField(
                        "Do you currently hold a valid Singapore visa (Valid until at least December 15, 2025)",
                        userData.Valid_Visa,
                        <FileCheck size={18} className="text-green-400" />
                      )}
                      {userData.Valid_Visa === "No" &&
                        renderField(
                          "We’d be delighted to assist you with arranging your visa to ensure a seamless and hassle-free experience",
                          userData.Arranging_Visa,
                          <FileCheck size={18} className="text-green-400" />
                        )}
                    </div>
                  )}

                  {/* Flight Information */}
                  {renderSection(
                    "Flight Booking Details",
                    <Plane size={20} className="text-white" />,
                    <>
                      <div className="md:col-span-2">
                        {renderField(
                          "We’d be delighted to arrange your flights for a smooth journey. If your company policy requires you to book your own, just let us know ",
                          userData.Flight_Booking,
                          <Plane size={18} className="text-purple-400" />
                        )}
                      </div>
                      {userData.Flight_Booking === "Yes" && (
                        <>
                          {userData.Departure_City !== "Other" ? (
                            <div className="md:col-span-2">
                              {renderField(
                                "Departure City",
                                userData.Departure_City,
                                <Plane size={18} className="text-purple-400" />
                              )}
                            </div>
                          ) : (
                            userData.Departure_City_Other && (
                              <div className="md:col-span-2">
                                {renderField(
                                  "Departure City (Other)",
                                  userData.Departure_City_Other,
                                  <Plane
                                    size={18}
                                    className="text-purple-400"
                                  />
                                )}
                              </div>
                            )
                          )}

                          {userData.Arrival_City !== "Other" ? (
                            <div className="md:col-span-2">
                              {renderField(
                                "Arrival City",
                                userData.Arrival_City,
                                <Plane size={18} className="text-purple-400" />
                              )}
                            </div>
                          ) : (
                            userData.Arrival_City_Other && (
                              <div className="md:col-span-2">
                                {renderField(
                                  "Arrival City (Other)",
                                  userData.Arrival_City_Other,
                                  <Plane
                                    size={18}
                                    className="text-purple-400"
                                  />
                                )}
                              </div>
                            )
                          )}
                          <div className="md:col-span-2">
                            {renderField(
                              "Seat Preference",
                              userData.Seat_Preference,
                              <Plane size={18} className="text-purple-400" />
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Journey Extras */}
                  {renderSection(
                    "Journey Extras",
                    <Utensils size={20} className="text-white" />,
                    <>
                      <div className="md:col-span-2">
                        {renderField(
                          "Preference for Leisure Activity on the 13th of December, 2025",
                          userData.Preference_Leisure_Activity,
                          <Utensils size={18} className="text-orange-400" />
                        )}
                      </div>
                      {userData.Meal_Preference !== "Other" ? (
                        <div className="md:col-span-2">
                          {renderField(
                            "Meal Preference",
                            userData.Meal_Preference,
                            <Utensils size={18} className="text-orange-400" />
                          )}
                        </div>
                      ) : (
                        userData.Meal_Preference_Other && (
                          <div className="md:col-span-2">
                            {renderField(
                              "Meal Preference (Other)",
                              userData.Meal_Preference_Other,
                              <Utensils size={18} className="text-orange-400" />
                            )}
                          </div>
                        )
                      )}

                      <div className="md:col-span-2">
                        {renderField(
                          "Food Allergies",
                          userData.Food_Allergies,
                          <Utensils size={18} className="text-orange-400" />
                        )}
                      </div>
                    </>
                  )}

                  {/* Submission Info */}
                  {userData.Submission_Time && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Submitted On
                      </p>
                      <p className="text-gray-200 text-sm">
                        {new Date(userData.Submission_Time).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "full",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-700/30 rounded-full p-4 mb-4">
                    <X size={48} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No user data found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-800/50 border-t border-gray-700/50 p-4 rounded-b-2xl flex justify-end">
              <motion.button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(55, 65, 81, 0.3);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.7);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
