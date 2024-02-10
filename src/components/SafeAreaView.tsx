import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView as SafeArea } from 'react-native-safe-area-context';

const SafeAreaView = (props: ViewProps) => (
  <SafeArea className="bg-dark-bg" {...props} />
);

export default SafeAreaView;
