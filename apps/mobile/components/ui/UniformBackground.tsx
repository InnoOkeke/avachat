import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalTheme } from '@/components/ThemeProvider';

interface UniformBackgroundProps {
    children: React.ReactNode;
}

export const UniformBackground: React.FC<UniformBackgroundProps> = ({ children }) => {
    const { colors } = useGlobalTheme();
    const isDark = colors.tint === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Deep Layered Gradient for Premium Depth */}
            <LinearGradient
                colors={isDark ? ['#010101', '#121214', '#1C1C1E'] : ['#F2F2F7', '#E5E5EA', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Subtle Overlay for specularity */}
            <LinearGradient
                colors={isDark ? ['rgba(10, 132, 255, 0.03)', 'transparent'] : ['rgba(0, 122, 255, 0.02)', 'transparent']}
                style={StyleSheet.absoluteFill}
            />

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
