import { Backdrop, Box, Card, CardActions, CardContent, CircularProgress, Rating, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { IconBook } from '@tabler/icons-react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import MainDataTable from './Utils/MainDataTable.';
import useMediaQuery from "@mui/material/useMediaQuery"
import HotelIcon from '@mui/icons-material/Hotel';
import Groups2Icon from '@mui/icons-material/Groups2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { CalenderView } from './Utils/CalenderView';
import BookingTrendsChart from './Utils/BookingTrends';
import Overview from './Utils/Overview';
import {CountUp} from "use-count-up"
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { APIContext } from '../Contexts';

function createData(
  name: string,
  calories: number,
) {
  return { name, calories };
}

const rows = [
  createData('Frozen yoghurt', 159),
  createData('Ice cream sandwich', 237),
  createData('Eclair', 262),
  createData('Cupcake', 305),
  createData('Gingerbread', 356),
];

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#9c27b0' : '#9c27b0',
  },
}));

const BorderLinearProgressTwo = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#ff9800' : '#ff9800',
  },
}));

const BorderLinearProgressThree = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#198754' : '#198754',
  },
}));

const BorderLinearProgressFour = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#0dcaf0' : '#0dcaf0',
  },
}));

const DashBoard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalBookingdata, setTotalBookingdata] = useState<number>(0)
  const [totalRoomAvailabledata, setTotalRoomAvailabledata] = useState<number>(0)
  const [numOfGuestdata, setNumOfGuestdata] = useState<number>(0)
  const [totalIncomeData, setTotalIncomeData] = useState<number>(0)

  const context = useContext(APIContext)
  if(!context){
    throw new Error("error context")
  }

  const {paymentDetails, setPaymentDetails} = context

  useEffect(()=>{
    const fetchTotalBookingdata = async () => {
      try{
        setPaymentDetails({...paymentDetails, globalLoading:true})
        const {data} = await axios.get("https://guestmanagerapi.onrender.com/api/bookings/totalBookings/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setTotalBookingdata(data)
        console.log(`tot booking ${totalBookingdata}`)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }catch(error){
        console.log(error)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }
    }
    const fetchRoomAvailabledata = async () => {
      try{
        setPaymentDetails({...paymentDetails, globalLoading:true})
        const {data} = await axios.get("https://guestmanagerapi.onrender.com/api/rooms/totalRoomsAvailable/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setTotalRoomAvailabledata(data)
        console.log(`rooms ${totalRoomAvailabledata}`)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }catch(error){
        console.log(error)
        setPaymentDetails({...paymentDetails, globalLoading:true})
      }
    }
    const fetchNumOfGuestdata = async () => {
      try{
        setPaymentDetails({...paymentDetails, globalLoading:true})
        const {data} = await axios.get("https://guestmanagerapi.onrender.com/api/guests/totalGuest/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setNumOfGuestdata(data)
        setPaymentDetails({...paymentDetails, globalLoading:false})
        console.log(`guests ${numOfGuestdata}`)
      }catch(error){
        console.log(error)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }
    }
    const fetchTotalIncomedata = async () => {
      try{
        setPaymentDetails({...paymentDetails, globalLoading:true})
        const {data} = await axios.get("https://guestmanagerapi.onrender.com/api/payment/totalIncome/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setTotalIncomeData(data.total_icome)
        console.log("total income", data.total_icome)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }catch(error){
        console.log(error)
        setPaymentDetails({...paymentDetails, globalLoading:false})
      }
    }

    fetchTotalBookingdata();
    fetchRoomAvailabledata();
    fetchTotalIncomedata()
    fetchNumOfGuestdata()
  }, [])
    const isSmallDevice = useMediaQuery("(max-width: 1023px)")
    isLoading && <div>...loading</div>
  return (
    <Box sx={{ width: "100%", display:"flex", flexDirection:"column", gap:"3rem"}}>
      {paymentDetails.globalLoading&&<Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"white", display:"flex", flexDirection:"column", justifyContent:"center", gap:"2rem" }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <p>Please wait ...</p>
        </Backdrop>}
        {/* Intro and some stats */}
        <Box sx={{display:"flex", justifyContent:"space-between",alignItems:"center",width: "99%", marginTop:"1rem", flexDirection: isSmallDevice ? "column":"row", gap:isSmallDevice ? "3rem":""}}>
            <h2 className=' text-blue-700 text-3xl font-semibold'>Hi, Welcome Back!, <br /><span className='text-slate-600 font-bold'>{localStorage.getItem("username")}</span></h2>
            <Box sx={{display:"flex", flexDirection:"row-reverse", gap:"2rem"}}>
                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                    <Typography className=' text-slate-700' sx={{fontWeight:"700", color:"rgb(51, 65, 85, .8) "}} component={"legend"}>Yearly Income</Typography>
                    <Box sx={{width:"100px", }}>
                    <SparkLineChart
                    plotType="bar"
                    data={[1, 4, 2, 5, 7, 2, 4, 6]}
                    height={100}
                    colors={["rgba(59, 130, 246, .8)"]}
                    />
                    </Box>
                </Box>
                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <Typography sx={{fontWeight:"700", color:"rgb(51, 65, 85, .8) "}} component={"legend"}>Customer Ratings</Typography>
                    <Rating name="read-only" value={4} readOnly />
                </Box>
            </Box>
        </Box>

        {/* Booking, Rooms, Customers, Revenue */}
        <Box className=" flex w-[100%] justify-between" sx={{flexDirection: isSmallDevice ? "column":"row", gap:isSmallDevice ? "3rem": ""}}>
        <Card className=" dashboard_card" variant='outlined' sx={{width:!isSmallDevice ?"250px":"100%", height:"150px"}}>
            <Box sx={{width:"90%", height:"80%", padding:"1rem",display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}><div className=' w-[50px] h-[50px] rounded-lg flex items-center justify-center' style={{backgroundColor:"#9c27b0"}}><IconBook size={35} color='white' /></div><div className=" flex flex-col items-center"><h2 className=' text-xl font-semibold'>Total Booking</h2><h1 className=' text-xl font-semibold'><CountUp isCounting end={totalBookingdata} duration={15} /></h1></div></Box>
                <Box>
                <BorderLinearProgress variant="determinate" value={50} />
                </Box>
            </Box>
        </Card>
        <Card className=" dashboard_card" variant='outlined' sx={{width: !isSmallDevice ?"250px":"100%", height:"210px"}}>
            <Box sx={{width:"90%", height:"80%", padding:"1rem",display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}><div className=' w-[50px] h-[50px] rounded-lg flex items-center justify-center' style={{backgroundColor:"#ff9800"}}><HotelIcon sx={{color:"white", fontSize:"36px"}} /></div><div className=" flex flex-col items-center"><h2 className=' text-xl font-semibold'>Rooms Avail</h2><h1 className=' text-xl font-semibold'><CountUp isCounting end={totalRoomAvailabledata} duration={25} /></h1></div></Box>
                <Box>
                <BorderLinearProgressTwo variant="determinate" value={50} />
                </Box>
            </Box>
        </Card>
        <Card className=" dashboard_card" variant='outlined' sx={{width: !isSmallDevice ?"250px":"100%", height:"210px"}}>
            <Box sx={{width:"90%", height:"80%", padding:"1rem",display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}><div className=' w-[50px] h-[50px] rounded-lg flex items-center justify-center' style={{backgroundColor:"#198754"}}><Groups2Icon sx={{color:"white", fontSize:"36px"}} /></div><div className=" flex flex-col items-center"><h2 className=' text-xl font-semibold'>N<span className=' underline'>o</span>. of Guests</h2><h1 className=' text-xl font-semibold'><CountUp isCounting end={numOfGuestdata} duration={5} /></h1></div></Box>
                <Box>
                <BorderLinearProgressThree variant="determinate" value={50} />
                </Box>
            </Box>
        </Card>
        <Card className=" dashboard_card" variant='outlined' sx={{width: !isSmallDevice ?"250px":"100%", height:"150px"}}>
            <Box sx={{width:"90%", height:"80%", padding:"1rem",display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}><div className=' w-[50px] h-[50px] rounded-lg flex items-center justify-center' style={{backgroundColor:"#0dcaf0"}}><h5 style={{color:"white", fontSize:"36px"}}>₵</h5></div><div className=" flex flex-col items-center"><h2 className=' text-xl font-semibold'>Total Revenue</h2><h1 className=' text-xl font-semibold'>GH₵{totalIncomeData}</h1></div></Box>
                <Box>
                <BorderLinearProgressFour variant="determinate" value={50} />
                </Box>
            </Box>
        </Card>
        </Box>

        {/* <Overview /> */}

        {/* Table for clients in debt (Name of client | Amount Owing) and Table for prebooked clients  (Name of client | Check-in Date) */}
        <Box sx={{display: 'flex', flexDirection: isSmallDevice ? 'column': 'row', gap:"3rem"}}>
        <Card sx={{width:'100%'}}>
          <CardActions ><p className=' w-full font-bold text-center'>Clients in debt</p></CardActions>
          <CardContent>
          <Table aria-label="simple table" sx={{width:'100%'}}>
            <TableHead>
              <TableRow>
                <TableCell>Guest Name</TableCell>
                <TableCell align="right">Amount Owing (GHS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
        <Card sx={{width:'100%'}}>
          <CardActions ><p className=' w-full font-bold text-center'>Upcoming Residents</p></CardActions>
          <CardContent>
          <Table aria-label="simple table" sx={{width:'100%'}}>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
        </Box>
        <BookingTrendsChart />

        {/* <CalenderView /> */}

        {/* Main Dataset */}

        {/* <MainDataTable /> */}
    </Box>
  )
}

export default DashBoard