import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Divider,
  Backdrop,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CustomLoadingButton from "../Utils/CustomLoadingButton";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import { gridClasses } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { APIContext } from "../../Contexts";
import FaceIcon from "@mui/icons-material/Face";
import { IconPlus, IconTrash } from "@tabler/icons-react";


interface Row {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  mobile: string;
  email: string;
  emergency_name: string;
  emergency_tel: string;
  emergency_relation: string;
}

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const AllGuests = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:1023px)");
  const [fetchingRows, setFetchingRows] = React.useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)
  const [showingResults, setShowingResults] = React.useState<boolean>(false)

  React.useEffect(() => {
    fetchRows();
  }, []);

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("No context")
  }
  const {paymentDetails, setPaymentDetails} = context;

  const fetchRows = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const response = await axios.get(
        "https://guestmanagerapi.onrender.com/api/guests/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
      );
      setRows(response.data);
      setFilteredRows(response.data);
      console.log("len of filtered row=", filteredRows.length)
      setPaymentDetails({...paymentDetails, globalLoading:false})
    } catch (error: any) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error fetching data");
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const { data } = await axios.get(
        `https://guestmanagerapi.onrender.com/api/guests/search/${searchText}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
      );
      setShowingResults(true)
      setFilteredRows(data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error fetching data", { position: "bottom-center" });
      fetchRows();
    }
  };

  const handleClearShowingResults = ()=>{
    fetchRows();
    setShowingResults(false);
    setSearchText("")
  }

  const handleEdit = (params: any) => {
    setCurrentRow(params.row);
    setOpenDialog(true);
  };

  const handleDelete = (id: GridRowId) => {
    setSelectedRowId(Number(id));
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedRowId === null) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `https://guestmanagerapi.onrender.com/api/guests/delete/${selectedRowId}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
      );
      setRows(rows.filter(row => row.id !== selectedRowId));
      toast.success("Guest deleted successfully");
    } catch (error) {
      toast.error("Failed to delete guest");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      fetchRows()
    }
  };

  const handleSave = async () => {
    try {
      if (currentRow?.id) {
        setIsLoading(true);
        await axios.put(
          `https://guestmanagerapi.onrender.com/api/guests/${currentRow.id}/`, 
          currentRow, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
        );

        setIsLoading(false);
        toast.success("Edited successfully", { position: "bottom-center" });
        setOpenDialog(false);
        fetchRows();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occured!");
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          onClick={() => navigate("/cms/guest/new")}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 100 },
    { field: "first_name", headerName: "First Name", width: 100 },
    { field: "last_name", headerName: "Last Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "mobile", headerName: "Mobile Number", width: 200 },
    { field: "emergency_name", headerName: "Emergency Name", width: 200 },
    { field: "emergency_tel", headerName: "Emergency Contact", width: 200 },
    { field: "has_paid", headerName: "Has Paid", width: 200 },
    { field: "is_booked", headerName: "Is Booked", width: 200 },
    { field: "created_at", headerName: "Date Added", width: 200 },
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
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
      <h2 className=" text-center text-3xl font-bold">ALL GUESTS</h2>
      <Box
        sx={{
          display: "flex",
          gap: "3rem",
          flexDirection: "column",
          marginTop: "1rem",
          height: "90%",
        }}
      >
        <form onSubmit={handleSearch}>
        <Box sx={{display:"flex", flexDirection:isSmallScreen ? "column":"row", justifyContent:"right", alignItems:"center", gap:"2rem"}}>
          <TextField
            variant="outlined"
            placeholder="Search by first name/last name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showingResults&&<IconButton onClick={handleClearShowingResults}>
                    <IconTrash />
                  </IconButton>}
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained">Find Guest</Button>
        </Box>
      </form>
        <Box sx={{ height: "500px", overflowX: 'scroll !important' }}>
        {filteredRows.length===0?<Box sx={{display:"flex", flexDirection:"column", justifyItems:"center", alignItems:"center",gap:"1rem", height:"100%"}}><img src="/images/nodata.jpg" width={isSmallScreen?"1000px":"400px"} /><p className=" text-center text-gray-800">No Guest Added Today</p><Button variant="contained" size="small" sx={{width:"max-content"}} onClick={()=>navigate("/cms/guest/new")}><IconPlus />New Guest</Button></Box>:<StripedDataGrid
            rows={filteredRows}
            columns={columns}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 12,
                },
              },
            }}
            components={{ Toolbar: CustomToolbar }}
          />}
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
          <DialogTitle>
              Edit Guest Details
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              margin="dense"
              label="First Name"
              sx={{width:"500px"}}
              value={currentRow?.first_name || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, first_name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              sx={{width:"500px"}}
              value={currentRow?.last_name || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, last_name: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Gender"
              type="text"
              sx={{width:"500px"}}
              value={currentRow?.gender || ""}
              onChange={(e) =>
                setCurrentRow({
                  ...currentRow,
                  gender: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Mobile Number"
              sx={{width:"500px"}}
              value={currentRow?.mobile || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, mobile: e.target.value })
              }
            />
            <Divider />
            <h2 className="font-bold">Emergency Contact</h2>
            <TextField
              name="emergency_name"
              label="Name"
              sx={{width:"500px"}}
              value={currentRow?.emergency_name || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, emergency_name: e.target.value })
              }
            />
            <TextField
              name="emergency_tel"
              type="tel"
              sx={{width:"500px"}}
              label="Mobile"
              value={currentRow?.emergency_tel || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, emergency_tel: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <CustomLoadingButton
              isLoading={isLoading}
              variant="contained"
              onClick={handleSave}
            >
              {isLoading ? "...Saving" : "Update"}
            </CustomLoadingButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Guest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this guest? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="warning">
              {isDeleting ? "...Deleting":"Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AllGuests;
