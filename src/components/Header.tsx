import { styled } from 'nativewind';
import React, { PropsWithChildren, memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{ style?: any }>;

const getStyles = (style: any, top: number) =>
  StyleSheet.flatten([
    style,
    {
      marginTop: Platform.OS === 'ios' ? top - 10 : 0,
    },
  ]);

const Header = ({ children, style = {} }: Props) => {
  const { top } = useSafeAreaInsets();
  return (
    <View className="bg-[#1f2c34]">
      <View
        className={`flex flex-row items-center px-2 py-2 bg-[#1f2c33] h-[58px]`}
        style={getStyles(style, top)}>
        {children}
      </View>
    </View>
  );
};

export default styled(memo(Header));
