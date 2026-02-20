import React from 'react';
import { View, Text, ViewProps, TextProps, StyleSheet } from 'react-native';
import { useGlobalTheme } from '../ThemeProvider';

interface ThemedViewProps extends ViewProps {
    variant?: 'primary' | 'secondary' | 'surface' | 'highlight' | 'transparent';
}

export const ThemedView: React.FC<ThemedViewProps> = ({
    style,
    variant = 'transparent',
    children,
    ...props
}) => {
    const { colors } = useGlobalTheme();

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary': return { backgroundColor: colors.background };
            case 'secondary': return { backgroundColor: colors.surface };
            case 'surface': return { backgroundColor: colors.surface };
            case 'highlight': return { backgroundColor: colors.surfaceSecondary };
            default: return {};
        }
    };

    return (
        <View style={[getVariantStyle(), style]} {...props}>
            {children}
        </View>
    );
};

interface ThemedTextProps extends TextProps {
    type?: 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'body' | 'callout' | 'subhead' | 'footnote' | 'caption1' | 'caption2';
    color?: 'primary' | 'secondary' | 'tertiary' | 'white' | 'success' | 'danger';
}

export const ThemedText: React.FC<ThemedTextProps> = ({
    style,
    type = 'body',
    color = 'primary',
    children,
    ...props
}) => {
    const { colors, typography } = useGlobalTheme();

    const getTextColor = () => {
        switch (color) {
            case 'secondary': return colors.textSecondary;
            case 'tertiary': return colors.textTertiary;
            case 'white': return '#FFFFFF';
            case 'success': return colors.success;
            case 'danger': return colors.danger;
            default: return colors.text;
        }
    };

    return (
        <Text
            style={[
                typography[type],
                { color: getTextColor() },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
