import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, sendEmailVerification, reload } from 'firebase/auth';

export default function EmailVerificationScreen({ navigation }: any) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSendEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        Alert.alert('Email Sent', 'A verification email has been sent.');

        // Start cooldown timer (e.g., 60s)
        setCooldown(60);
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const checkVerification = async () => {
    if (user) {
      setLoading(true);
      await reload(user);
      setLoading(false);

      if (user.emailVerified) {
        Alert.alert('Success', 'Email verified successfully!');
        navigation.replace('LoginScreen');
      } else {
        Alert.alert('Not Verified', 'Please verify your email first.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📧 Verify your Email</Text>
      <Text style={styles.text}>
        Click the button below to send a verification email, then check your inbox.
      </Text>

      <Button
        title={cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Send Verification Email'}
        onPress={handleSendEmail}
        color="#1976D2"
        disabled={cooldown > 0}
      />

      <View style={{ marginVertical: 12 }} />
      
      <Button
        title={loading ? 'Checking...' : 'I have verified'}
        onPress={checkVerification}
        color="#1976D2"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1976D2' },
  text: { textAlign: 'center', marginBottom: 20, fontSize: 14, color: '#333' },
});

