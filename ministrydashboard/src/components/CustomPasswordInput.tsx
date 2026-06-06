import React from 'react';
import { Input, type InputProps } from 'antd';

interface CustomPasswordInputProps extends InputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  label,
  error,
  className,
  containerClassName,
  ...props
}) => (
  <div className={containerClassName}>
    {label ? (
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    ) : null}

    <Input.Password className={className} {...props} />

    {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
  </div>
);

export default CustomPasswordInput;
