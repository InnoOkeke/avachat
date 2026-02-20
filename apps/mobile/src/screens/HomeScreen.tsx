import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSmartAccount } from '@/components/SmartAccountProvider';
import { TransactionService } from '@/services/TransactionService';
import { UniformBackground } from '@/components/ui/UniformBackground';
import { GlassView } from '@/components/ui/GlassView';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    Easing
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
}

const QUICK_ACTIONS = [
    { label: 'Check Balance', icon: 'wallet-outline' },
    { label: 'Send 10 AVAX', icon: 'paper-plane-outline' },
    { label: 'Swap to USDC', icon: 'swap-horizontal-outline' },
];

const TypingIndicator = () => {
    const { colors } = useGlobalTheme();
    const dot1 = useSharedValue(0.4);
    const dot2 = useSharedValue(0.4);
    const dot3 = useSharedValue(0.4);

    useEffect(() => {
        const config = { duration: 600, easing: Easing.inOut(Easing.sin) };
        dot1.value = withRepeat(withSequence(withTiming(1, config), withTiming(0.4, config)), -1, true);
        setTimeout(() => {
            dot2.value = withRepeat(withSequence(withTiming(1, config), withTiming(0.4, config)), -1, true);
        }, 200);
        setTimeout(() => {
            dot3.value = withRepeat(withSequence(withTiming(1, config), withTiming(0.4, config)), -1, true);
        }, 400);
    }, []);

    const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value }] }));
    const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value }] }));
    const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value }] }));

    return (
        <View style={styles.typingContainer}>
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dotStyle1]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dotStyle2]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dotStyle3]} />
        </View>
    );
};

export default function HomeScreen({ route }: any) {
    const { colors, typography, borderRadius } = useGlobalTheme();
    const { smartAccountAddress } = useSmartAccount();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hey there! I can help you send funds, swap tokens, or check your balance. What would you like to do?', sender: 'bot', timestamp: Date.now() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<any>(null);

    useEffect(() => {
        if (route.params?.presetText) {
            setInputText(route.params.presetText);
        }
    }, [route.params?.presetText]);

    const handleSend = async (overrideText?: string) => {
        const text = overrideText || inputText;
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        if (!overrideText) setInputText('');
        setIsTyping(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            const response = await TransactionService.processNaturalLanguage(text, smartAccountAddress);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'bot',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Processing error:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <Animated.View
                entering={SlideInDown.springify().damping(15).stiffness(100)}
                style={[
                    styles.messageWrapper,
                    isUser ? styles.userWrapper : styles.botWrapper
                ]}
            >
                <View style={[
                    styles.bubble,
                    isUser
                        ? [styles.userBubble, { backgroundColor: colors.primary }]
                        : [styles.botBubble, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]
                ]}>
                    <ThemedText style={[styles.text, { color: isUser ? '#FFF' : colors.text }]}>{item.text}</ThemedText>

                    {/* Organic Tail */}
                    <View style={[styles.tail, isUser ? styles.userTail : styles.botTail]}>
                        <Svg width={16} height={16} viewBox="0 0 16 16">
                            <Path
                                d={isUser ? "M0 0 L16 16 L16 0 Z" : "M16 0 L0 16 L0 0 Z"}
                                fill={isUser ? colors.primary : colors.surface}
                            />
                            {!isUser && (
                                <Path
                                    d="M16 0 L0 16 L0 0"
                                    fill="none"
                                    stroke={colors.border}
                                    strokeWidth={1}
                                />
                            )}
                        </Svg>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <ThemedText type="headline" style={styles.headerTitle}>Chatsend</ThemedText>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                        <ThemedText color="secondary" type="caption1">Financial AI Active</ThemedText>
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex1}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <Animated.FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        itemLayoutAnimation={Layout.springify()}
                        ListFooterComponent={isTyping ? (
                            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.typingWrapper}>
                                <TypingIndicator />
                            </Animated.View>
                        ) : null}
                    />

                    <View style={styles.bottomArea}>
                        {/* Quick Actions Scroll */}
                        {messages.length < 5 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.quickActionsScroll}
                            >
                                {QUICK_ACTIONS.map((action, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => handleSend(action.label)}
                                        style={[styles.quickActionChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    >
                                        <Ionicons name={action.icon as any} size={14} color={colors.primary} />
                                        <ThemedText type="caption1" style={styles.quickActionText}>{action.label}</ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}

                        <GlassView style={styles.inputContainer} intensity={30} variant="clear">
                            <View style={[styles.inputWrapper, { backgroundColor: colors.tint === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Message AvaChat..."
                                    placeholderTextColor={colors.textTertiary}
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                    maxLength={400}
                                />
                                {inputText.length > 0 && (
                                    <TouchableOpacity onPress={() => setInputText('')} style={styles.clearBtn}>
                                        <Ionicons name="close-circle" size={18} color={colors.textQuaternary} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleSend()}
                                    style={[styles.sendButton, { backgroundColor: inputText.length > 0 ? colors.primary : colors.surfaceSecondary }]}
                                    disabled={inputText.length === 0 && !isTyping}
                                >
                                    {isTyping ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Ionicons name="arrow-up" size={20} color={inputText.length > 0 ? "#FFF" : colors.textTertiary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </GlassView>
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
    flex1: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    messageWrapper: {
        marginBottom: 20,
        maxWidth: '82%',
    },
    userWrapper: {
        alignSelf: 'flex-end',
    },
    botWrapper: {
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: 14,
        paddingHorizontal: 16,
        borderRadius: 22,
        position: 'relative',
    },
    userBubble: {
        borderBottomRightRadius: 2,
    },
    botBubble: {
        borderBottomLeftRadius: 2,
    },
    tail: {
        position: 'absolute',
        bottom: 0,
        width: 16,
        height: 16,
    },
    userTail: {
        right: -8,
        bottom: 0,
    },
    botTail: {
        left: -8,
        bottom: -1,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
    },
    typingWrapper: {
        alignSelf: 'flex-start',
        marginLeft: 16,
        marginBottom: 20,
    },
    typingContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'rgba(28, 28, 30, 0.4)',
        borderRadius: 20,
        gap: 4,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    bottomArea: {
        paddingBottom: Platform.OS === 'ios' ? 100 : 95,
    },
    quickActionsScroll: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 10,
    },
    quickActionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        borderWidth: 1,
        gap: 6,
    },
    quickActionText: {
        fontWeight: '600',
    },
    inputContainer: {
        marginHorizontal: 16,
        padding: 6,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 26,
        paddingLeft: 16,
        paddingRight: 6,
        paddingVertical: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
        maxHeight: 120,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    },
    clearBtn: {
        padding: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    }
});
