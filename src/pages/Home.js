import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import axios from "axios";
import Snackbars from "../Components/Snackbar";


const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeadersInner': {
    backgroundColor: '#1976d2', 
    color: '#fff',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
  }
}));

export default function Home() {
    const [searchText, setSearchText] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const columns = useMemo(() => {
        if (rows.length === 0) return [];
        return Object.keys(rows[0]).map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            flex: 1,
            minWidth: 100,
        }));
    }, [rows]);

    const fetchData = async () => {
        setLoading(true);

        try {
            if (searchText.trim().length === 0) {
                showSnackbar("Please fill search value", "error");
                setLoading(false);
                return;
            }

            // const payload = { query: searchText };
            const response = await axios.get(
                `${process.env.REACT_APP_BASIC_URL}`);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];

            setRows(data);

            if (response.data.message) {
                showSnackbar(response.data.message, "success");
            }
        } catch (error) {
            showSnackbar(error.message || "Error fetching data", "error");
            console.error("Error fetching data:", error);
            setRows([]);
        }

        setLoading(false);
    };
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Paper style={{ padding: 25, maxWidth: 1200,height:550, margin: "auto" }}>
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
                            label="Enter Your Promt or Keywords"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Enter Your Promt or Keywords"
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
                        />
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "20px", height: "50px" }}
                            onClick={fetchData}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </Box>
                </Box>

                {rows.length > 0 && <Box >
                    <StyledDataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: { paginationModel: { page: 0, pageSize: 5 } },
                        }}
                        disableRowSelectionOnClick
                        loading={loading}
                        getRowId={(row, index) => row.id || index}

                    />
                </Box>}
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
