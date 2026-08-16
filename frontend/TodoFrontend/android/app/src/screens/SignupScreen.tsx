import React, {useState} from 'react';
import api from '../Services/api';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SignupScreen = ({navigation}:any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');


   const handleSignup = async () => {
  if (name.trim() === '') {
    setError('Name is required');
    return;
  }

  if (email.trim() === '') {
    setError('Email is required');
    return;
  }

  if (!email.includes('@')) {
    setError('Enter a valid email');
    return;
  }

  if (password.trim() === '') {
    setError('Password is required');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setError('');

 try {
  const response = await api.post('/signup', {
    name,
    email,
    password,
  });

  console.log(response.data);
  navigation.navigate('Login');

} catch (error: any) {
  console.log(
    'SIGNUP ERROR:',
    error.response?.data || error.message,
  );

  setError(
    error.response?.data?.message || 'Signup failed'
  );
} 

   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Sign up to start managing your todos
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

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
      <TextInput
  style={styles.input}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChangeText={setConfirmPassword}
  secureTextEntry
/>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate('Login')}>
  <Text>Already have an account? Login</Text>
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

  loginText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SignupScreen;