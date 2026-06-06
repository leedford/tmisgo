import React from 'react';
import { Input, type InputProps } from 'antd';

interface TextInputProps extends InputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
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

    <Input className={className} {...props} />

    {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
  </div>
);

export default TextInput;
