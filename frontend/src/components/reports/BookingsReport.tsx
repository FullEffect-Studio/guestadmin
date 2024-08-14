import { Box, Card, CardActions, CardContent, CardHeader } from '@mui/material'
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
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { APIContext } from "../../Contexts";
import { IconPlus, IconPrinter, IconTrash } from "@tabler/icons-react";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { alpha, styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";


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


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface Row {
  id: number;
  guest_name: string;
  room_number: string;
  total_amount: string;
  date_checked_in: Date | any;
  date_checked_out: Date | any;
  booking_status: string;
  created_at: Date | any;
  room_type: string;
  room_price_per_night: string;
  guest_id: number;
  guest_mobile: string;
  guest_email: string;
  booked_by: string; 
}

const styles = StyleSheet.create({
  page: {fontSize: 11,paddingTop: 20,paddingLeft: 40,paddingRight: 40,lineHeight: 1.5,flexDirection: 'column' },

  spaceBetween : {flex : 1,flexDirection: 'row',alignItems:'center',justifyContent:'space-between',color: "#3E3E3E" },

  titleContainer: {flexDirection: 'row',marginTop: 24},
  
  logo: { width: 90 },

  reportTitle: {  fontSize: 16,  textAlign: 'center' },

  addressTitle : {fontSize: 11,fontStyle: 'bold'}, 
  
  invoice : {fontWeight: 'bold',fontSize: 20},
  
  invoiceNumber : {fontSize: 11,fontWeight: 'bold'}, 
  
  address : { fontWeight: 400, fontSize: 10},
  
  theader : {marginTop : 20,fontSize : 10,fontStyle: 'bold',paddingTop: 4 ,paddingLeft: 7 ,flex:1,height:20,backgroundColor : '#DEDEDE',borderColor : 'whitesmoke',borderRightWidth:1,borderBottomWidth:1},

  theader2 : { flex:2, borderRightWidth:0, borderBottomWidth:1},

  tbody:{ fontSize : 9, paddingTop: 4 , paddingLeft: 7 , flex:1, borderColor : 'whitesmoke', borderRightWidth:1, borderBottomWidth:1},

  total:{ fontSize : 9, paddingTop: 4 , paddingLeft: 7 , flex:1.5, borderColor : 'whitesmoke', borderBottomWidth:1},

  tbody2:{ flex:2, borderRightWidth:1, }
  
});

const InvoiceTitle = () =>{
  return (
    <View style={styles.titleContainer}>
                <View style={styles.spaceBetween}>
                    <Image style={styles.logo} src="/logo.png" />
                    <Text style={styles.reportTitle}>AC Guest House</Text>
                </View>
    </View>
  )
}

const Address: React.FC<{row:Row}> = ({row}) => {
  const thisYear = new Date()
  return (
    <View style={styles.titleContainer}>
                <View style={styles.spaceBetween}>
                    <View>
                        <Text style={styles.invoice}>Invoice </Text>
                        <Text style={styles.invoiceNumber}>{`Invoice number:F${thisYear.getFullYear()}00${row.id}`}</Text>
                    </View>
                    <View>
                        <Text style={styles.addressTitle}>Opposite ColinMay Hotel</Text>
                        <Text style={styles.addressTitle}>Broadcasting</Text>
                        <Text style={styles.addressTitle}>Ejura-Ashanti Region.</Text>
                        <Text style={styles.addressTitle}>Ghana.</Text>
                    </View>
                </View>
            </View>
  )
}

const UserAddress:React.FC<{row:Row}> = ({row}) => {
  return (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View style={{maxWidth : 200}}>
                <Text style={styles.addressTitle}>GUEST INFORMATION </Text>
                <Text style={styles.address}>
                    {`ID: Guest ${row.guest_id}`}
                </Text>
                <Text style={styles.address}>
                    {`Name: ${row.guest_name}`}
                </Text>
                <Text style={styles.address}>
                    {`Email: ${row.guest_email}`}
                </Text>
                <Text style={styles.address}>
                    {`Phone: ${row.guest_mobile}`}
                </Text>
            </View>
            <Text style={styles.addressTitle}>{row.created_at}</Text>
        </View>
    </View>
  )
}

const TableHead = () =>{
  return (
      <View style={{ width:'100%', flexDirection :'row', marginTop:10}}>
          <View style={[styles.theader, styles.theader2]}>
              <Text >Room Num</Text>   
          </View>
          <View style={styles.theader}>
              <Text>Room Type</Text>   
          </View>
          <View style={styles.theader}>
              <Text>Price per Night</Text>   
          </View>
          <View style={styles.theader}>
              <Text>Check-in date</Text>   
          </View>
          <View style={styles.theader}>
              <Text>Check-out date</Text>   
          </View>
          <View style={styles.theader}>
              <Text style={{fontWeight:"bold"}}>Total</Text>   
          </View>
      </View>
  );
}

const TBody: React.FC<{ row: Row }> = ({ row }) => {
  // Format date values to ensure they're properly displayed as strings
  const formattedCheckInDate = new Date(row.date_checked_in).toLocaleDateString();
  const formattedCheckOutDate = new Date(row.date_checked_out).toLocaleDateString();

  return (
    <React.Fragment>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={[styles.tbody, styles.tbody2]}>
          <Text>{row.room_number}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{row.room_type}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{row.room_price_per_night}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{formattedCheckInDate}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{formattedCheckOutDate}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{row.total_amount}</Text>
        </View>
      </View>
    </React.Fragment>
  );
}

const Invoice: React.FC<{ row: Row | null }> = ({ row }) => {
  if (!row) return null; // Handle null case if necessary
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address row={row} />
        <UserAddress row={row} />
        <TableHead />
        <TBody row={row} />
      </Page>
    </Document>
  );
};

