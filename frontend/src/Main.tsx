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
import { IconDashboard, IconUser, IconHomeDollar, IconMinus, IconPlus, IconMoneybag, IconZoomMoneyFilled, IconReportMoney, IconBook } from "@tabler/icons-react";
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
const drawerWidth = 240;

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
  whiteSpace: "nowrap",
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
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 1023px)")

  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const handleListItemClick = (item: string) => {
  //   setListOpen((prev) => ({ ...prev, [item]: !prev[item] }));
  // };

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

  const getItemStyle = (item: string, isSublist: boolean) => {
    if (item === activeItem) {
      return {
        color: isSublist ? "blue" : "green",
        "& .MuiListItemIcon-root": {
          color: isSublist ? "blue" : "green",
        },
      };
    }
    return {};
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
    throw new Error("Invalid context")
  }

  const {paymentDetails, setPaymentDetails} = context;

  const [mustShowLogo, setustShowLogo] = useState<boolean>(true)

  return (
    <>
    {appStarting?<Box sx={{width:"100%", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Box sx={{height:"300px", display:"flex", flexDirection:"column", gap:"1rem"}}>
        <img src="logo.png" className=" animate-pulse h-[90px] object-contain" />
        <h1 className=" font-bold">Initializing App ...</h1>
      </Box>
    </Box>:<Box sx={{ display: "flex", position: "relative"}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "white", color: "black", display: "flex", boxShadow: "none" }}
      >
        
        <Toolbar className="flex gap-5">
            <img src="/images/logo-144x144.png" style={{display:"inline-block"}} alt="" width={32} />
          <Typography variant="h5" sx={{color:"black", display:isSmallScreen ?"none":"flex"}} noWrap component="div">
          Guest House
          </Typography>
          <IconButton color="inherit" aria-label="open drawer" onClick={() => {setOpen(!open)}} edge="start">
            <MenuIcon className="text-black" />
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
        <Divider />
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
        <MenuItem onClick={()=>{localStorage.removeItem("access_token"); navigate("/auth/login"); toast.success("Logged successfully", {position:"bottom-center"}); console.log("Logged out")}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {!isSmallScreen || open ?<Drawer variant="permanent" open={open} className="" sx={{border:"none", backgroundColor:"#343a40", position: isSmallScreen?"absolute":"", zIndex:isSmallScreen?99:"", height:"100%"}} >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("dashboard", false),
              }}
              onClick={() =>{ handleItemClick("dashboard"); navigate("/cms/");setOpen(isSmallScreen?false:true)}}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconDashboard />
              </ListItemIcon>
              <ListItemText primary="My Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("guests", false),
              }}
              onClick={() => {
                handleItemClick("guests");
                handleListItemClick("guests");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconUser />
              </ListItemIcon>
              <ListItemText primary="Guests" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["guests"] ? <IconMinus /> : <IconPlus />}
            </ListItemButton>
            <Collapse in={listOpen["guests"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allGuests", true) }}
                  onClick={() => {handleItemClick("allGuests"); navigate("/cms/guests");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="All Guests" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addGuests", true) }}
                  onClick={() => {handleItemClick("addGuests"); navigate("/cms/guest/new");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="New Guest" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("bookings", false),
              }}
              onClick={() => {
                handleItemClick("bookings");
                handleListItemClick("bookings");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconUser />
              </ListItemIcon>
              <ListItemText primary="Bookings" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["bookings"] ? <IconMinus /> : <IconPlus />}
            </ListItemButton>
            <Collapse in={listOpen["bookings"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allReservations", true) }}
                  onClick={() => {handleItemClick("allReservations"); navigate("/cms/bookings");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="All Bookings" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addReservation", true) }}
                  onClick={() => {handleItemClick("addReservation"); navigate("/cms/booking/new");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="New Booking" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("rooms", false),
              }}
              onClick={() => {
                handleItemClick("rooms");
                handleListItemClick("rooms");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconHomeDollar />
              </ListItemIcon>
              <ListItemText primary="Rooms" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["rooms"] ? <IconMinus /> : <IconPlus />}
            </ListItemButton>
            <Collapse in={listOpen["rooms"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allRooms", true) }}
                  onClick={() => {handleItemClick("allRooms"); navigate("/cms/rooms");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="All Rooms" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addRoom", true) }}
                  onClick={() => {handleItemClick("addRoom"); navigate("/cms/room/new");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Add A Room" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("payments", false),
              }}
              onClick={() => {
                handleItemClick("payments");
                handleListItemClick("payments");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconReportMoney />
              </ListItemIcon>
              <ListItemText primary="Payments" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["payments"] ? <IconMinus /> : <IconPlus />}
            </ListItemButton>
            <Collapse in={listOpen["payments"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("allpayments", true) }}
                  onClick={() => {handleItemClick("allpayments"); navigate("/cms/payments");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="All Payments" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("addPayment", true) }}
                  onClick={() => {handleItemClick("addPayment"); navigate("/cms/payment/new");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Add Payment" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("balancePayment", true) }}
                  onClick={() => {handleItemClick("balancePayment"); navigate("/cms/payment/edit");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Balance Payment" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                ...getItemStyle("reports", false),
              }}
              onClick={() => {
                handleItemClick("reports");
                handleListItemClick("reports");
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }} onClick={handleDrawerOpen}>
                <IconBook />
              </ListItemIcon>
              <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
              {listOpen["reports"] ? <IconMinus /> : <IconPlus />}
            </ListItemButton>
            <Collapse in={listOpen["reports"]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("guest-report", true) }}
                  onClick={() => {handleItemClick("guest-report"); navigate("/cms/reports/guestReport");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Guest Report" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton> */}
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("bookings-report", true) }}
                  onClick={() => {handleItemClick("bookings-report"); navigate("/cms/reports/bookingsReport");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Booking Report" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4, ...getItemStyle("payments-report", true) }}
                  onClick={() => {handleItemClick("payments-report"); navigate("/cms/reports/paymentsReport");setOpen(isSmallScreen?false:true)}}
                >
                  <ListItemText primary="Payments Report" sx={{opacity: open ? 1 : 0}} />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </Drawer>: null}
      <Box component="main" sx={{ flexGrow: 1, p: 1, width: "100%", overflow: !isSmallScreen ? "hidden":"visible",display: "flex", alignItems: "center", flexDirection:"column", marginTop:"2rem", backgroundColor:"#f0f3fb", position:isSmallScreen && open?"absolute":"", height:"100%" }} onClick={()=>isSmallScreen && open ? setOpen(false):null}>
        <Box sx={{ width: open ? "96%" : "97%", height: open ? "100%" : "100%", backgroundColor:'', marginTop:"2rem" }}>
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
    </Box>}
    </>
  );
}
