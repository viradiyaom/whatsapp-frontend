import Layout from '@components/Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from 'components/Button';
import Input from 'components/Input';
import SafeAreaView from 'components/SafeAreaView';
import { auth } from 'config/call';
import React, { memo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from 'utils/types';

const initialData = {
  email: 'nature@gmail.com',
  password: 'nature@123',
  // email: 'rocky@gmail.com',
  // password: 'Rocky@123',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [loginParams, setLoginParams] = useState(initialData);
  const { top } = useSafeAreaInsets();
  const handleSubmit = () => {
    if (loginParams.email && loginParams.password) {
      auth
        .login(loginParams)
        .then(async ({ data }) => {
          if (data.data) {
            await AsyncStorage.setItem(
              'userDetails',
              JSON.stringify(data.data),
            );
            await AsyncStorage.setItem('token', data.data.token);
            Toast.show({ type: 'success', text1: data.message });
            navigation.replace('Listing');
          }
        })
        .catch(text1 => {
          Toast.show({ type: 'error', text1 });
        });
      return;
    }
    Toast.show({ type: 'error', text1: 'Something is Missing.' });
  };

  return (
    <Layout className="items-center px-4" style={{ paddingTop: top }}>
      <Image
        source={require('../../assets/images/whatsapp-color.png')}
        className="w-[120px] h-[120px] mt-20"
      />
      <Text className="text-white font-bold text-[24px] mt-2">
        Welcome to WhatsApp
      </Text>
      <Input
        className="mt-7"
        textContentType="emailAddress"
        keyboardType="email-address"
        value={loginParams.email}
        onChangeText={email =>
          setLoginParams(e => ({ ...e, email: email.toLowerCase() }))
        }
      />
      <Input
        value={loginParams.password}
        className="mt-3"
        placeholder="Password"
        textContentType="password"
        onChangeText={password =>
          setLoginParams(e => ({ ...e, password: password.toLowerCase() }))
        }
      />
      <Button className="mt-6" onPress={handleSubmit}>
        <Text className="font-semibold text-center text-white"> LOGIN</Text>
      </Button>
      <View className="flex-1" />
      <Text className="text-white max-w-[300px] text-center mb-2">
        Read our <Text className="underline">Privacy Policy</Text>. Tap "Agree &
        Continue" to accept the
        <Text className="underline">Terms of Service</Text>
      </Text>
    </Layout>
  );
};

export default memo(LoginScreen);
