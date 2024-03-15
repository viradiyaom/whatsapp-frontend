import Layout from '@components/Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@utils/types';
import React, { memo, useEffect } from 'react';
import { Image, StatusBar, View } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    setTimeout(async () => {
      const userDetails = await AsyncStorage.getItem('userDetails');
      navigation.replace(userDetails ? 'Listing' : 'Login');
    }, 2000);
  }, [navigation]);

  return (
    <Layout className="items-center justify-around">
      <StatusBar backgroundColor="#121b22" />
      <View />
      <Image
        className="h-[90px] w-[90px]"
        source={require('../../assets/images/whatsapp-logo.jpg')}
      />
      <Image
        className="h-[45px] w-[85px]"
        source={require('../../assets/images/from-meta.jpg')}
      />
    </Layout>
  );
};

export default memo(SplashScreen);
