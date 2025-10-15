import React, { useMemo, useCallback, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllUsers } from "../../api/FetchAllUsersAPI";

export default function EntityRecords({
  fields = [],
  items = [],
  loading = false,
  onRefresh,
  idField,
}) {
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ----------------------------
  // 🧠 Fetch detailed user info
  // ----------------------------
  const handleViewUser = async (email) => {
    if (!email) return;
    try {
      setModalLoading(true);
      setShowModal(true);

      const res = await fetchAllUsers(email.trim());
      console.log("User details:", res);
      setSelectedUser(res.Data?.[0]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // ----------------------------
  // 🧱 Column Definitions
  // ----------------------------
  const columnDefs = useMemo(() => {
    if (!fields?.length) return [];

    const cols = fields.map((f) => ({
      headerName: f.label,
      field: f.name,
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: f.minWidth || 150,
      flex: f.flex || 1,
    }));

    cols.push({
      headerName: "Actions",
      field: "actions",
      minWidth: 130,
      cellRenderer: (params) => {
        const email = params.data?.Email_ID;
        return (
          <motion.button
            onClick={() => handleViewUser(email)}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-150"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </motion.button>
        );
      },
      cellStyle: { textAlign: "center" },
    });

    return cols;
  }, [fields]);

  // ----------------------------
  // ⚙️ Grid Setup
  // ----------------------------
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setTimeout(() => params.api.sizeColumnsToFit(), 200);
  }, []);

  // ----------------------------
  // 🧩 Modal UI Component
  // ----------------------------
  const Modal = () => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900/90 border border-gray-700 rounded-2xl p-6 w-[500px] shadow-2xl text-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">User Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading user details...
              </div>
            ) : selectedUser ? (
              <div className="space-y-3 text-sm max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-700/50 pb-1"
                  >
                    <span className="font-medium text-gray-400">{key}</span>
                    <span className="text-gray-200 text-right break-words max-w-[250px]">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-6">
                No user data found.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ----------------------------
  // 🧾 Render Component
  // ----------------------------
  return (
    <div className="space-y-4 relative">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
        <div className="text-gray-200 font-medium">
          Total:{" "}
          <span className="text-white font-bold">{items?.length || 0}</span>{" "}
          records
        </div>

        <motion.button
          onClick={onRefresh}
          className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      {/* ✅ AG Grid */}
      <div
        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden"
        style={{
          height: "600px",
          "--ag-background-color": "rgba(31, 41, 55, 0.8)",
          "--ag-header-background-color": "rgba(55, 65, 81, 0.9)",
          "--ag-odd-row-background-color": "rgba(31, 41, 55, 0.4)",
          "--ag-row-hover-color": "rgba(59, 130, 246, 0.1)",
          "--ag-selected-row-background-color": "rgba(59, 130, 246, 0.2)",
          "--ag-foreground-color": "#E5E7EB",
          "--ag-header-foreground-color": "#F3F4F6",
          "--ag-border-color": "rgba(75, 85, 99, 0.3)",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={items || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          rowHeight={56}
          headerHeight={48}
          onGridReady={onGridReady}
        />
      </div>

      {/* ✅ Modal */}
      <Modal />
    </div>
  );
}
