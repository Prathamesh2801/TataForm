import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { fetchAllUsers } from "../../api/FetchAllUsersAPI";
import FormModal from "./FormModal";

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
      setSelectedUser(null);

      const res = await fetchAllUsers(email.trim());
      console.log("User details:", res);
      setSelectedUser(res.Data?.[0] || null);
    } catch (err) {
      console.error("Fetch error:", err);
      setSelectedUser(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedUser(null), 300);
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
      cellStyle: {
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
      },
    }));

    cols.push({
      headerName: "Actions",
      field: "actions",
      minWidth: 130,
      maxWidth: 150,
      pinned: "right",
      cellRenderer: (params) => {
        const email = params.data?.Email_ID;
        return (
          <div className="flex items-center justify-center h-full">
            <motion.button
              onClick={() => handleViewUser(email)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-150"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </motion.button>
          </div>
        );
      },
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
      },
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
      wrapText: false,
      autoHeight: false,
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 200);
  }, []);

  // Auto-resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (gridApi) {
        gridApi.sizeColumnsToFit();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi]);

  // ----------------------------
  // 🧾 Render Component
  // ----------------------------
  return (
    <div className="space-y-4 relative">
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-2">
              <span className="text-white font-bold text-lg">
                {items?.length || 0}
              </span>
            </div>
            <div className="text-gray-200">
              <p className="text-sm text-gray-400">Total Records</p>
              <p className="text-xs text-gray-500">Form Submissions</p>
            </div>
          </div>

          <motion.button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-lg transition-all border border-gray-600/50 hover:border-gray-500/50"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="font-medium">Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* AG Grid Table */}
      <div
        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl"
        style={{
          height: "600px",
          "--ag-background-color": "rgba(17, 24, 39, 0.8)",
          "--ag-header-background-color": "rgba(31, 41, 55, 0.95)",
          "--ag-odd-row-background-color": "rgba(31, 41, 55, 0.4)",
          "--ag-row-hover-color": "rgba(59, 130, 246, 0.15)",
          "--ag-selected-row-background-color": "rgba(59, 130, 246, 0.25)",
          "--ag-foreground-color": "#E5E7EB",
          "--ag-header-foreground-color": "#F9FAFB",
          "--ag-border-color": "rgba(75, 85, 99, 0.3)",
          "--ag-row-border-color": "rgba(75, 85, 99, 0.2)",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={items || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          rowHeight={60}
          headerHeight={52}
          onGridReady={onGridReady}
          animateRows={true}
          suppressCellFocus={true}
          rowSelection="single"
        />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        userData={selectedUser}
        loading={modalLoading}
      />
    </div>
  );
}
