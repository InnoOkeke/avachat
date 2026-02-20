import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { Ionicons } from '@expo/vector-icons';
import { UniformBackground } from '@/components/ui/UniformBackground';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function TokenDetailScreen() {
    const { colors, spacing, typography } = useGlobalTheme();
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { token } = route.params;

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={[styles.navbar, { paddingHorizontal: spacing.l }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText type="title3">{token.symbol} Details</ThemedText>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Animated.View entering={FadeInUp.springify()} style={styles.header}>
                        <Image source={{ uri: token.logo }} style={styles.tokenIcon} />
                        <ThemedText style={styles.price}>${parseFloat(token.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</ThemedText>
                        <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                            <ThemedText style={{ color: colors.success, fontWeight: '700' }}>{token.change24h || '+2.5%'}</ThemedText>
                        </View>
                    </Animated.View>

                    <View style={styles.statsGrid}>
                        <View style={[styles.statItem, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            <ThemedText color="secondary" type="caption1">MARKET CAP</ThemedText>
                            <ThemedText type="headline">
                                {token.symbol === 'AVAX' ? '$12.4B' : token.symbol === 'USDC' ? '$34.1B' : '$85.2B'}
                            </ThemedText>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            <ThemedText color="secondary" type="caption1">VOLUME (24H)</ThemedText>
                            <ThemedText type="headline">
                                {token.symbol === 'AVAX' ? '$450M' : token.symbol === 'USDC' ? '$1.2B' : '$2.5B'}
                            </ThemedText>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            <ThemedText color="secondary" type="caption1">MAX SUPPLY</ThemedText>
                            <ThemedText type="headline">
                                {token.symbol === 'AVAX' ? '720M' : token.symbol === 'USDC' ? 'Infinite' : 'Infinite'} {token.symbol !== 'Infinite' ? token.symbol : ''}
                            </ThemedText>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            <ThemedText color="secondary" type="caption1">ALL TIME HIGH</ThemedText>
                            <ThemedText type="headline">
                                {token.symbol === 'AVAX' ? '$146.22' : token.symbol === 'USDC' ? '$1.03' : '$1.21'}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText type="title3" style={styles.sectionTitle}>About {token.name}</ThemedText>
                        <ThemedText color="secondary" style={styles.description}>
                            {token.symbol === 'AVAX' ?
                                "Avalanche (AVAX) is the native token of the Avalanche platform and is used to secure the network through staking, pay for network fees, and provide a basic unit of account between subnets." :
                                token.symbol === 'USDC' ?
                                    "USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar and runs on several blockchains, providing a stable medium of exchange for DeFi." :
                                    token.symbol === 'USDT' ?
                                        "Tether (USDT) is a stablecoin mirrored to the value of the US dollar. It is widely used for trading and as a stable store of value in the crypto ecosystem." :
                                        `${token.name} (${token.symbol}) is an asset on the Avalanche network. You can use it for various DeFi activities including trading, lending, and payments.`
                            }
                        </ThemedText>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.primaryAction, { backgroundColor: colors.primary }]}
                            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                        >
                            <ThemedText style={styles.actionLabel}>Buy {token.symbol}</ThemedText>
                        </TouchableOpacity>
                        <View style={styles.secondaryActions}>
                            <TouchableOpacity style={[styles.secondaryAction, { backgroundColor: colors.surface }]} onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Home', params: { presetText: `Swap ${token.symbol} for ` } })}>
                                <Ionicons name="swap-horizontal" size={20} color={colors.text} />
                                <ThemedText>Swap</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.secondaryAction, { backgroundColor: colors.surface }]} onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Home', params: { presetText: `Send ${token.symbol} to ` } })}>
                                <Ionicons name="paper-plane-outline" size={20} color={colors.text} />
                                <ThemedText>Send</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </UniformBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    tokenIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 20,
    },
    price: {
        fontSize: 40,
        fontWeight: '800',
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 40,
    },
    statItem: {
        width: (width - 52) / 2,
        padding: 16,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    description: {
        lineHeight: 22,
        fontSize: 15,
    },
    actions: {
        gap: 12,
    },
    primaryAction: {
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryAction: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    }
});
