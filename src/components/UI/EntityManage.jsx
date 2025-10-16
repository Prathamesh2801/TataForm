import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download } from "lucide-react";
import EntityRecords from "./EntityRecords";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function EntityManage({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const recordsKey = useRef(0);

  const fetchItems = useCallback(
    async (filters = {}, force = false) => {
      if (!force && loading) return;
      setLoading(true);

      try {
        const res = await config.api.getAll(filters);
        console.log("Raw response:", res);

        let data = [];

        if (res?.Status === true && Array.isArray(res.Data)) {
          data = res.Data;
        } else if (Array.isArray(res)) {
          data = res;
        } else {
          throw new Error(res?.Message || "Invalid response format");
        }

        setItems(data);
        setLastFetch(new Date().toISOString());
        console.log(`Fetched ${data.length} records`);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(
          `Error fetching ${config.entity.toLowerCase()}s: ${err.message}`
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  useEffect(() => {
    fetchItems({}, true);
  }, [fetchItems]);

  const handleRefresh = async () => {
    await fetchItems({}, true);
    recordsKey.current += 1;
  };

  const formatSubmissionTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      // Format according to user's locale (India) for readability
      return new Date(timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return String(timestamp);
    }
  };

  const transformItemsForExcel = (items) => {
    return items.map((item) => {
      // departure / arrival chosen value or the _Other fallback
      const departure =
        item.Flight_Booking === "Yes"
          ? item.Departure_City !== "Other"
            ? item.Departure_City || ""
            : item.Departure_City_Other || ""
          : "";

      const arrival =
        item.Flight_Booking === "Yes"
          ? item.Arrival_City !== "Other"
            ? item.Arrival_City || ""
            : item.Arrival_City_Other || ""
          : "";

      const mealPref =
        item.Meal_Preference && item.Meal_Preference !== "Other"
          ? item.Meal_Preference
          : item.Meal_Preference_Other || "";

      // Visa assistance only shown when Valid_Visa === "No"
      const arrangingVisa =
        item.Valid_Visa === "No" ? item.Arranging_Visa || "" : "";

      return {
        "Full Name": item.Full_Name || "NA",
        "Email Address": item.Email_ID || "NA",
        "Address for Document Collection": item.Address || "NA",
        // Visa
        "Do you currently hold a valid Singapore visa (Valid until at least December 15, 2025)":
          item.Valid_Visa || "NA",
        "We’d be delighted to assist you with arranging your visa to ensure a seamless and hassle-free experience":
          arrangingVisa || "NA",
        // Flight
        "We’d be delighted to arrange your flights for a smooth journey. If your company policy requires you to book your own, just let us know ":
          item.Flight_Booking || "NA",
        "Departure City": departure || 'NA',
        "Arrival City": arrival || 'NA',
        "Seat Preference": item.Seat_Preference || 'NA',

        // Journey extras
        "Preference for Leisure Activity on the 13th of December, 2025":
          item.Preference_Leisure_Activity || "NA",
        "Meal Preference": mealPref || "NA",
        "Food Allergies": item.Food_Allergies || "NA",
        // Submission
        "Submitted On": formatSubmissionTime(item.Created_At),
       
      };
    });
  };

  const handleDownloadExcel = () => {
    try {
      if (!items || !items.length) {
        toast.error("No data available to download");
        return;
      }

      const rows = transformItemsForExcel(items);

      const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        config.entity || "Data"
      );

      const fileName = `${config.entity || "Entity"}_Data_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Excel file downloaded successfully");
    } catch (err) {
      console.error("Excel download error:", err);
      toast.error("Failed to generate Excel file");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 md:p-6 shadow-2xl space-y-4 sm:space-y-0">
              {/* Left Section */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {config.entity?.slice(0, 2).toUpperCase() || "EN"}
                  </span>
                </div>

                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                    {config.entity} Records
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    View and export {config.entity.toLowerCase()} data
                    {items.length > 0 && (
                      <span className="text-blue-300 ml-1 sm:ml-2">
                        ({items.length})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Section: Actions */}
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                  />
                </motion.button>

                <motion.button
                  onClick={handleDownloadExcel}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 shadow-md text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden xs:inline sm:inline-block">
                    Download Excel
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Records Table */}
          <motion.div
            key={`records-${recordsKey.current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EntityRecords
              fields={config.fields}
              items={items}
              loading={loading}
              idField={config.idField}
              onRefresh={() => fetchItems()}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
