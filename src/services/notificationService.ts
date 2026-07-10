import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleLocalReminder(title: string, body: string, date: Date) {
  const granted = await requestNotificationPermission();
  if (!granted) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date,
  });
}
