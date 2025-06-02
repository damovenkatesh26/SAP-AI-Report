import React, { useState, useMemo, useEffect } from "react";
import {
    Paper,
    TextField,
    Box,
    IconButton,
    Button,
    Popover,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Snackbars from "../Components/Snackbar";
import VoiceInput from "../Components/VoiceText";
import axios from "axios";

export default function Home() {
    const [searchText, setSearchText] = useState("");
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [anchorEl, setAnchorEl] = useState(null);
    const [filters, setFilters] = useState({});

    const columns = useMemo(() => {
        if (rows.length === 0) return [];
        return Object.keys(rows[0]);
    }, [rows]);

    useEffect(() => {
        let filtered = [...rows];
        Object.entries(filters).forEach(([col, val]) => {
            if (val.trim() !== "") {
                filtered = filtered.filter((row) =>
                    row[col]?.toString().toLowerCase().includes(val.toLowerCase())
                );
            }
        });
        setFilteredRows(filtered);
        setPage(0);
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
            setFilters({});
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

    const handleSnackbarClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

    const currentRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                elevation={3}
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
                        {/* <VoiceInput setSearchText={setSearchText} /> */}
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
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        >
                            <Box sx={{ p: 2, maxWidth: 300 }}>
                                <Typography variant="h6" gutterBottom>
                                    Filters
                                </Typography>
                                {columns.length === 0 ? (
                                    <Typography>No data to filter</Typography>
                                ) : (
                                    columns.map((col) => (
                                        <TextField
                                            key={col}
                                            label={`Filter by ${col}`}
                                            value={filters[col] || ""}
                                            onChange={(e) => handleFilterChange(col, e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        />
                                    ))
                                )}
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
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: 3,
                            mt: 3,
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableCell
                                            key={col}
                                            sx={{
                                                fontWeight: "bold",
                                                backgroundColor: "#1976d2",
                                                color: "#fff",
                                                borderRight: index !== columns.length - 1 ? "1px solid #ccc" : "none",
                                            }}
                                        >
                                            {col.charAt(0).toUpperCase() + col.slice(1)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {currentRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No data found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentRows.map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                            sx={{
                                                backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                                            }}
                                        >
                                            {columns.map((col, index) => (
                                                <TableCell
                                                    key={col}
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        borderRight: index !== columns.length - 1 ? "1px solid #ccc" : "none",
                                                    }}
                                                    title={row[col]?.toString() || ""}
                                                >
                                                    {row[col]?.toString()}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

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
                                        colSpan={columns.length}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
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
