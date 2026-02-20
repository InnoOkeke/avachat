import React from 'react';
import { StyleSheet, ViewStyle, View, Platform } from 'react-native';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { BlurView } from 'expo-blur';

interface GlassProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    variant?: 'clear' | 'normal' | 'thick';
    borderRadius?: number;
}

export const GlassView: React.FC<GlassProps> = ({
    children,
    style,
    intensity,
    variant = 'normal',
    borderRadius: customRadius
}) => {
    const { colors, borderRadius: themeRadius } = useGlobalTheme();
    const isDark = colors.tint === 'dark';

    const getIntensity = () => {
        if (intensity !== undefined) return intensity;
        return Platform.OS === 'ios' ? 40 : 80;
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? 'rgba(28, 28, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: colors.border,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: customRadius ?? themeRadius.m,
            },
            style
        ]}>
            <BlurView
                intensity={getIntensity()}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    }
});
