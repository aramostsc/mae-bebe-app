import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { loadProfiles } from './src/services/profileService';
import { colors } from './src/theme';
import { AppProfiles } from './src/types';

export default function App() {
  const [profiles, setProfiles] = useState<AppProfiles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles()
      .then((savedProfiles) => setProfiles(savedProfiles))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        {profiles ? (
          <AppNavigator profiles={profiles} onProfilesChange={setProfiles} />
        ) : (
          <OnboardingScreen onComplete={setProfiles} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
