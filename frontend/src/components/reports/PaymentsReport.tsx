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
  InputAdornment,
  IconButton,
  Card,
  MenuItem,
  Select,
  FormControl,
  CardActions,
  Backdrop,
  CircularProgress,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; 
import {toast} from "react-toastify"
import { APIContext } from "../../Contexts";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Row {
  id: number;
  guest_name: string;
  guest_has_paid?: string;
  booking_amount: Number | any;
  payment_reference?: string;
  payment_status: string;
  payment_date: string;
}

const PaymentsReport = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);
  const [fetching, setFetching] = React.useState<boolean>(false)
  const [showingResults, setShowingResults] = React.useState<boolean>(false)
  const [showingCustomRangeFilter, setShowingCustomRangeFilter] = React.useState<boolean>(false)


  const handleFetchAllTimeData = () =>{
    fetchRows()
  }

  const handleFetchTodayRow = () =>{
    fetchTodayRow()
  }

  const handleYesterdayRow = () => {
    fetchYesterdayRow()
  }

  const handleLastWeekRow = () => {
    fetchLastWeekRow()
  }

  const fetchLastWeekRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading: true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/paymentsReport/?date_filter=last_week", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(response.data);
      console.log("payment data =", response.data)
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      console.error("Error fetching data:", error);
      toast.error("Error Fetching data", {position:"bottom-center"})
    }
  };

  const fetchYesterdayRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading: true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/paymentsReport/?date_filter=yesterday", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(response.data);
      console.log("payment data =", response.data)
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      console.error("Error fetching data:", error);
      toast.error("Error Fetching data", {position:"bottom-center"})
    }
  };

  const fetchTodayRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading: true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/paymentsReport/?date_filter=today", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(response.data);
      console.log("payment data =", response.data)
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      console.error("Error fetching data:", error);
      toast.error("Error Fetching data", {position:"bottom-center"})
    }
  };

  const fetchRows = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading: true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/payment/no-filter/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(response.data);
      console.log("payment data =", response.data)
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      console.error("Error fetching data:", error);
      toast.error("Error Fetching data", {position:"bottom-center"})
    }
  };

  const handleFetchLastYearData = () => {
    fetchLastYearData()
  }

  const fetchLastYearData =async () => {
    try{
      setPaymentDetails({...paymentDetails, globalLoading: true})
      const {data} = await axios.get(`https://guestmanagerapi.onrender.com/api/reports/paymentsReport/?date_filter=last_year`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      setRows(data)
      setFilteredRows(data);
      setPaymentDetails({...paymentDetails, globalLoading: false})
    }catch(error){
      setPaymentDetails({...paymentDetails, globalLoading: false})
    }
  }

  const handleFormSubmit =async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get(`https://guestmanagerapi.onrender.com/api/reports/paymentsReport/?start_date=${formData.start_date}&end_date=${formData.end_date}`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      const formattedRows = response.data.map((row: any) => {
        return {
          ...row,
          date_checked_in: new Date(row.date_checked_in),
          date_checked_out: new Date(row.date_checked_out),
        };
      });
      setRows(formattedRows);
      setFilteredRows(formattedRows);
      setPaymentDetails({...paymentDetails, globalLoading:false});
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error Fetching Data");
      console.error("Error fetching data", error);
    }
  };

  const handleClearShowingResults = ()=>{
    fetchRows();
    setShowingResults(false);
    setSearchText("")
  }

  

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const { data } = await axios.get(
        `https://guestmanagerapi.onrender.com/api/bookings/search/${searchText}`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}
      );
      const formattedRows = data.map((row: any) => {
        return {
          ...row,
          date_checked_in: new Date(row.date_checked_in),
          date_checked_out: new Date(row.date_checked_out),
        };
      });
      setFilteredRows(formattedRows);
      setShowingResults(true)
      setPaymentDetails({...paymentDetails, globalLoading:false})
    } catch (error) {
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("No data found", { position: "bottom-center" });
      fetchRows();
    }
  };

  const handleAdd = () => {
    console.log("lastUsedChannel =",localStorage.getItem("lastUsedChannel"))
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
    { field: "guess_name", headerName: "Guest Name", width: 250 },
    { field: "guess_has_paid", headerName: "Guest Has Paid?", width: 250 },
    { field: "booking_amount", headerName: "Total Amount", width: 250 },
    { field: "accountant", headerName: "Accountant", width:250 },
    { field: "payment_date", headerName: "Payment Date", width:250 },
    { field: "payment_status", headerName: "Payment Status", width: 250 },
    { field: "payment_method", headerName: "Payment Method", width: 250 },
    { field: "payment_verified", headerName: "Payment Verified", width: 250, },
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
  const initialState = {start_date: new Date(), end_date: new Date()}
  const [formData, setFormData] = React.useState(initialState)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof typeof initialState) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));
  };

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("An error ocurred")
  }
  const {paymentDetails, setPaymentDetails} = context
  const isSmallScreen = useMediaQuery("(max-width:1023px)")
  const navigate = useNavigate()

  return (
    <Box>
      {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
      <Card>
          <h1 className=" text-center mt-[2rem]">PAYMENT REPORT</h1>
          <CardActions  sx={{width:"90%", margin:"auto"}}>
        </CardActions>
        <CardActions sx={{display:"flex", justifyContent:"end", width:"90%",margin:"auto", flexDirection:isSmallScreen ? "column":"row"}}>
          <Box sx={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:isSmallScreen?"1rem":"12px"}}>
            <label style={{display:"flex", justifyContent:isSmallScreen?"end":""}} htmlFor="">Advance Filter:</label>
            <FormControl sx={{width:isSmallScreen?"100%":"15rem"}}>
                    {/* <InputLabel id="demo-simple-select-label">Filter</InputLabel> */}
                      <Select
                      // label="Filter"
                      size="small"
                      defaultValue={10}
                      sx={{width:isSmallScreen ? "80vw":"100%"}}
                        >
                        <MenuItem value={10} onClick={handleFetchAllTimeData}>All Time</MenuItem>
                        <MenuItem value={150} onClick={handleFetchTodayRow} >Today</MenuItem>
                        <MenuItem value={20} onClick={handleYesterdayRow}>Yesterday</MenuItem>
                        <MenuItem value={30} onClick={handleLastWeekRow}>Last Week</MenuItem>
                        <MenuItem value={40} onClick={handleFetchLastYearData}>Last Year</MenuItem>
                        <MenuItem value={40} onClick={()=>setShowingCustomRangeFilter(true)}>Custom</MenuItem>
                      </Select>
                    </FormControl>
          </Box>
                {showingCustomRangeFilter&&<Box sx={{display:"flex", justifyContent:"end", gap:isSmallScreen?"2rem":"1rem", alignItems:"center", flexDirection:isSmallScreen ? "column":"row"}}>
                  <Box sx={{display:"flex", flexDirection:"column", gap:"12px", width:isSmallScreen ? "80vw":"100%"}}>
                  <label style={{display:"flex", justifyContent:isSmallScreen?"end":""}} htmlFor="">Start Date</label>
                  <TextField size='small' type='date' value={formData.start_date} onChange={(e)=>handleDateChange(e, "start_date")} />
                  </Box>
                  <Box sx={{display:"flex", flexDirection:"column", gap:"12px", width:isSmallScreen ? "80vw":"100%"}}>
                  <label style={{display:"flex", justifyContent:isSmallScreen?"end":""}} htmlFor="">End Date:</label>
                  <TextField size='small' type='date' value={formData.end_date} onChange={(e)=>{handleDateChange(e, "end_date")}} />
                  </Box>
                  <Box sx={{display: "flex", flexDirection:isSmallScreen ?"column":"row",gap:"1rem", paddingTop:"2rem"}}>
                      <Button variant='contained' className=' bg-blue-700' sx={{width:isSmallScreen?"80vw":"max-content"}} onClick={handleFormSubmit}>Get Report</Button>
                      <Button variant='contained'  className=' bg-red-700' sx={{width:isSmallScreen?"80vw":"max-content", backgroundColor:"rgb(185, 28, 28)"}} onClick={()=>setShowingCustomRangeFilter(false)}>Reset Filters</Button>
                  </Box>
                </Box>}
        </CardActions>
        <CardContent sx={{  display: "flex",width:"90%",margin:"auto", gap:"3rem",flexDirection:"column", marginTop:"1rem", height:"80%", marginBottom:"3rem" }}>
          {filteredRows.length===0?<Box sx={{display:"flex", flexDirection:"column", justifyItems:"center", alignItems:"center",gap:"1rem", height:"100%"}}><img src="/images/nodata.jpg" width={isSmallScreen?"1000px":"400px"} /><p className=" text-center text-gray-800">No Payment Made Today</p><Button variant="contained" size="small" sx={{width:"max-content"}} onClick={()=>navigate("/cms/payment/new")}><IconPlus />New Payment</Button></Box>:<Box sx={{height:"500px"}}><DataGrid
            loading = {fetching}
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}

            sx={{height:"90%"}}
            components={{ Toolbar: CustomToolbar }}
          /></Box>}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              {currentRow?.id && currentRow.id > rows.length
                ? "Add a Guest Room Reservation"
                : "Edit Guest Room Reservation"}
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Guest Name"
                fullWidth
                value={currentRow?.guest_name || ""}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, guest_name: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Has Paid?"
                type="date"
                fullWidth
                value={currentRow?.guest_has_paid || ""}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, guest_has_paid: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Total Amount"
                fullWidth
                type="number"
                value={currentRow?.booking_amount || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentRow({ ...currentRow, booking_amount: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                disabled
                value={currentRow?.payment_reference || ""}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, payment_reference: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Payment Status"
                fullWidth
                value={currentRow?.payment_status || ""}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, payment_status: e.target.value })
                }
              />
            
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </CardContent>

      </Card>
    </Box>
  );
};

export default PaymentsReport;
