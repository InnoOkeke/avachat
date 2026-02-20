import React, { useState } from 'react';
import { View, StyleSheet, Image, StatusBar, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useGlobalTheme } from '@/components/ThemeProvider';
import { ThemedText } from '@/components/ui/ThemedComponents';
import { Ionicons } from '@expo/vector-icons';
import { UniformBackground } from '@/components/ui/UniformBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'DeFi', 'Games', 'Social', 'Tools'];

const APPS = [
    { id: '1', name: 'TraderJoe', description: 'Trade tokens on Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', url: 'https://traderjoexyz.com', category: 'DeFi' },
    { id: '2', name: 'Aave V3', description: 'Earn yield on your assets', icon: 'https://cryptologos.cc/logos/aave-aave-logo.png', url: 'https://app.aave.com', category: 'DeFi' },
    { id: '3', name: 'MoonDog', description: 'Launch tokens instantly', icon: 'https://img.icons8.com/color/48/rocket.png', url: 'https://moondog.fun', category: 'Social' },
    { id: '4', name: 'Uniswap', description: 'Swap anything', icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', url: 'https://app.uniswap.org', category: 'DeFi' },
];

export default function AppsScreen() {
    const { colors, spacing, borderRadius } = useGlobalTheme();
    const navigation = useNavigation<any>();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredApps = selectedCategory === 'All'
        ? APPS
        : APPS.filter(app => app.category === selectedCategory);

    const openApp = (url: string, title: string) => {
        navigation.navigate('MiniApp', { url, title });
    };

    return (
        <UniformBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <ThemedText type="largeTitle">Discover</ThemedText>
                </View>

                <View style={styles.categories}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    { backgroundColor: selectedCategory === cat ? colors.primary : colors.surface }
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <ThemedText style={{ color: selectedCategory === cat ? '#FFF' : colors.text }}>{cat}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.listContent}>
                    {filteredApps.map((item, index) => (
                        <Animated.View key={item.id} entering={FadeInDown.delay(index * 50)}>
                            <TouchableOpacity
                                style={[styles.appRow, { backgroundColor: colors.surface, borderRadius: 16 }]}
                                onPress={() => openApp(item.url, item.name)}
                            >
                                <Image source={{ uri: item.icon }} style={styles.appIcon} />
                                <View style={styles.appInfo}>
                                    <ThemedText type="headline">{item.name}</ThemedText>
                                    <ThemedText color="secondary" type="footnote">{item.description}</ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textQuaternary} />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </UniformBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    categories: {
        marginBottom: 20,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
        gap: 12,
    },
    appRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    appIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 16,
    },
    appInfo: {
        flex: 1,
    }
});
