import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, color, size }: { name: IconName; color: ColorValue; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Kho hàng',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'cube' : 'cube-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'receipt' : 'receipt-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
