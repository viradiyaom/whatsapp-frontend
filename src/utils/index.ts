import AsyncStorage from '@react-native-async-storage/async-storage';

const ip = '192.168.175.243';
export const ENV = {
  API_URL: `http://${ip}:1000`,
  // API_URL: 'http://localhost:1000',
  IMAGE_URL: `http://${ip}:1000/uploads`,
  // IMAGE_URL: 'http://localhost:1000/uploads',
};

export const fetchUserDetails = () =>
  new Promise(async (res, rej) => {
    const userDetailsString = await AsyncStorage.getItem('userDetails');
    if (userDetailsString) {
      res(JSON.parse(userDetailsString));
    } else {
      rej();
    }
  });
