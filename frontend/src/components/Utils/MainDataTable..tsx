import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Row {
  id: number;
  name: string;
  gender: string;
  mobile: string;
  email: string;
  arrival: string;
  departure: string;
  roomtype: string;
  payment: string;
}

const DataTable = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);

  React.useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      const response = await axios.get("https://api.example.com/data");
      setRows(response.data);
      setFilteredRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const filtered = rows.filter((row) => {
      return (
        row.name.toLowerCase().includes(value) ||
        row.payment.toLowerCase().includes(value) ||
        row.mobile.includes(value) ||
        row.roomtype.toLowerCase().includes(value)
      );
    });
    setFilteredRows(filtered);
  };

  const handleAdd = () => {
    setCurrentRow({
      id: rows.length + 1,
      name: "",
      gender: "",
      mobile: "",
      email: "",
      arrival: "",
      departure: "",
      roomtype: "",
      payment: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (params: any) => {
    setCurrentRow(params.row);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await axios.delete(`https://api.example.com/data/${id}`);
      fetchRows();
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleSave = async () => {
    if (!currentRow) return;
    try {
      if ((currentRow.id || 0) > rows.length) {
        await axios.post("https://api.example.com/data", currentRow);
      } else {
        await axios.put(
          `https://api.example.com/data/${currentRow.id}`,
          currentRow
        );
      }
      setOpenDialog(false);
      fetchRows();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Add
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "mobile", headerName: "Mobile Number", width: 130 },
    { field: "email", headerName: "Email", width: 130, type: "string" },
    { field: "arrival", headerName: "Arrival", width: 130, type: "date" },
    { field: "departure", headerName: "Departure", width: 130, type:"date" },
    { field: "roomtype", headerName: "Room Type", width: 130 },
    { field: "payment", headerName: "Payment", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", backgroundColor:"white", padding:"1rem" }}>
      <TextField
        variant="standard"
        placeholder="Search for reservation"
        value={searchText}
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}

        sx={{height:"90%"}}
        components={{ Toolbar: CustomToolbar }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentRow?.id && currentRow.id > rows.length
            ? "Add a Guest Room Reservation"
            : "Edit Guest Room Reservation"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            value={currentRow?.name || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Check In"
            type="date"
            fullWidth
            value={currentRow?.gender || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, gender: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Check Out"
            type="date"
            fullWidth
            value={currentRow?.mobile || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, mobile: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Payment Status"
            fullWidth
            value={currentRow?.email || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Mobile Number"
            fullWidth
            value={currentRow?.mobile || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, mobile: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Room Type"
            fullWidth
            value={currentRow?.arrival || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, arrival: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Room Type"
            fullWidth
            value={currentRow?.departure || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, departure: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Room Type"
            fullWidth
            value={currentRow?.roomtype || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, roomtype: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Room Type"
            fullWidth
            value={currentRow?.payment || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, payment: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;
