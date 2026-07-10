import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { AppProfiles, MainTabParamList, RootStackParamList } from '../types';
import { BabyFoodScreen } from '../screens/BabyFoodScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { MotherNutritionScreen } from '../screens/MotherNutritionScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { TrainingScreen } from '../screens/TrainingScreen';

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
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { borderTopColor: colors.border, height: 62, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen name="Dashboard" options={{ title: 'Início' }}>
        {() => <DashboardScreen profiles={profiles} />}
      </Tabs.Screen>
      <Tabs.Screen name="Treino">{() => <TrainingScreen profiles={profiles} />}</Tabs.Screen>
      <Tabs.Screen name="Mae" options={{ title: 'Mãe' }}>
        {() => <MotherNutritionScreen profiles={profiles} />}
      </Tabs.Screen>
      <Tabs.Screen name="Bebe" options={{ title: 'Bebé' }}>
        {() => <BabyFoodScreen profiles={profiles} />}
      </Tabs.Screen>
      <Tabs.Screen name="Calendario" options={{ title: 'Agenda' }}>
        {() => <CalendarScreen baby={profiles.baby} />}
      </Tabs.Screen>
      <Tabs.Screen name="Galeria">{() => <GalleryScreen baby={profiles.baby} />}</Tabs.Screen>
      <Tabs.Screen name="Dicas" component={TipsScreen} />
      <Tabs.Screen name="Definicoes" options={{ title: 'Definições' }}>
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
