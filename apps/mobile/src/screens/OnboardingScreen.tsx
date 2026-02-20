import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TextInput, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleButton } from '@/components/ui/AppleButton';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { useLoginWithOAuth, useLoginWithEmail } from '@privy-io/expo';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { UniformBackground } from '@/components/ui/UniformBackground';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
    const { colors, spacing, typography } = useGlobalTheme();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loginStep, setLoginStep] = useState<'input' | 'otp'>('input');

    const { login: googleLogin } = useLoginWithOAuth({
        onSuccess: () => navigation.replace('MainTabs'),
    });

    const { sendCode, loginWithCode, state: emailState } = useLoginWithEmail({
        onLoginSuccess: () => navigation.replace('MainTabs'),
    });

    const handleGoogleLogin = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await googleLogin({ provider: 'google' });
    };

    const handleEmailAction = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (loginStep === 'input') {
            if (!email.includes('@')) return;
            await sendCode({ email });
            setLoginStep('otp');
        } else {
            await loginWithCode({ code: otp, email });
        }
    };

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.content}>

                        <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                            <Ionicons name="chatbubble-ellipses" size={48} color={colors.primary} />
                            <Text style={[styles.title, { color: colors.text, ...typography.largeTitle }]}>Chatsend</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary, ...typography.body }]}>
                                Pure finance. Simple conversation.
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeIn.delay(400)} style={styles.form}>
                            {loginStep === 'input' ? (
                                <>
                                    <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <TextInput
                                            style={[styles.input, { color: colors.text }]}
                                            placeholder="Enter your email"
                                            placeholderTextColor={colors.textTertiary}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <AppleButton
                                        title="Continue with Email"
                                        onPress={handleEmailAction}
                                        disabled={!email.includes('@')}
                                        loading={emailState.status === 'sending-code'}
                                    />

                                    <View style={styles.divider}>
                                        <View style={[styles.line, { backgroundColor: colors.border }]} />
                                        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or</Text>
                                        <View style={[styles.line, { backgroundColor: colors.border }]} />
                                    </View>

                                    <AppleButton
                                        title="Continue with Google"
                                        onPress={handleGoogleLogin}
                                        variant="secondary"
                                    />
                                </>
                            ) : (
                                <>
                                    <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <TextInput
                                            style={[styles.input, { color: colors.text, textAlign: 'center', fontSize: 24, fontWeight: '700' }]}
                                            placeholder="000000"
                                            placeholderTextColor={colors.textTertiary}
                                            value={otp}
                                            onChangeText={setOtp}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                        />
                                    </View>
                                    <AppleButton
                                        title="Verify Code"
                                        onPress={handleEmailAction}
                                        loading={emailState.status === 'submitting-code'}
                                    />
                                    <TouchableOpacity onPress={() => setLoginStep('input')} style={styles.backButton}>
                                        <Text style={{ color: colors.primary, ...typography.subhead }}>Back to email</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Animated.View>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </UniformBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        marginTop: 16,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        height: 58,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
        marginBottom: 16,
    },
    input: {
        fontSize: 17,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
    },
    backButton: {
        marginTop: 24,
        alignItems: 'center',
    }
});
