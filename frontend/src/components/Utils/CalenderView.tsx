import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, CircularProgress, Box } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Person2Icon from '@mui/icons-material/Person2';
import { IconHash } from "@tabler/icons-react";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Booking {
  id: number;
  booking_status: string;
  date_checked_in: string;
  guest_name: string
}

export const CalenderView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'dd-MM-yyyy') : '';


  const dateChangeHandler = async (date: any) => {
    try {
      setSelectedDate(date)
      console.log("selected date=", date)
      setLoading(true);
      const response = await axios.get(`https://guestmanagerapi.onrender.com/api/booking/upcomingBooking/${format(date, "dd-MM-yyyy")}/`);
      setBookings(response.data);
      console.log(typeof bookings)
      setLoading(false);
      console.log(response.data);
    } catch (error: any) {
      setIsError(true);
      setError(error.message);
      setLoading(false);
      console.log("error", error);
    }
  
  }


  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
  const year = today.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const isSmallDevice = useMediaQuery("(max-width:1023px)")

  return (
    <Box sx={{width: isSmallDevice ? "98%":"80%", margin:"auto"}}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={dateChangeHandler}
              renderInput={(params: any) => <Box {...params} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6" sx={{textAlign:"center"}}>Upcoming Bookings</Typography>
              {loading ? (
                <CircularProgress />
              ) : isError ? (
                <Typography color="error">{error}</Typography>
              ) : (
                bookings.map((booking, index) => (
                    <Box>
                      <Box className=" shadow-md h-max w-[97%] m-auto rounded-3xl" sx={{padding:"10px 20px"}}  key={booking.id}>
                        <Box sx={{display:"flex", width:"100%", gap:"1.2rem"}}>
                        <Box sx={{display:"flex", gap:".2rem", flexDirection:"column"}}>
                          <Box sx={{display:"flex"}}>
                          <Person2Icon />
                          <h2 className=" text-gray-500 font-extrabold">Full Name</h2>
                          </Box>
                          <Typography className=" text-black font-extrabold" sx={{fontWeight:"900"}} component={"h2"}>{booking.guest_name}</Typography>
                        </Box>
                        <Box sx={{display:"flex", flexDirection:"column"}}>
                          <h2 className="text-gray-500 font-extrabold flex"><IconHash /> Booking ID</h2>
                          <h1 className=" font-extrabold">{booking.id}</h1>
                        </Box>
                        </Box>
                        <Box sx={{display:"flex", flexDirection:"column"}}>
                          <h2 className="text-gray-500 font-extrabold flex">Duration</h2>
                          <h2 className="font-extrabold">{booking.date_checked_in} to {booking.date_checked_in}</h2>
                          <Box className=" flex flex-col">
                          <h2 className="text-gray-500 font-extrabold flex">Status</h2>
                          <h2 className=" font-extrabold">{booking.booking_status}</h2>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))
              )}
            </Paper>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
}
