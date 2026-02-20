import { useColorScheme } from 'react-native';

const palette = {
    white: '#FFFFFF',
    black: '#000000',
    gray1: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
    blue: '#007AFF',
};

export const Colors = {
    dark: {
        background: palette.black,
        surface: '#1C1C1E',
        surfaceSecondary: '#2C2C2E',
        surfaceTertiary: '#3A3A3C',

        primary: palette.blue,
        accent: palette.blue,

        text: palette.white,
        textSecondary: palette.gray1,
        textTertiary: palette.gray2,
        textQuaternary: 'rgba(255,255,255,0.15)',

        success: '#30D158',
        danger: '#FF453A',
        warning: '#FF9F0A',
        info: '#64D2FF',

        border: 'rgba(255, 255, 255, 0.1)',
        separator: 'rgba(255, 255, 255, 0.08)',
        icon: palette.white,

        material: 'rgba(28, 28, 30, 0.8)',
        materialThin: 'rgba(28, 28, 30, 0.5)',
        materialThick: 'rgba(28, 28, 30, 0.95)',

        tint: 'dark' as const,
    },
    light: {
        background: '#FFFFFF',
        surface: '#F2F2F7',
        surfaceSecondary: '#E5E5EA',
        surfaceTertiary: '#D1D1D6',

        primary: palette.blue,
        accent: palette.blue,

        text: palette.black,
        textSecondary: palette.gray1,
        textTertiary: palette.gray2,
        textQuaternary: 'rgba(0,0,0,0.15)',

        success: '#34C759',
        danger: '#FF3B30',
        warning: '#FF9500',
        info: '#5AC8FA',

        border: 'rgba(0, 0, 0, 0.05)',
        separator: 'rgba(0, 0, 0, 0.05)',
        icon: palette.black,

        material: 'rgba(255, 255, 255, 0.8)',
        materialThin: 'rgba(255, 255, 255, 0.5)',
        materialThick: 'rgba(255, 255, 255, 0.95)',

        tint: 'light' as const,
    }
};

export const Gradients = {
    primary: [palette.blue, '#0A84FF'],
    surface: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)'],
} as const;

export const Shadows = {
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
};

export const Spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    screenPadding: 20,
} as const;

export const BorderRadius = {
    xs: 6,
    s: 10,
    m: 14,
    l: 20,
    xl: 28,
    full: 999,
} as const;

export const Typography = {
    largeTitle: {
        fontSize: 34,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
        lineHeight: 41,
    },
    title1: {
        fontSize: 28,
        fontWeight: '700' as const,
        letterSpacing: -0.4,
        lineHeight: 34,
    },
    title2: {
        fontSize: 22,
        fontWeight: '600' as const,
        letterSpacing: -0.3,
        lineHeight: 28,
    },
    title3: {
        fontSize: 20,
        fontWeight: '600' as const,
        letterSpacing: -0.2,
        lineHeight: 25,
    },
    headline: {
        fontSize: 17,
        fontWeight: '600' as const,
        letterSpacing: -0.4,
        lineHeight: 22,
    },
    body: {
        fontSize: 17,
        fontWeight: '400' as const,
        letterSpacing: -0.4,
        lineHeight: 22,
    },
    callout: {
        fontSize: 16,
        fontWeight: '400' as const,
        letterSpacing: -0.3,
        lineHeight: 21,
    },
    subhead: {
        fontSize: 15,
        fontWeight: '400' as const,
        letterSpacing: -0.2,
        lineHeight: 20,
    },
    footnote: {
        fontSize: 13,
        fontWeight: '400' as const,
        letterSpacing: -0.1,
        lineHeight: 18,
    },
    caption1: {
        fontSize: 12,
        fontWeight: '400' as const,
        letterSpacing: 0,
        lineHeight: 16,
    },
    caption2: {
        fontSize: 11,
        fontWeight: '400' as const,
        letterSpacing: 0,
        lineHeight: 13,
    },
} as const;

export type ThemeColors = typeof Colors.dark | typeof Colors.light;

export interface Theme {
    colors: ThemeColors;
    spacing: typeof Spacing;
    borderRadius: typeof BorderRadius;
    typography: typeof Typography;
    gradients: typeof Gradients;
    shadows: typeof Shadows;
}

export function useTheme() {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    return {
        colors,
        spacing: Spacing,
        borderRadius: BorderRadius,
        typography: Typography,
        gradients: Gradients,
        shadows: Shadows,
        isDark,
    };
}
