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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CustomLoadingButton from "../Utils/CustomLoadingButton";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";
import { APIContext } from "../../Contexts";

interface Row {
  id: number,
  room_number: number | string;
  room_type: string;
  price_per_night: number | string;
  room_status: string;
  description: string;
}

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const AllRooms = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [SearchResult, setSearchResult] = React.useState<[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const isSmallScreen = useMediaQuery("(max-width:1023px)")
  const [fetchingRows, setFetchingRows] = React.useState<boolean>(false)
  React.useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/rooms/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(response.data);
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    } catch (error:any) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error fetching data");
    }
  };
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    try{
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const {data} = await axios.get(`https://guestmanagerapi.onrender.com/api/rooms/search/${searchText}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      console.log(data)
      setFilteredRows(data)
      setPaymentDetails({...paymentDetails, globalLoading:false})      
    }catch(error){
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error fetching data", {position:"bottom-center"})
      fetchRows()
    }
  };



  const handleEdit = (params: any) => {
    setCurrentRow(params.row);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await axios.delete(`https://guestmanagerapi.onrender.com/api/rooms/delete/${id}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      toast.success("Room Deleted Successfully!", {position:"bottom-center"})
      fetchRows();
    } catch (error) {
      toast.error("You don't have permission to this room", {position:"bottom-center"});
    }
  };

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("Context not found")
  }
  const {paymentDetails, setPaymentDetails} = context;
  const handleSave = async () => {
   try{
    if(currentRow?.id){
      setIsLoading(true)
        await axios.put(
          `https://guestmanagerapi.onrender.com/api/rooms/edit/${currentRow.id}/`,
          currentRow, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
        );

        setIsLoading(false)
        toast.success("Edited successfully", {position:"bottom-center"})
        setOpenDialog(false);
        fetchRows();
    }
   }catch(error){
    setIsLoading(false)
    toast.error("An error occured!")
   }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button onClick={()=>navigate("/cms/room/new")} startIcon={<AddIcon />}>
          Add
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  const columns: GridColDef[] = [
    { field: "room_number", headerName: "Room No.", width: 100 },
    { field: "room_type", headerName: "Type of Room", width: 200 },
    { field: "price_per_night", headerName: "Price/Night (GHC)", width: 150 },
    { field: "room_status", headerName: "Room Status", width: 200 },
    { field: "description", headerName: "Room Description", width: 200},
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
    <Box sx={{height: "100%", width: "100%", backgroundColor:"white", padding:"1rem", marginTop:"1rem"}}>
      {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
      <Typography className=" text-center " component={"h2"}>ALL ROOMS</Typography>
    <Box sx={{  display: "flex", gap:"3rem",flexDirection:"column", marginTop:"1rem", height:"90%" }}>
      <form onSubmit={handleSearch}>
        <Box sx={{display:"flex", flexDirection:isSmallScreen ? "column":"row", justifyContent:"right", alignItems:"center", gap:"2rem"}}>
          <TextField
            variant="outlined"
            placeholder="Search by room availability, status or price"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
          />
          <Button type="submit" variant="contained">Find Room</Button>
        </Box>
      </form>
      <Box>
        <StripedDataGrid
          rows={filteredRows}
          loading = {fetchingRows}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}

          sx={{minHeight:"90vh"}}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Edit  Room 
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Room Number"
            fullWidth
            value={currentRow?.room_number || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, room_number: e.target.value })
            }
          />
          <FormControl fullWidth>
          <InputLabel id="room-type-label">Room Type</InputLabel>
          <Select
            labelId="room-type-label"
            id="room-type-select"
            label="Room Type"
            value={currentRow?.room_type || ""}
            name="room_type"
            onChange={(e) =>
              setCurrentRow({ ...currentRow, room_type: e.target.value })
            }
            
          >
            <MenuItem value="Double-sized">Double-sized</MenuItem>
            <MenuItem value="Queen-sized">Queen-sized</MenuItem>
          </Select>
        </FormControl>
          <TextField
            margin="dense"
            label="Price per night"
            type="text"
            fullWidth
            value={currentRow?.price_per_night || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, price_per_night: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
          <InputLabel id="room-status-label">Room Status</InputLabel>
          <Select
            labelId="room-status-label"
            id="room-status-select"
            label="Room Status"
            value={currentRow?.room_status || ""}
            name="room_type"
            onChange={(e) =>
              setCurrentRow({ ...currentRow, room_status: e.target.value })
            }
            
          >
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
          </Select>
        </FormControl>
          <TextField
            margin="dense"
            label="Mobile Number"
            fullWidth
            value={currentRow?.description || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <CustomLoadingButton isLoading={isLoading} variant="contained" onClick={handleSave}>Save</CustomLoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
};

export default AllRooms;
