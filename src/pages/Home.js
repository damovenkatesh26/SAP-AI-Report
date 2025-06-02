import React, { useState, useMemo, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Snackbars from "../Components/Snackbar";
import axios from "axios";

// Import these for TablePagination
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Pagination state
  const [page, setPage] = useState(0); // Note: TablePagination uses zero-based page index
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});

  // Columns inferred from rows
  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  useEffect(() => {
    // Apply filters to rows
    let filtered = [...rows];
    Object.entries(filters).forEach(([col, val]) => {
      if (val.trim() !== "") {
        filtered = filtered.filter((row) =>
          row[col]
            ?.toString()
            .toLowerCase()
            .includes(val.toLowerCase())
        );
      }
    });
    setFilteredRows(filtered);
    setPage(0); // Reset page on filter change
  }, [filters, rows]);

  const fetchData = async () => {
    setLoading(true);

    try {
      if (searchText.trim().length === 0) {
        showSnackbar("Please fill search value", "error");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BASIC_URL}`);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setRows(data);
      setFilters({}); // Reset filters on new data

      if (response.data.message) {
        showSnackbar(response.data.message, "success");
      }
    } catch (error) {
      showSnackbar(error.message || "Error fetching data", "error");
      setRows([]);
    }

    setLoading(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Filter icon click
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close filter popover
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  // Pagination: Calculate current rows slice
  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Pagination handlers required by TablePagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to first when rows per page changes
  };

  // Handle filter input change
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <div>
      <Paper
        style={{ padding: 25, maxWidth: 1200, minHeight: 550, margin: "auto" }}
      >
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <h2>SAP Report</h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Enter Your Prompt or Keywords"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter Your Prompt or Keywords"
              sx={{
                width: 400,
                "& .MuiInputBase-root": {
                  height: 50,
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                  fontSize: "1rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "1rem",
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchData();
                }
              }}
              disabled={loading}
            />
            <Button
              variant="contained"
              sx={{ borderRadius: "20px", height: "50px" }}
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>

            <IconButton
              aria-describedby={id}
              onClick={handleFilterClick}
              color={Object.values(filters).some((f) => f) ? "primary" : "default"}
              size="large"
            >
              <MoreVertIcon />
            </IconButton>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                {columns.length === 0 && (
                  <Typography>No data to filter</Typography>
                )}
                {columns.map((col) => (
                  <TextField
                    key={col}
                    label={`Filter by ${col}`}
                    value={filters[col] || ""}
                    onChange={(e) => handleFilterChange(col, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setFilters({})}
                  fullWidth
                  size="small"
                >
                  Clear Filters
                </Button>
              </Box>
            </Popover>
          </Box>
        </Box>

        {rows.length > 0 ? (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  {columns.map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 10px",
                        fontWeight: "bold",
                        borderBottom: "2px solid #115293",
                      }}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: "center", padding: 20 }}>
                      No data found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #ddd",
                        backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                      }}
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          style={{
                            padding: "8px 10px",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={row[col]?.toString() || ""}
                        >
                          {row[col]?.toString()}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>

              {/* Add TableFooter with TablePagination here */}
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Rows per page:"
                    sx={{
                      ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </TableRow>
              </TableFooter>
            </table>
          </>
        ) : loading ? (
          <Typography sx={{ textAlign: "center", mt: 4 }}>Loading...</Typography>
        ) : null}
      </Paper>

      <Snackbars
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
}
