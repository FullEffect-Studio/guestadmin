
import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

interface CustomLoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

const CustomLoadingButton: React.FC<CustomLoadingButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default CustomLoadingButton;
