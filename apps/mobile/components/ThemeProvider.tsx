import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Gradients, Shadows, Theme } from '../constants/Theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scheme = useColorScheme();

    const theme = useMemo(() => {
        const colors = scheme === 'dark' ? Colors.dark : Colors.light;
        return {
            colors,
            spacing: Spacing,
            borderRadius: BorderRadius,
            typography: Typography,
            gradients: Gradients,
            shadows: Shadows,
        };
    }, [scheme]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useGlobalTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useGlobalTheme must be used within a ThemeProvider');
    }
    return context;
};
