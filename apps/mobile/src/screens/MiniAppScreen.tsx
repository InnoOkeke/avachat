import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { GlassView } from '@/components/ui/GlassView';
import { MiniAppRuntime } from '../../components/MiniAppRuntime';
import { UniformBackground } from '@/components/ui/UniformBackground';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function MiniAppScreen({ route }: any) {
    const { url, title } = route.params || {};
    const appUrl = typeof url === 'string' ? url : '';
    const appTitle = typeof title === 'string' ? title : 'Mini-App';
    const navigation = useNavigation<any>();
    const { colors, spacing, borderRadius } = useGlobalTheme();

    return (
        <UniformBackground>
            <StatusBar barStyle={colors.tint === 'dark' ? 'light-content' : 'dark-content'} />
            <SafeAreaView style={styles.safeArea}>
                <GlassView style={styles.header} variant="thick" borderRadius={20}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={32} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <ThemedText style={styles.title} type="headline">{appTitle}</ThemedText>
                        <TouchableOpacity style={styles.optionsButton}>
                            <Ionicons name="ellipsis-horizontal" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </GlassView>

                <Animated.View entering={FadeIn.delay(300)} style={[styles.contentContainer, { borderRadius: borderRadius.l }]}>
                    {appUrl ? <MiniAppRuntime url={appUrl} /> : null}
                </Animated.View>
            </SafeAreaView>
        </UniformBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 64,
    },
    closeButton: {
        padding: 4,
    },
    optionsButton: {
        padding: 4,
    },
    title: {
        textAlign: 'center',
        flex: 1,
        fontWeight: '800',
    },
    contentContainer: {
        flex: 1,
        marginTop: 16,
        marginHorizontal: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginBottom: 12,
    },
});
