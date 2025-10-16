import React from "react";
import { CheckCircle, Plane, ArrowRight, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalSubmitPage = () => {
  const navigate = useNavigate();
  const onSubmitAnother = () => {
    navigate("/form");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg animate-bounce-once">
                <CheckCircle
                  className="text-green-500"
                  size={64}
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Submission Successful!
            </h1>
            <p className="text-blue-100 text-lg">
              Your details have been received
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10">
            {/* Icon with Plane */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 rounded-full p-4">
                <Plane className="text-blue-600" size={40} />
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                TATA AIG Edge Elite Singapore Edition
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Thank you for promptly providing the necessary details. We'll be
                in touch soon to confirm everything before booking your flight
                tickets. If you have any questions in the meantime, please feel
                free to reach out.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                Need Assistance?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <a
                    href="tel:+919833187924"
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    +91 98331 87924
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    <Mail size={18} className="text-purple-600" />
                  </div>
                  <a
                    href="mailto:edgeelite@ihmgroup.in"
                    className="font-medium hover:text-purple-600 transition-colors"
                  >
                    edgeelite@ihmgroup.in
                  </a>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={onSubmitAnother}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <span>Submit Another Response</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            {/* Decorative Element */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                We look forward to making your Singapore journey memorable!
              </p>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default FinalSubmitPage;
