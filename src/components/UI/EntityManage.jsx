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
    [config, loading]
  );

  useEffect(() => {
    fetchItems({}, true);
  }, [fetchItems]);

  const handleRefresh = async () => {
    await fetchItems({}, true);
    recordsKey.current += 1;
  };

  const handleDownloadExcel = () => {
    try {
      if (!items.length) {
        toast.error("No data available to download");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(items);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, config.entity);
      const fileName = `${config.entity}_Data_${
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
