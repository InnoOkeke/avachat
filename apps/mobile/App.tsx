import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './components/AuthProvider';
import { SmartAccountProvider } from './components/SmartAccountProvider';
import { ThemeProvider } from './components/ThemeProvider';

import * as Linking from 'expo-linking';

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './src/navigation/types';

const prefix = Linking.createURL('/');

export default function App() {
    const linking: LinkingOptions<RootStackParamList> = {
        prefixes: [prefix, 'avachat://'],
        config: {
            screens: {
                Onboarding: 'onboarding',
                MainTabs: {
                    screens: {
                        Home: 'home',
                        Apps: 'apps',
                        Profile: 'profile',
                    },
                },
                MiniApp: 'miniapp',
            },
        },
    };

    React.useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            console.log('--- INCOMING DEEP LINK ---');
            console.log(event.url);
            console.log('--------------------------');
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Check initial URL
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('--- INITIAL DEEP LINK ---');
                console.log(url);
                console.log('-------------------------');
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <ThemeProvider>
            <AuthProvider>
                <SmartAccountProvider>
                    <StatusBar style="light" />
                    <NavigationContainer linking={linking}>
                        <RootNavigator />
                    </NavigationContainer>
                </SmartAccountProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
