import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User, reload } from 'firebase/auth';
import { auth } from './firebase/config';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import Dashboard from './screens/Dashboard';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackScreen() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Dashboard" component={Dashboard} />
    </AppStack.Navigator>
  );
}

function VerifiedWaitScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>✅ Email Verified! Redirecting...</Text>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWaitScreen, setShowWaitScreen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let interval: any;

    if (user && !user.emailVerified) {
      interval = setInterval(async () => {
        await reload(auth.currentUser!);
        if (auth.currentUser?.emailVerified) {
          setShowWaitScreen(true);
          clearInterval(interval);

          setTimeout(() => {
setUser(auth.currentUser);
            setShowWaitScreen(false);
          }, 3000);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [user]);

  if (loading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStackScreen} />
        ) : !user.emailVerified ? (
          <Stack.Screen name="EmailVerificationScreen" component={EmailVerificationScreen} />
        ) : showWaitScreen ? (
          <Stack.Screen name="VerifiedWait" component={VerifiedWaitScreen} />
        ) : (
          <Stack.Screen name="App" component={AppStackScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#1976D2', fontWeight: 'bold' },
});
