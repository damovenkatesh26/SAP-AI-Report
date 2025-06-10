import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";
import Snackbars from "../Components/Snackbar";
import VoiceInput from "../Components/VoiceText";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const columns = useMemo(() =>
    rows.length > 0
      ? Object.keys(rows[0]).map((key) => ({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
          size: 150,
          enableColumnFilter: true,
        }))
      : [],
    [rows]
  );

const fetchData = async () => {
  setLoading(true);

  if (searchText.trim() === "") {
    showSnackbar("Please fill search value", "error");
    setLoading(false);
    return;
  }

  const payload = {
    question: searchText,
    body: "",
  };

  try {
    const response = await axios.post(`${process.env.REACT_APP_BASIC_URL}`, payload);

    console.log("API Raw Response:", response.data);

    let data = [];

    // Check if response.data.response is a stringified array
    if (typeof response.data.response === "string") {
    } else if (Array.isArray(response.data)) {
      data = response.data;
    } else if (Array.isArray(response.data.data)) {
      data = response.data.data;
    }

    setRows(data);

    if (response.data.message) {
      showSnackbar(response.data.message, "success");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    showSnackbar(
      error?.response?.data?.message || error.message || "Error fetching data",
      "error"
    );
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

const table = useMaterialReactTable({
  columns,
  data: rows,
  state: { isLoading: loading },
  enablePagination: true,
  paginationDisplayMode: "default",
  initialState: {
    pagination: { pageSize: 5 },
    density: 'compact',
  },
  muiTableHeadCellProps: {
    sx: {
      backgroundColor: "#17a2b8",
      color: "black",
      fontWeight: "bold",
      '& .MuiTableSortLabel-root': {
        color: 'black',
        fill: '#fff',
      },
      '& .MuiTableSortLabel-root.Mui-active': {
        color: 'black',
      },
      '& .MuiTableSortLabel-root .MuiTableSortLabel-icon': {
        color: 'black',
        fill: 'black',
      },
      '& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon': {
        color: 'black',
      },
      '& .css-6h9cc6-MuiInputBase-root-MuiInput-root': {
        backgroundColor: '#fff !important',
      },
       '& .css-1umw9bq-MuiSvgIcon-root': {
        color: '#black',
      }
    },
  },
  muiTablePaperProps: {
    elevation: 4,
    sx: {
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
});


  return (
    <div>
      {/* Logo at top left */}
      <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <img src="/sap_logo.png" alt="SAP Logo" style={{ height: 75 }} />
      </Box>

      <div style={{ padding: "25px" }}>
        <Box sx={{ textAlign: "center" }}>
          <h2 style={{ margin: "0px",marginRight:"150px" }}>AI & Analytics Engine</h2>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <TextField
              label="Enter Your Prompt or Keywords"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                width: 400,
                "& .MuiInputBase-root": {
                  height: 50,
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                },
              }}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              disabled={loading}
            />
            <VoiceInput setSearchText={setSearchText} />
            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                height: "50px",
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#125ea2",
                },
              }}
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Box>

        {rows.length > 0 && (
          <Box mt={1}>
            <MaterialReactTable table={table} />
          </Box>
        )}

        <Snackbars
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </div>
    </div>
  );
}
