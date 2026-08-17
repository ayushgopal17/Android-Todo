import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
   baseURL: 'https://android-todo.onrender.com',
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  console.log('TOKEN SENT:', token);

  if (token) {
    config.headers.token = token;
  }

  return config;
});



export default api;