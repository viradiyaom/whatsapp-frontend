import React, { memo } from 'react';
import { View } from 'react-native';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

const Layout = ({ className = '', ...rest }: ViewProps) => (
  <View className={`bg-dark-bg h-full ${className}`} {...rest} />
);

export default memo(Layout);
