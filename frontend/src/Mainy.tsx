import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Backdrop, Badge, CircularProgress, Collapse, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import { IconDashboard, IconUser, IconHomeDollar, IconMinus, IconPlus, IconMoneybag, IconZoomMoneyFilled, IconReportMoney, IconBook, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import useMediaQuery from "@mui/material/useMediaQuery"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DashBoard from "./components/DashBoard";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FaceIcon from '@mui/icons-material/Face';
import AllBookings from "./components/bookings/AllBookings";
import AddBooking from "./components/bookings/AddBooking";
import AllRooms from "./components/rooms/AllRooms";
import { AddRoom } from "./components/rooms/AddRoom";
import { useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import AllPayments from "./components/payments/AllPayments";
import AddPayment from "./components/payments/AddPayment";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {toast} from "react-toastify"
import AllGuests from "./components/guests/AllGuests";
import AddGuest from "./components/guests/AddGuest";
import BookingsReport from "./components/reports/BookingsReport";
import { APIContext } from "./Contexts";
import PaymentsReport from "./components/reports/PaymentsReport";
import BalancePayment from "./components/payments/BalancePayment";
import { DashboardIcon } from "./icons/HomeIconOutline";
import { CustomersIcon } from "./icons/CustomersIcon";
import { SuppliersIcon } from "./icons/SuppliersIcon";
import { FaBookmark, FaHandHoldingUsd, FaHome, FaPills } from "react-icons/fa";
import { ShoppingCartIcon } from "./icons/PurchasesIcon";
import {FaHouseUser} from 'react-icons/fa'
import {FaRedhat} from 'react-icons/fa'
import {FaChartArea} from 'react-icons/fa'
import {FaTimes} from 'react-icons/fa'


const drawerWidth = 255;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 0,
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whitegreySpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));



