import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from '@/src/navigation/MainTabs';
import OnboardingScreen from '@/src/screens/OnboardingScreen';
import MiniAppScreen from '@/src/screens/MiniAppScreen';
import TokenDetailScreen from '@/src/screens/TokenDetailScreen';
import { usePrivy } from '@privy-io/expo';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user } = usePrivy();
    console.log('[RootNavigator] Current user state:', user ? `Authenticated (${user.id})` : 'Not Authenticated');

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen
                        name="MiniApp"
                        component={MiniAppScreen}
                        options={{
                            headerShown: false,
                            presentation: 'modal',
                        }}
                    />
                    <Stack.Screen
                        name="TokenDetail"
                        component={TokenDetailScreen}
                        options={{
                            headerShown: false,
                            animation: 'slide_from_right'
                        }}
                    />
                </>
            ) : (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
        </Stack.Navigator>
    );
}
