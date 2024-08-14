import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import OccupancyRate from './overview/OccupancyRate';
import RevenueOverview from './RevenueOverview';

const Overview: React.FC = () => {
  // State to store occupancy rate, total guests, and revenue data
  const [occupancyRate, setOccupancyRate] = useState<number>(0);
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch occupancy rate data
        const occupancyResponse = await fetch('/api/occupancyRate');
        const occupancyData = await occupancyResponse.json();
        setOccupancyRate(occupancyData.rate);

        // Fetch total guests data
        const guestsResponse = await fetch('/api/totalGuests');
        const guestsData = await guestsResponse.json();
        setTotalGuests(guestsData.total);

        // Fetch revenue data for the current and previous months
        const revenueResponse = await fetch('/api/revenueOverview');
        const revenueData = await revenueResponse.json();
        setCurrentMonthRevenue(revenueData.currentMonth);
        setPreviousMonthRevenue(revenueData.previousMonth);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <OccupancyRate rate={occupancyRate} />
 
      <RevenueOverview
        currentMonthRevenue={currentMonthRevenue}
        previousMonthRevenue={previousMonthRevenue}
      />
    </Container>
  );
};


export default Overview