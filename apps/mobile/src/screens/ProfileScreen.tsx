import React from 'react';
import { View, StyleSheet, Switch, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrivy } from '@privy-io/expo';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { UniformBackground } from '@/components/ui/UniformBackground';

export default function ProfileScreen() {
    const { user, logout } = usePrivy();
    const { colors, spacing, borderRadius } = useGlobalTheme();
    const navigation = useNavigation();

    const getIdentity = () => {
        if (!user) return { name: 'Anonymous', identity: 'Not authenticated', picture: null };

        // Find best email/identifier
        const emailAccount = user.linked_accounts?.find(a => a.type === 'email' || (a as any).email) as any;
        const email = emailAccount?.address || emailAccount?.email || null;

        // Find best display name and picture
        const oauthAccount = user.linked_accounts?.find(a =>
            a.type === 'google_oauth' || a.type === 'discord_oauth' || a.type === 'apple_oauth' || a.type === 'github_oauth'
        ) as any;

        const name = oauthAccount?.name || oauthAccount?.username || 'Authenticated User';
        const picture = oauthAccount?.picture || oauthAccount?.avatar_url || null;

        return {
            name: name,
            identity: email || 'Secured by Privy',
            picture: picture
        };
    };

    const identity = getIdentity();

    const renderSettingRow = (icon: string, label: string, value?: string, showChevron = true) => (
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
            <View style={styles.rowLeft}>
                <Ionicons name={icon as any} size={22} color={colors.textSecondary} />
                <ThemedText style={styles.rowLabel}>{label}</ThemedText>
            </View>
            <View style={styles.rowRight}>
                {value && <ThemedText color="secondary" type="subhead">{value}</ThemedText>}
                {showChevron && <Ionicons name="chevron-forward" size={18} color={colors.textQuaternary} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <View style={[styles.avatar, { backgroundColor: colors.surfaceSecondary, overflow: 'hidden' }]}>
                            {identity.picture ? (
                                <Image source={{ uri: identity.picture }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons name="person" size={40} color={colors.textTertiary} />
                            )}
                        </View>
                        <ThemedText type="title1" style={styles.username}>{identity.name}</ThemedText>
                        <ThemedText color="secondary" type="footnote">{identity.identity}</ThemedText>
                    </View>

                    <View style={styles.section}>
                        <ThemedText color="secondary" type="caption1" style={styles.sectionLabel}>PREFERENCES</ThemedText>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            {renderSettingRow('notifications-outline', 'Notifications', 'On')}
                            {renderSettingRow('moon-outline', 'Appearance', 'System')}
                            {renderSettingRow('globe-outline', 'Language', 'English')}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText color="secondary" type="caption1" style={styles.sectionLabel}>SECURITY</ThemedText>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                            {renderSettingRow('shield-checkmark-outline', 'Passkey Login', 'Active')}
                            {renderSettingRow('lock-closed-outline', 'Privacy Policy')}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.logoutBtn, { backgroundColor: colors.surface, borderRadius: 16 }]}
                        onPress={logout}
                    >
                        <ThemedText style={{ color: colors.danger, fontWeight: '600' }}>Log Out</ThemedText>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
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
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    username: {
        fontWeight: '800',
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        marginLeft: 4,
        marginBottom: 8,
        fontWeight: '700',
    },
    card: {
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowLabel: {
        fontSize: 16,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoutBtn: {
        marginTop: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    }
});
