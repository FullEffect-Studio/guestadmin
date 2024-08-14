import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";

interface BookingTrend {
  NumberOfBookings: number;
  created_at: string;
}

const BookingTrendsChart: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () =>{
      try{
        setLoading(true)
        const {data} = await axios.get("https://guestmanagerapi.onrender.com/api/booking/bookungTrends/", {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setData(data)
        console.log("trend", data)
        setLoading(false)
      }catch(error){
        console.log("error", error)
        setLoading(false)
      }
    }

    fetchData()
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ backgroundColor: "white" }}>
      <Typography variant="h6" align="center" gutterBottom>
        Booking Trends Analysis
      </Typography>
      <ResponsiveContainer style={{overflowX:"scroll"}} width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="NumberOfBookings" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BookingTrendsChart;
