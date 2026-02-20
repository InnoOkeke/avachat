import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSmartAccount } from './SmartAccountProvider';
import { MiniAppBridge } from '../services/MiniAppBridge';

interface MiniAppRuntimeProps {
    url: string;
}

export const MiniAppRuntime: React.FC<MiniAppRuntimeProps> = ({ url }) => {
    const webViewRef = useRef<WebView>(null);
    const { smartAccountAddress, sendTransaction } = useSmartAccount();

    const onMessage = async (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.method) {
                try {
                    const result = await MiniAppBridge.handleRequest(data, smartAccountAddress, sendTransaction);
                    webViewRef.current?.postMessage(JSON.stringify({ id: data.id, result }));
                } catch (error: any) {
                    webViewRef.current?.postMessage(JSON.stringify({ id: data.id, error: error.message }));
                }
            }
        } catch (e) {
            console.error('Bridge error:', e);
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={MiniAppBridge.getInjectionScript()}
                onMessage={onMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});
