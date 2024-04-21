import React from 'react';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';

const CustomMenuItem = ({ to, onClick, ...props }) => {
  const router = useRouter();

  const handleMenuItemClick = () => {
    router.push(to);
    if (onClick) {
      onClick();
    }
  };

  return <MenuItem {...props} onClick={handleMenuItemClick} />;
};

export default CustomMenuItem;
