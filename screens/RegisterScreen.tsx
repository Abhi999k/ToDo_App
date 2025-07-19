// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile,} from 'firebase/auth';

import { auth } from '../firebase/config';
export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

 const handleRegister = async () => {
  if (!name || !email || !password || !confirmPassword) {
    return Alert.alert("All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Alert.alert("Please enter a valid email address.");
  }

  if (password.length < 6) {
    return Alert.alert("Password must be at least 6 characters long.");
  }

  if (password !== confirmPassword) {
    return Alert.alert("Passwords do not match.");
  }

  if (!agree) {
    return Alert.alert("Please accept the terms and conditions.");
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    await auth.currentUser?.reload();
    navigation.replace('EmailVerificationScreen');
  } catch (error: any) {
    Alert.alert("Registration failed", error.message);
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Todo_AK</Text>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.subheading}>Please register to continue</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email address" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
          {agree && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I agree to the <Text style={styles.link}>Terms and Conditions</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 30, fontWeight: 'bold', color: '#1976D2', textAlign: 'center', marginBottom: 40 },
  heading: { fontSize: 24, fontWeight: '600', textAlign: 'center' },
  subheading: { textAlign: 'center', marginBottom: 40, color: '#888' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 17 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  checkboxBox: { width: 20, height: 20, borderWidth: 1, borderColor: '#1976D2', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  checkmark: { fontSize: 14, color: '#1976D2' },
  checkboxText: { fontSize: 14, flexShrink: 1 },
  link: { color: '#1976D2', textDecorationLine: 'underline' },
  button: { backgroundColor: '#1976D2', paddingVertical: 14, borderRadius: 8, marginBottom: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  loginText: { textAlign: 'center', fontSize: 14 },
});
