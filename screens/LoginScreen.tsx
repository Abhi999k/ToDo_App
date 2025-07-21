import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (!user.emailVerified) {
        Alert.alert(
          'Email Not Verified',
          'Your email is not verified. Please check your inbox and verify it before logging in.'
        );
        await signOut(auth);
      } else {
        const name = user.displayName || user.email || 'User';
        Alert.alert('Login Successful', `Welcome back, ${name}!`);
      }
    } catch (error: any) {
      switch (error.code) {
        default:
          Alert.alert('Login Failed', error.message);
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>👤</Text>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subheading}>Sign in to your To-Do account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          Go to Register
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  subheading: {
    textAlign: 'center',
    marginBottom: 50,
    color: '#555',
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: '#1976D2',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
