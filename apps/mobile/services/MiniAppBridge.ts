import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface MiniAppRequest {
    id: string;
    method: string;
    params: any[];
}

export class MiniAppBridge {
    static async handleRequest(
        request: MiniAppRequest,
        smartAccountAddress: string | null,
        sendTransaction: (to: string, value: string, data?: string) => Promise<string>
    ): Promise<any> {
        console.log('--- MiniApp Request ---', request);

        switch (request.method) {
            case 'eth_requestAccounts':
                return [smartAccountAddress];

            case 'eth_sendTransaction':
                const tx = request.params[0];
                return new Promise((resolve, reject) => {
                    Alert.alert(
                        'Confirm Transaction',
                        `A mini-app is requesting to send ${tx.value || '0'} AVAX to ${tx.to}.`,
                        [
                            { text: 'Cancel', onPress: () => reject(new Error('User rejected')), style: 'cancel' },
                            {
                                text: 'Confirm',
                                onPress: async () => {
                                    try {
                                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        const hash = await sendTransaction(tx.to, tx.value || '0', tx.data || '0x');
                                        resolve(hash);
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        ]
                    );
                });

            default:
                throw new Error(`Method ${request.method} not supported`);
        }
    }

    static getInjectionScript(): string {
        return `
      (function() {
        window.ethereum = {
          isAvaChat: true,
          request: async ({ method, params }) => {
            const id = Math.random().toString(36).slice(2);
            return new Promise((resolve, reject) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({ id, method, params }));
              
              const handler = (event) => {
                try {
                  const response = JSON.parse(event.data);
                  if (response.id === id) {
                    window.removeEventListener('message', handler);
                    if (response.error) reject(new Error(response.error));
                    else resolve(response.result);
                  }
                } catch (e) {}
              };
              window.addEventListener('message', handler);
            });
          }
        };
        window.avachat = window.ethereum;
        console.log('AvaChat SDK Injected');
      })();
    `;
    }
}
