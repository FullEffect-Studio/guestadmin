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
  DialogTitle,
  Typography,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
  Slide,
  DialogContentText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; 
import {toast} from "react-toastify"
import { APIContext } from "../../Contexts";
import { IconPlus, IconPrinter, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TransitionProps } from "@mui/material/transitions";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";



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
                    <Text style={styles.reportTitle}>ChloeCaled Guest house</Text>
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
                        <Text style={styles.addressTitle}>Opposite Donaso Park</Text>
                        <Text style={styles.addressTitle}>Donaso</Text>
                        <Text style={styles.addressTitle}>Ejisu-Ashanti</Text>
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
                    {`ID: Guest `}
                </Text>
                <Text style={styles.address}>
                    {`Name: `}
                </Text>
                <Text style={styles.address}>
                    {`Phone: `}
                </Text>
            </View>
            <Text style={styles.addressTitle}>grrrr</Text>
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

  return (
    <React.Fragment>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={[styles.tbody, styles.tbody2]}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text></Text>
        </View>
      </View>
    </React.Fragment>
  );
}

const stylesss = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  bold: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Invoice: React.FC<{ row: Row | null }> = ({ row }) => {
  if (!row) return null; // Handle null case if necessary
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <InvoiceTitle />
        <Address row={row} />
        <UserAddress row={row} />
        <TableHead />
        <TBody row={row} />
      </Page>
    </Document>
  );
};

const receiptData = {
  id: '123456',
  date: '2024-08-01',
  amount: 100.00,
  paymentMethod: 'Credit Card',
  customerName: 'John Doe',
  description: 'Payment for Invoice #7890',
};

interface Receipt{
  id: string;
  date: string | Date;
  amount: number;
  paymentMethod: string;
  customerName: string;
  description: string
}

const Receipt = () => (
  <Document>
    <Page size="A6" style={stylesss.page}>
      <View style={stylesss.section}>
        <Text style={stylesss.title}>Payment Receipt</Text>
      </View>
      <View style={stylesss.section}>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Receipt ID:</Text>
          <Text style={stylesss.text}>{receiptData.id}</Text>
        </View>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Date:</Text>
          <Text style={stylesss.text}>{receiptData.date}</Text>
        </View>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Amount:</Text>
          <Text style={stylesss.text}>GH¢{receiptData.amount.toFixed(2)}</Text>
        </View>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Payment Method:</Text>
          <Text style={stylesss.text}>{receiptData.paymentMethod}</Text>
        </View>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Customer Name:</Text>
          <Text style={stylesss.text}>{receiptData.customerName}</Text>
        </View>
        <View style={stylesss.container}>
          <Text style={stylesss.bold}>Description:</Text>
          <Text style={stylesss.text}>{receiptData.description}</Text>
        </View>
      </View>
    </Page>
  </Document>)


interface Row {
  id: number;
  guess_name: string;
  guess_has_paid?: string;
  booking_amount: Number | any;
  payment_reference?: string;
  payment_status: string;
  payment_date: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AllPayments = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Partial<Row> | null>(null);
  const [fetching, setFetching] = React.useState<boolean>(false)
  const [showingResults, setShowingResults] = React.useState<boolean>(false)
  const [selectedRowID, setSelectedRowID] = React.useState<number | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false)
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<Row | null>(null);

  const handleItemDelete = (id: GridRowId) => {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      toast.error("Invalid booking ID");
      return;
    }
    setSelectedRowID(numericId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedRowID === null) return;

    setIsDeleting(true);
    try {
      await axios.delete(`https://guestmanagerapi.onrender.com/api/payment/${selectedRowID}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      setRows(rows.filter(row => row.id !== selectedRowID));
      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error("Failed to delete booking");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      fetchRows()
    }
  };

  React.useEffect(() => {
    fetchRows();
    
  }, []);

  
  const fetchRows = async () => {
    try {
      setPaymentDetails({...paymentDetails, globalLoading:true})
      const response = await axios.get("https://guestmanagerapi.onrender.com/api/payment/list/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
      localStorage.setItem("userwise_tot_revenue", ``)
      setRows(response.data);
      console.log("payment data =", response.data)
      setFilteredRows(response.data);
      setPaymentDetails({...paymentDetails, globalLoading:false})
    } catch (error) {
      console.error("Error fetching data:", error);
      setPaymentDetails({...paymentDetails, globalLoading:false})
      toast.error("Error Fetching data", {position:"bottom-center"})
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

  const handlePrint = (row: Row) => {
    setSelectedRow(row);
    setConfirmOpen(true);
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
    { field: "id", headerName: "#", width: 50 },
    { field: "guess_name", headerName: "Guest Name", width: 250 },
    { field: "guest_has_fully_paid", headerName: "Fully Paid?", width: 250 },
    { field: "booking_amount", headerName: "Total Amount", width: 250 },
    { field: "_intial_payment", headerName: "Initial Payment", width:250 },
    { field: "payment_balance", headerName: "Initial Payment Balance", width:250 },
    { field: "payment_date", headerName: "Initial Payment Date", width:250 },
    { field: "_final_payment", headerName: "Final Payment", width:250 },
    { field: "date_updated", headerName: "Final Payment Date", width:250 },
    { field: "payment_status", headerName: "Payment Status", width: 250 },
    { field: "payment_method", headerName: "Payment Method", width: 250 },
    // { field: "payment_verified", headerName: "Payment Verified", width: 250, },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<IconPrinter />}
          label="Print"
          onClick={() => handlePrint(params.row)}
        />, 
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params)}
        />, 
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {handleItemDelete(params.id); setOpenDeleteDialog(true)}}
        />,
      ],
    },
  ];

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("An error ocurred")
  }
  const {paymentDetails, setPaymentDetails} = context
  const isSmallScreen = useMediaQuery("(max-width:1023px)")
  const navigate = useNavigate()
  return (
    <Box sx={{height: "100%", width: "100%", backgroundColor:"white", padding:"1rem",}}>
      <Typography className=" text-center " component={"h2"}>ALL PAYMENTS</Typography>
    <Box sx={{  display: "flex", gap:"3rem",flexDirection:"column", marginTop:"1rem", height:"80%" }}>
    <form onSubmit={handleSearch}>
        <Box sx={{display:"flex", flexDirection:isSmallScreen ? "column":"row", justifyContent:"right", alignItems:"center", gap:"2rem"}}>
          <TextField
            variant="outlined"
            placeholder="Search by Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            disabled={filteredRows.length ===0}
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
          <Button type="submit" variant="contained" disabled={filteredRows.length ===0}>Find Payment</Button>
        </Box>
      </form>
      {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
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

        components={{ Toolbar: CustomToolbar }}
      /></Box>}

<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Download</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to download the invoice?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            {selectedRow && (
              <PDFDownloadLink
              document={<Receipt />}
              fileName="receipt.pdf"
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

<Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setOpenDeleteDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this Payment?
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
          Edit Payment
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Guest Name"
            fullWidth
            value={currentRow?.guess_name || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, guess_name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Has Paid?"
            fullWidth
            value={currentRow?.guess_has_paid || ""}
            onChange={(e) =>
              setCurrentRow({ ...currentRow, guess_has_paid: e.target.value })
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
    </Box>
    </Box>
  );
};

export default AllPayments;
