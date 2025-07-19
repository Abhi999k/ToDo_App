// screens/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/config';

import TodoListScreen from './Dashboard/TodoListScreen';
import ProfileScreen from './Dashboard/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUsername = async () => {
      await auth.currentUser?.reload(); 
      const name = auth.currentUser?.displayName;
      if (name) setUsername(name);
    };
    loadUsername();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'ToDo') {
            iconName = 'checkmark-done-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'left',
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="ToDo"
        component={TodoListScreen}
        options={{
          title: username ? `Hi, ${username} 👋`:'My Tasks', 
          tabBarLabel: 'ToDo',
          headerTitleStyle: { fontSize: 25 },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Your Profile' }}
      />
    </Tab.Navigator>
  );
}
