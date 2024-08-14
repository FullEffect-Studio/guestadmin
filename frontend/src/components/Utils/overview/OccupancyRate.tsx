
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface OccupancyRateProps {
  rate: number;
}

const OccupancyRate: React.FC<OccupancyRateProps> = ({ rate }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          Current Occupancy Rate
        </Typography>
        <Typography variant="h3">
          {rate}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OccupancyRate;