export default function Main() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [listOpen, setListOpen] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string | null>("dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string | null>("");
  const isSmallScreen = useMediaQuery("(max-width: 1023px)")
  const [documentTitle, setDocumentTitle] = React.useState<string>("")

  React.useEffect(()=>{
    if(documentTitle){
      document.title = documentTitle
    }
  }, [documentTitle])

  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (item: string) => {
    setListOpen((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      newState[item] = !prevState[item];
      return newState;
    });
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleSublistItemClick = (subItem:string)=>{
    setActiveSubItem(subItem)
  }

  // Handle collapse when a listItem is active
  // close all previosly opened sub lists in the collapse 



  const getItemStyle = (item: string, isSublist: boolean) => {
    if (item === activeItem) {
      return {
        backgroundColor: !isSublist ? "rgba(34, 197, 94, 1)":"",
        color: isSublist ? "white" : "white",
        "& .MuiListItemIcon-root": {
          color: isSublist ? "white" : "white",
        },
      };
    }
    return {
      color: "grey",
      "&:hover":{
        color:"white"
      }
    };
  };

  const [appStarting, setAppStarting] = useState<boolean>(false)

  React.useEffect(()=>{
    setTimeout(()=>{
      setAppStarting(false)
    }, 15000)

    if(isSmallScreen){
      setOpen(false)
    }
  }, [])


  // Account Stuffs
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const account_menu_open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("No context found")
  }

  const {paymentDetails, setPaymentDetails} = context;


  return (
    <Box>
      {/* {paymentDetails.isLoading === true&&<Loader />} */}
    <Box sx={{ display: "flex", position: "relative"}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "white", color: "black", display: "flex", boxShadow: "none", width: !isSmallScreen && open?"calc(100vw - 255px)": isSmallScreen?"100vw":"calc(100vw - 65px)", zIndex:isSmallScreen &&open?90:"" }}
      >
        <Toolbar className="flex gap-5">
          <IconButton color="inherit" aria-label="open drawer" onClick={() => {setOpen(!open);setPaymentDetails({...paymentDetails, globalOpen:!paymentDetails.globalOpen})}} edge="start">
            <MenuIcon className="text-green-600 text-9xl" />
            <img src="/images/MenuIcon.png" width={isSmallScreen?45:30} alt="" />
          </IconButton>
          <Box sx={{display:"flex", gap:"10px", justifyContent:"center", alignItems:"center", position:"absolute", right:"2vw"}}>
            <ListItemButton><Tooltip title="Notification"><Badge badgeContent={4}color="primary"><NotificationsActiveIcon sx={{fontSize:"30px"}} /></Badge></Tooltip></ListItemButton>
            <Tooltip title="Acount Settings"><ListItemButton onClick={handleClick} sx={{display:"flex", gap:"5px"}}>{localStorage.getItem("username")} <FaceIcon sx={{fontSize:"30px"}}/></ListItemButton></Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={account_menu_open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 30,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {/* ()=>{localStorage.removeItem("access_token"); navigate("/auth/login"); toast.success("Logged successfully", {position:"bottom-center"}); console.log("Logged out")}} */}
        <MenuItem onClick={()=>{localStorage.removeItem("access_token"); navigate("/auth/login");setDocumentTitle("Admin Login"); toast.success("Logged successfully", {position:"bottom-center"}); console.log("Logged out")}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {!isSmallScreen || open ?<Drawer variant="permanent" open={open} className="drawer sm:w-[100vw] lg:w-[240px] " sx={{border:"none", backgroundColor:"#343a40", position: isSmallScreen?"absolute":"", zIndex:isSmallScreen?99:"", height:"100%", overflow: 'hidden'}} onMouseEnter={()=>!open ? setOpen(true):null} >
        <Box className="bg-gray-900" style={{borderBottom:".1px solid rgb(17, 24, 39)", overflowY:'hidden'}}>
          <Box sx={{padding:"4px", width:"88%", margin:"1rem auto 3rem", position: 'relative'}}>
              {isSmallScreen && <FaTimes style={{position: 'absolute', right: '10px', color:'white', cursor:'pointer'}} onClick={()=>setOpen(false)}/>}
            <Box sx={{display:"flex", alignItems:"center", justifyContent:open?"space-between":"center", color:'white'}}>
            {!open ? <img src="/images/logo-144x144.png" style={{display:"inline-block"}} alt="image-here" width={42} /> : <Box><img src="/images/logo-144x144.png" style={{display:"inline-block"}} alt="image here" width={42} />Guest House</Box>}
            </Box>
          </Box>
        </Box>
        <Box className=" flex justify-center  bg-gray-900" sx={{height: "100%", overflowY:"scroll"}}>
        <List className="" sx={{ width:"90%", color:"white", border:"none", overflow: 'hidden', position:'relative' }}>
          <ListItem sx={{"&:hover":{color:"white"}}} disablePadding >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("dashboard", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                }
              }}
              onClick={() =>{ handleItemClick("dashboard"); navigate("/cms/"); isSmallScreen && setOpen(false)}}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
                <FaChartArea className=" text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block", '&:hover': {color: 'white'} }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("guests", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                  color: 'white'
                }
              }}
              onClick={() => {
                handleItemClick("guests");
                handleListItemClick("guests");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
                <CustomersIcon className="text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Guests" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["guests"] ? <IconChevronDown /> : <IconChevronRight />}
            </ListItemButton>
            <Collapse in={listOpen["guests"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                     pl: 4, 
                     ...getItemStyle("allGuests", true), 
                    }}
                  onClick={() => {navigate("/cms/guests"); isSmallScreen &&setOpen(false);}}
                >
                  <ListItemText primary="All Guests" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addGuest", true) }}
                  onClick={() => {navigate("/cms/guest/new"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="Add Guest" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block", '&:hover': {color: 'white'} }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("bookings", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                  color: 'white'
                }
              }}
              onClick={() => {
                handleItemClick("bookings");
                handleListItemClick("bookings");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
                <FaHouseUser className="text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Bookings" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["bookings"] ? <IconChevronDown /> : <IconChevronRight />}
            </ListItemButton>
            <Collapse in={listOpen["bookings"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allBookings", true) }}
                  onClick={() => {navigate("/cms/bookings"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="All Bookings" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addBooking", true) }}
                  onClick={() => {navigate("/cms/booking/new"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="Add Booking" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block", '&:hover': {color: 'white'} }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("rooms", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                  color: 'white'
                }
              }}
              onClick={() => {
                handleItemClick("rooms");
                handleListItemClick("rooms");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
              <FaHome className=" text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Rooms" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["rooms"] ? <IconChevronDown /> : <IconChevronRight />}
            </ListItemButton>
            <Collapse in={listOpen["rooms"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allRooms", true) }}
                  onClick={() => {navigate("/cms/rooms"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="All Rooms" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addRoom", true) }}
                  onClick={() => { navigate("/cms/room/new");isSmallScreen&&setOpen(false) }}
                >
                  <ListItemText primary="Add Room" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block", '&:hover': {color: 'white'} }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("payments", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                  color: 'white'
                }
              }}
              onClick={() => {
                handleItemClick("payments");
                handleListItemClick("payments");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
              <FaHandHoldingUsd
               className=" text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Payments" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["payments"] ? <IconChevronDown /> : <IconChevronRight />}
            </ListItemButton>
            <Collapse in={listOpen["payments"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allPayments", true) }}
                  onClick={() => {navigate("/cms/payments"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="All Payments" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addPayment", true) }}
                  onClick={() => { navigate("/cms/payment/new");isSmallScreen&&setOpen(false) }}
                >
                  <ListItemText primary="Add Payment" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("balancePayment", true) }}
                  onClick={() => { navigate("/cms/payment/edit");isSmallScreen&&setOpen(false) }}
                >
                  <ListItemText primary="Balance Payment" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block", '&:hover': {color: 'white'} }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("reports", false),
                borderRadius:".5rem",
                "&:hover":{
                  backgroundColor: "rgba(34, 197, 94,1)",
                  color: 'white'
                }
              }}
              onClick={() => {
                handleItemClick("reports");
                handleListItemClick("reports");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", color:"grey" }} onClick={handleDrawerOpen}>
              <IconBook className=" text-2xl" />
              </ListItemIcon>
              <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["reports"] ? <IconChevronDown /> : <IconChevronRight />}
            </ListItemButton>
            <Collapse in={listOpen["reports"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("bookingReport", true) }}
                  onClick={() => {navigate("/cms/reports/bookingsReport"); isSmallScreen&&setOpen(false)}}
                >
                  <ListItemText primary="Bookings Report" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("paymentReport", true) }}
                  onClick={() => { navigate("/cms/reports/paymentsReport");isSmallScreen&&setOpen(false) }}
                >
                  <ListItemText primary="Payment Report" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
        <MenuItem sx={{ display: 'flex', gap: '10px', color:'white', fontSize: '20px', position:'absolute', bottom:'2rem'}} onClick={()=>{localStorage.removeItem("access_token"); navigate("/auth/login");setDocumentTitle("Admin Login"); toast.success("Logged successfully", {position:"bottom-center"}); console.log("Logged out")}}>
          <ListItemIcon>
            <Logout className=" text-white" />
          </ListItemIcon>
          <p>Logout</p>
          </MenuItem>
        </List>
        </Box>
      </Drawer>: null}
      <Box component="main" sx={{ flexGrow: 1, p: 1, width: "100%", overflow: !isSmallScreen ? "hidden":"visible",display: "flex", alignItems: "center", flexDirection:"column", marginTop:"2rem", backgroundColor:"#f0f3fb", position:isSmallScreen && open?"absolute":"", height:"100%" }} onClick={()=>isSmallScreen && open ? setOpen(false):null}>
        <Box sx={{ width: open ? "95%" : "95%" , height: open ? "100%" : "100%", backgroundColor:'', marginTop:"2rem" }} onClick={()=>isSmallScreen && open ? setOpen(false):null} >
            <Routes>
              <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<DashBoard />} />
                <Route path="/bookings" element={<AllBookings />} />
                <Route path="/booking/new" element={<AddBooking />} />
                <Route path="/guests" element={<AllGuests />} />
                <Route path="/guest/new" element={<AddGuest />} />
                <Route path="/rooms" element={<AllRooms />} />
                <Route path="/room/new" element={<AddRoom />} />
                <Route path="/payments" element={<AllPayments />} />
                <Route path="/payment/new" element={<AddPayment />} />
                <Route path="/payment/edit" element={<BalancePayment />} />
                <Route path="/reports/bookingsReport" element={<BookingsReport />} />
                <Route path="/reports/paymentsReport" element={<PaymentsReport />} />
              </Route>
            </Routes>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}