import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/Theme';
import HomeScreen from '@/src/screens/HomeScreen';
import WalletScreen from '@/src/screens/WalletScreen';
import AppsScreen from '@/src/screens/AppsScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: 'transparent',
                    height: Platform.OS === 'ios' ? 90 : 80,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 4,
                }
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Apps"
                component={AppsScreen}
                options={{
                    title: 'Apps',
                    tabBarIcon: ({ color, size }) => <Ionicons name="apps" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
