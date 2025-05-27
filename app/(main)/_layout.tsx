import { theme } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native'; // Import Lucide icons
import React from 'react';
import { Pressable } from 'react-native';
import { AppIcon } from '../../components/AppIcon'; // Adjust path as needed

function TabBarIcon(props: {
  Icon: React.ComponentType<any>;
  color: string;
  size: number;
}) {
  return <AppIcon Icon={props.Icon} color={props.color} size={props.size} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.activetab,
        tabBarInactiveTintColor: theme.colors.tab,
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveBackgroundColor: theme.colors.background,
        tabBarShowLabel: false,
        headerShown: false,
        headerStyle: {
          backgroundColor: '#000',
        },
        tabBarButton: ({ children, style, ...rest }: any) => (
          <Pressable
            android_ripple={{ color: 'transparent' }}
            style={({ pressed }) => [style, { opacity: pressed ? 0.7 : 1 }]}
            {...rest}
          >
            {children}
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon Icon={Home} color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabBarIcon Icon={User} color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
