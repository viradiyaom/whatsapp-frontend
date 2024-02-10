import AsyncStorage from '@react-native-async-storage/async-storage';

export const ENV = {
  API_URL: 'http://localhost:1000',
  IMAGE_URL: 'http://localhost:1000/uploads/images',
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
