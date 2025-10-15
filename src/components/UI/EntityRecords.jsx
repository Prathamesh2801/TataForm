import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Edit, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';



export default function EntityRecords({
  fields = [],
  items = [],
  loading = false,
  onRefresh,
  idField
}) {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const gridRef = useRef();






  const columnDefs = useMemo(() => {

    if (!fields || fields.length === 0) {
      console.warn('No fields provided for column definitions');
      return [];
    }

    const cols = fields
      .filter(f => f.showInGrid !== false) // Show field unless explicitly hidden
      .map(f => {
        const colDef = {
          headerName: f.label,
          field: f.name,
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: f.minWidth || 150,
          flex: f.flex || 1,
          hide: f.hidden || false,
        };

        // Add custom cell renderer if provided
        if (f.cellRenderer) {
          colDef.cellRenderer = f.cellRenderer;
        }

        // Add value formatter if provided
        if (f.valueFormatter) {
          colDef.valueFormatter = f.valueFormatter;
        }

        // Special handling for date fields
        if (f.type === 'date' || f.type === 'datetime-local' || f.name.includes('_At')) {
          colDef.valueFormatter = (params) => {
            if (params.value) {
              try {
                const date = new Date(params.value);
                return date.toLocaleString();
              } catch (e) {
                return params.value;
              }
            }
            return '';
          };
        }

        // Special handling for boolean fields
        if (f.type === 'checkbox') {
          colDef.cellRenderer = (params) => {
            return params.value ?
              '<span class="text-green-400">✓ Yes</span>' :
              '<span class="text-gray-400">✗ No</span>';
          };
        }

        return colDef;
      });

   

    return cols;
  }, [fields]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: false,
  }), []);

  const onGridReady = useCallback((params) => {
    console.log('Grid ready with params:', params);
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
  }, [items]);

  



  const gridOptions = useMemo(() => ({
    animateRows: true,
    rowSelection: 'single',
    suppressRowClickSelection: true,
    enableRangeSelection: false,
    enableCellTextSelection: true,
    suppressMenuHide: false,
    defaultColDef,
    getRowId: (params) => {
      // Use the configured ID field or fall back to index
      return params.data[idField] || params.node.rowIndex;
    },
  }), [defaultColDef, idField]);

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="flex items-center justify-center text-gray-300 p-8">
      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
      <span>Loading data...</span>
    </div>
  );

  // No data overlay component
  const NoDataOverlay = () => (
    <div className="flex flex-col items-center justify-center text-gray-400 p-8">
      <div className="text-4xl mb-4">📋</div>
      <div className="text-lg mb-2">No records found</div>
      <div className="text-sm">Create your first record to get started</div>
    </div>
  );

  return (
    <div className="space-y-4">
     

      {/* Header with stats and refresh */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-gray-200 font-medium">
            Total: <span className="text-white font-bold">{items?.length || 0}</span> records
          </div>
          {loading && (
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        <motion.button
          onClick={onRefresh}
          className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      {/* AG Grid Container */}
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden">
        <div
          className="h-[600px] ag-theme-alpine-dark w-full"
          style={{
            '--ag-background-color': 'rgba(31, 41, 55, 0.8)',
            '--ag-header-background-color': 'rgba(55, 65, 81, 0.9)',
            '--ag-odd-row-background-color': 'rgba(31, 41, 55, 0.4)',
            '--ag-row-hover-color': 'rgba(59, 130, 246, 0.1)',
            '--ag-selected-row-background-color': 'rgba(59, 130, 246, 0.2)',
            '--ag-foreground-color': '#E5E7EB',
            '--ag-header-foreground-color': '#F3F4F6',
            '--ag-border-color': 'rgba(75, 85, 99, 0.3)',
            '--ag-cell-horizontal-border': 'rgba(75, 85, 99, 0.2)',
            '--ag-row-border-color': 'rgba(75, 85, 99, 0.2)',
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={items || []}
            columnDefs={columnDefs}
            gridOptions={gridOptions}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            rowHeight={56}
            headerHeight={48}
            onGridReady={onGridReady}
            loadingOverlayComponent={LoadingOverlay}
            noRowsOverlayComponent={NoDataOverlay}
            suppressLoadingOverlay={!loading}
            suppressNoRowsOverlay={loading || (items && items.length > 0)}
          />
        </div>
      </div>

     
    </div>
  );
}