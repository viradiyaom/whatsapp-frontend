import React, { memo } from 'react';
import { TextInput, TextInputProps } from 'react-native';

const Input = ({ className, ...rest }: TextInputProps) => {
  return (
    <TextInput
      className={`py-4 px-4 bg-white text-black w-full rounded-md ${className}`}
      {...rest}
    />
  );
};

export default memo(Input);
