import React from 'react';
import { Select, type SelectProps } from 'antd';

interface SelectOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface CustomSelectInputProps extends SelectProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  options?: SelectOption[];
}

const CustomSelectInput: React.FC<CustomSelectInputProps> = ({
  label,
  error,
  className,
  containerClassName,
  options = [],
  ...props
}) => (
  <div className={containerClassName}>
    {label ? (
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    ) : null}

    <Select
      className={className}
      options={options}
      {...props}
      style={{ width: '100%', ...props.style }}
    />

    {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
  </div>
);

export default CustomSelectInput;
