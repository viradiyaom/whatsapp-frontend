import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

const Button = ({ className, ...rest }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      className={`w-2/3 text-center bg-dark-green py-4 rounded-[30px] ${className}`}
      {...rest}
    />
  );
};

export default Button;
