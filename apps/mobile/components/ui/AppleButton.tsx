import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useTheme } from '@/constants/Theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

export const AppleButton: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style
}) => {
    const theme = useTheme();
    const scale = useRef(new Animated.Value(1)).current;

    const isDark = theme.colors.tint === 'dark';

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const getBackgroundColor = () => {
        if (disabled) return isDark ? 'rgba(255,255,255,0.05)' : '#F2F2F7';
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return isDark ? 'rgba(255,255,255,0.1)' : '#F2F2F7';
            case 'glass': return 'rgba(255,255,255,0.1)';
            case 'ghost': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textQuaternary;
        if (variant === 'primary') return '#FFFFFF';
        return theme.colors.text;
    };

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }] }, style]}>
            <TouchableOpacity
                style={[
                    styles.container,
                    { backgroundColor: getBackgroundColor() }
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={1}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <Text style={[styles.text, { color: getTextColor(), ...theme.typography.headline }]}>
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    text: {
        fontWeight: '600',
    }
});
