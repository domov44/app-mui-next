// CustomButton.js
import React from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

const CustomButton = ({ to, onClick, ...props }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(to);
    if (onClick) {
      onClick();
    }
  };

  return <Button {...props} onClick={handleButtonClick} />;
};

export default CustomButton;
