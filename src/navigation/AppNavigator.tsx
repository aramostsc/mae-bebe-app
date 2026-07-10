import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { AppProfiles, MainTabParamList, RootStackParamList } from '../types';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { PlansScreen } from '../screens/PlansScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

type Props = {
  profiles: AppProfiles;
  onProfilesChange: (profiles: AppProfiles | null) => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs({ profiles, onProfilesChange }: Props) {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { borderTopColor: colors.border, height: 62, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen name="Dashboard" options={{ title: 'Início' }}>
        {() => <DashboardScreen profiles={profiles} />}
      </Tabs.Screen>
      <Tabs.Screen name="Plans" options={{ title: 'Planos' }}>
        {() => <PlansScreen profiles={profiles} />}
      </Tabs.Screen>
      <Tabs.Screen name="Calendar" options={{ title: 'Agenda' }}>
        {() => <CalendarScreen baby={profiles.baby} />}
      </Tabs.Screen>
      <Tabs.Screen name="Memories" options={{ title: 'Memórias' }}>
        {() => <GalleryScreen baby={profiles.baby} />}
      </Tabs.Screen>
      <Tabs.Screen name="Settings" options={{ title: 'Definições' }}>
        {() => <SettingsScreen profiles={profiles} onProfilesChange={onProfilesChange} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export function AppNavigator(props: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">{() => <MainTabs {...props} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
