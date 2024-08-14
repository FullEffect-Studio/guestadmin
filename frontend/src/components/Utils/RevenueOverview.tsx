// RevenueOverview.tsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface RevenueOverviewProps {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({ currentMonthRevenue, previousMonthRevenue }) => {
  const revenueIncrease = currentMonthRevenue - previousMonthRevenue;
  const revenueIncreasePercentage = (revenueIncrease / previousMonthRevenue) * 100;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          Revenue Overview
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography variant="subtitle1">Current Month Revenue:</Typography>
            <Typography variant="h3">${currentMonthRevenue}</Typography>
          </div>
          <div>
            <Typography variant="subtitle1">Previous Month Revenue:</Typography>
            <Typography variant="h3">${previousMonthRevenue}</Typography>
          </div>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1">Revenue Increase:</Typography>
          {!revenueIncrease ?<Typography variant="h4">${revenueIncrease}</Typography>: <Typography>300</Typography>}
          <Typography variant="subtitle1">Percentage Increase:</Typography>
          {!revenueIncreasePercentage ?<Typography variant="h4">{revenueIncreasePercentage.toFixed(2)}%</Typography>: <Typography>50%</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueOverview;
