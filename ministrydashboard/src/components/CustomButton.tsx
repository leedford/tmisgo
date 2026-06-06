import React from 'react';
import { Button, type ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {
  label?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, children, ...props }) => {
  return <Button {...props}>{children ?? label}</Button>;
};

export default CustomButton;
