import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "../Services/api"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const LoginScreen = ({navigation}:any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  try {
    const response = await api.post('/signin', {
     
  
  email,
  password

    });

    const token = response.data.token;

    await AsyncStorage.setItem('token', token);

    console.log('TOKEN SAVED');


    navigation.navigate('Todo');
  } catch (error: any) {
    console.log(
      'LOGIN ERROR:',
      error.response?.data || error.message,
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title }>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to manage your todos</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
  <Text style={styles.signupText}>
    Don't have an account? Sign Up
  </Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
  color:  '#4a1dd1',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#4a1dd1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;