const BookingsReport = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<Row | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState<boolean>(false);
  const [showingResults, setShowingResults] = React.useState<boolean>(false)
  const [showingCustomRangeFilter, setShowingCustomRangeFilter] = React.useState<boolean>(false)

  // Filter states management
  const [activeReport, setActiveReport] = React.useState("all")

  const handleSelectAllReport = () =>{
    fetchRows()
  }

  const handleSelectTodayReport = () =>{
    fetchTodayDataRow()
  }

  const handleSelectYesterday = () =>{
    fetchYesterdayDataRow()
  }
  const handleSelectLastWeekReport = () =>{
    fetchLastWeekDataRow()
  }
  const handleSelectLastMonthReport = () =>{
    fetchLastMonthDataRow()
  }
  const handleSelectLastYearReport = () =>{
    fetchLastYearDataRow()
  }

  const handleUseCustomDataRow = () =>{
    fetchCustomedRangeDataRow()
  }


  const navigate = useNavigate();
  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("Context is undefined");
  }

  const { paymentDetails, setPaymentDetails } = context;

  React.useEffect(() => {
    // fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookings/no-filter/",  {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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

  const fetchTodayDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?date_filter=today",  {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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
  const fetchYesterdayDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?date_filter=yesterday",  {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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
  const fetchLastWeekDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?date_filter=last_week",  {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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
  const fetchLastMonthDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?date_filter=last_month");
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
  const fetchLastYearDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?date_filter=last_year",  {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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
  const fetchCustomedRangeDataRow = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true});
      const response = await axios.get(`https://guestmanagerapi.onrender.com/api/reports/bookingsReport/?start_date=${formData.start_date}&end_date=${formData.end_date}`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
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
  
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const { data } = await axios.get(
        `https://guestmanagerapi.onrender.com/api/bookings/search/${searchText}`, {headers:{"Authorization": `Bearer ${localStorage.getItem("access_token")}`}}
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

  const handleClearShowingResults = ()=>{
    fetchRows();
    setShowingResults(false);
    setSearchText("")
  }


  const handleAdd = () => {
    alert(paymentDetails.reference);
  };

  const handleEdit = (params: any) => {
    setCurrentRow(params.row);
    setOpenDialog(true);
  };

  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);



  const handleDelete = (id: GridRowId) => {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      toast.error("Invalid booking ID");
      return;
    }
    setSelectedRowId(numericId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedRowId === null) return;

    setIsDeleting(true);
    try {
      await axios.delete(`https://guestmanagerapi.onrender.com/api/bookings/${selectedRowId}`, {headers:{'Authorization':`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(rows.filter(row => row.id !== selectedRowId));
      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error("Failed to delete booking");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      fetchRows()
    }
  };

  const handleSave = async () => {
    if (!currentRow) return;
    try {
      if ((currentRow.id || 0) > rows.length) {
        await axios.post("https://api.example.com/data", currentRow);
      } else {
        await axios.put(`https://api.example.com/data/${currentRow.id}`, currentRow);
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

  const handlePrint = (row: Row) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "id", width: 120 },
    { field: "guest_name", headerName: "Guest Name", width: 150 },
    { field: "room_number", headerName: "Room Number", width: 150 },
    { field: "room_type", headerName: "Room Type", width: 150 },
    { field: "room_price_per_night", headerName: "Room Price/Night", width: 150 },
    { field: "date_checked_in", headerName: "Check In Date", width: 130, type: "date" },
    { field: "date_checked_out", headerName: "Check Out Date", width: 130, type: "date" },
    { field: "total_amount", headerName: "Amount to Pay", width: 150 },
    { field: "booking_status", headerName: "Booking Status", width: 100 },
    { field: "booked_by", headerName: "Booked By", width: 200 },
    { field: "created_at", headerName: "Booking Date", width: 100 },
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
          onClick={() => {setOpenDeleteDialog(true); handleDelete(params.id)}}
        />,
        <GridActionsCellItem
          icon={<IconPrinter />}
          label="Invoice"
          onClick={() => handlePrint(params.row)}
        />,
      ],
    },
  ];

  const initialState = {start_date: new Date(), end_date: new Date()}
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false)
  const [continueWithDeletion, setContinueWithDeletion] = React.useState<boolean>(false)
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)
  const [formData, setFormData] = React.useState(initialState)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof typeof initialState) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));
  };
  const isSmallScreen = useMediaQuery("(max-width:1023px)")
  return (
    <Box>
      <Card sx={{width:"100%"}}>
        <CardActions>
          <h2>Bookings Report</h2>
        </CardActions>
        <CardActions sx={{display:"flex", justifyContent:"end", width:"100%", flexDirection:isSmallScreen ? "column":"row"}}>
          <Box sx={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:isSmallScreen?"1rem":"12px"}}>
            <label style={{display:"flex", justifyContent:isSmallScreen?"end":""}} htmlFor="">Advance Filter:</label>
            <FormControl sx={{width:isSmallScreen?"100%":"15rem"}}>
                    {/* <InputLabel id="demo-simple-select-label">Filter</InputLabel> */}
                      <Select
                      // label="Filter"
                      size="small"
                      defaultValue={10}
                      disabled = {showingCustomRangeFilter}
                      sx={{width:isSmallScreen ? "80vw":"100%"}}
                        >
                        <MenuItem value={10} onClick={handleSelectAllReport}>All Time</MenuItem>
                        <MenuItem value={150} onClick={handleSelectTodayReport}>Today</MenuItem>
                        <MenuItem value={20} onClick={handleSelectYesterday}>Yesterday</MenuItem>
                        <MenuItem value={30} onClick={handleSelectLastWeekReport}>Last Week</MenuItem>
                        <MenuItem value={40} onClick={handleSelectLastYearReport}>Last Year</MenuItem>
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
                      <Button variant='contained' className=' bg-blue-700' sx={{width:isSmallScreen?"80vw":"max-content"}} onClick={handleUseCustomDataRow}>Get Report</Button>
                      <Button variant='contained' onClick={()=>setShowingCustomRangeFilter(false)} className=' bg-red-700' sx={{width:isSmallScreen?"80vw":"max-content", backgroundColor:"rgb(185, 28, 28)"}}>Reset Filters</Button>
                  </Box>
                </Box>}
        </CardActions>
        <CardContent>
        {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
      {/* <Typography className=" text-center " component={"h2"}>ALL BOOKINGS</Typography> */}
      <Box sx={{ display: "flex", gap: "3rem", flexDirection: "column", marginTop: "1rem", height: "80%" }}>
        {filteredRows.length===0?<Box sx={{display:"flex", flexDirection:"column", justifyItems:"center", alignItems:"center",gap:"1rem", height:"100%"}}><img loading='lazy' src="/images/nodata.jpg" width={isSmallScreen?"1000px":"500px"} /><p className=" text-center text-gray-800">No Bookings Made Today</p><Button variant="contained" size="small" sx={{width:"max-content"}} onClick={()=>navigate("/cms/booking/new")}><IconPlus />New Booking</Button></Box>:<Box sx={{height:"500px"}}><StripedDataGrid
          rows={filteredRows}
          loading={isLoading}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          components={{ Toolbar: CustomToolbar }}
        /></Box>}

<Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setOpenDeleteDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Delete Booking"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setOpenDeleteDialog(false)}>No please, cancel!</Button>
          <Button
            onClick={confirmDelete}
            style={{ backgroundColor: "red", color: "white" }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, continue!"}
          </Button>
        </DialogActions>
      </Dialog>

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
              disabled
              value={currentRow?.guest_name || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, guest_name: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Room Number"
              type="text"
              disabled
              fullWidth
              value={currentRow?.room_number || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, room_number: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Booking Amount"
              type=""
              disabled
              fullWidth
              value={currentRow?.total_amount || ""}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, total_amount: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Date Checked In"
              type="date"
              fullWidth
              value={currentRow?.date_checked_in || null}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentRow({ ...currentRow, date_checked_in: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Date Checked Out"
              type="date"
              fullWidth
              value={currentRow?.date_checked_out || null}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentRow({ ...currentRow, date_checked_out: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl>
              <InputLabel id="booking-status-label">Booking Status</InputLabel>
              <Select
                labelId="booking-status-label"
                id="booking-status-select"
                value={currentRow?.booking_status || ""}
                onChange={(event: SelectChangeEvent<string>) => setCurrentRow({ ...currentRow, booking_status: event.target.value })}
                label="Booking Status"
              >
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Checked Out">Checked Out</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Booking"
              type="date"
              fullWidth
              value={currentRow?.created_at || null}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentRow({ ...currentRow, created_at: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Download</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to download the invoice?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            {selectedRow && (
              <PDFDownloadLink
              document={<Invoice row={selectedRow} />}
              fileName="invoice.pdf"
              style={{ textDecoration: 'none', color: 'blue' }}
              onClick={() => setConfirmOpen(false)}
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Preparing document...' : 'Download'
              }
            </PDFDownloadLink>
            )}
          </DialogActions>
        </Dialog>
      </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default BookingsReport