import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
    Home: undefined;
    Wallet: undefined;
    Apps: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    MiniApp: undefined;
    TokenDetail: { token: any };
};
