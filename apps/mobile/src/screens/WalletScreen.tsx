import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { WalletService, TokenBalance } from '@/services/WalletService';
import { useSmartAccount } from '@/components/SmartAccountProvider';
import { UniformBackground } from '@/components/ui/UniformBackground';
import Animated, { FadeInUp, FadeInRight, FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-styled';
import { Modal } from 'react-native';

export default function WalletScreen() {
    const { colors, spacing, typography } = useGlobalTheme();
    const { smartAccountAddress } = useSmartAccount();
    const navigation = useNavigation<any>();
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReceiveVisible, setIsReceiveVisible] = useState(false);

    useEffect(() => {
        loadBalances();
    }, [smartAccountAddress]);

    const loadBalances = async () => {
        setIsLoading(true);
        try {
            const data = await WalletService.getBalances(smartAccountAddress);
            setBalances(data);
        } catch (error) {
            console.error('Failed to load balances', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalBalance = balances.reduce((acc, curr) => acc + parseFloat(curr.usdValue), 0);

    const handleSendAction = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Home', { presetText: 'Send ' });
    };

    const handleSwapAction = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Home', { presetText: 'Swap 10 AVAX for USDC' });
    };

    const renderAsset = (item: TokenBalance, index: number) => (
        <TouchableOpacity
            key={item.symbol}
            activeOpacity={0.7}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('TokenDetail', { token: item });
            }}
        >
            <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={styles.assetItem}>
                <View style={styles.assetLeft}>
                    <Image source={{ uri: item.logo }} style={styles.tokenIcon} />
                    <View>
                        <ThemedText type="headline">{item.symbol}</ThemedText>
                        <ThemedText color="secondary" type="footnote">{item.name}</ThemedText>
                    </View>
                </View>
                <View style={styles.assetRight}>
                    <ThemedText type="headline">${parseFloat(item.usdValue).toLocaleString()}</ThemedText>
                    <ThemedText color="secondary" type="footnote">{item.balance} {item.symbol}</ThemedText>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Animated.View entering={FadeInUp.springify()} style={styles.header}>
                        <ThemedText color="secondary" type="caption1">NET WORTH</ThemedText>
                        <ThemedText style={[styles.totalAmount, { color: colors.text, ...typography.largeTitle }]}>
                            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </ThemedText>
                    </Animated.View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleSendAction}>
                            <Ionicons name="arrow-up" size={20} color="#FFF" />
                            <ThemedText style={styles.actionText}>Send</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setIsReceiveVisible(true);
                            }}
                        >
                            <Ionicons name="qr-code" size={20} color={colors.text} />
                            <ThemedText style={[styles.actionText, { color: colors.text }]}>Receive</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface }]} onPress={handleSwapAction}>
                            <Ionicons name="swap-horizontal" size={20} color={colors.text} />
                            <ThemedText style={[styles.actionText, { color: colors.text }]}>Swap</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <ThemedText type="title3" style={styles.sectionTitle}>Assets</ThemedText>
                        {isLoading ? (
                            <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
                        ) : (
                            <View style={[styles.assetList, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                                {balances.map((item, index) => renderAsset(item, index))}
                            </View>
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>

            <Modal
                visible={isReceiveVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsReceiveVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalDismiss}
                        activeOpacity={1}
                        onPress={() => setIsReceiveVisible(false)}
                    />
                    <Animated.View
                        entering={SlideInUp.duration(400)}
                        style={[styles.modalContent, { backgroundColor: colors.background }]}
                    >
                        <View style={styles.modalHeader}>
                            <ThemedText type="title2">Receive Assets</ThemedText>
                            <TouchableOpacity onPress={() => setIsReceiveVisible(false)}>
                                <Ionicons name="close-circle" size={32} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.qrContainer}>
                            <View style={[styles.qrWrapper, { backgroundColor: '#FFF' }]}>
                                <QRCode
                                    data={smartAccountAddress || '0x0'}
                                    size={200}
                                />
                            </View>
                        </View>

                        <View style={styles.addressBox}>
                            <ThemedText color="secondary" style={styles.addressLabel}>Your Smart Account Address</ThemedText>
                            <TouchableOpacity
                                style={[styles.addressLabelContainer, { backgroundColor: colors.surface }]}
                                onPress={async () => {
                                    if (smartAccountAddress) {
                                        await Clipboard.setStringAsync(smartAccountAddress);
                                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    }
                                }}
                            >
                                <ThemedText numberOfLines={1} style={styles.addressText}>
                                    {smartAccountAddress || 'Fetching address...'}
                                </ThemedText>
                                <Ionicons name="copy-outline" size={20} color={smartAccountAddress ? colors.primary : colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <ThemedText color="secondary" style={styles.modalHint}>
                            Only send assets on the Avalanche network to this address.
                        </ThemedText>
                    </Animated.View>
                </View>
            </Modal>
        </UniformBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
    },
    totalAmount: {
        fontSize: 48,
        fontWeight: '800',
        marginTop: 8,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        height: 54,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        marginTop: 40,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    assetList: {
        padding: 4,
    },
    assetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    assetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tokenIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    assetRight: {
        alignItems: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 60,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    qrWrapper: {
        padding: 16,
        borderRadius: 24,
    },
    addressBox: {
        marginBottom: 24,
    },
    addressLabel: {
        marginBottom: 8,
        textAlign: 'center',
    },
    addressLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    modalHint: {
        textAlign: 'center',
        fontSize: 12,
        paddingHorizontal: 20,
    }
});
