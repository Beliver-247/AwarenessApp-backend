import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import EventsScreen from '../screens/EventsScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import VolunteerScreen from '../screens/VolunteerScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  Events: undefined;
  Challenges: undefined;
  Volunteer: undefined;
  Achievements: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Events':
              iconName = '📅';
              break;
            case 'Challenges':
              iconName = '🎯';
              break;
            case 'Volunteer':
              iconName = '🤝';
              break;
            case 'Achievements':
              iconName = '🏆';
              break;
            case 'Profile':
              iconName = '👤';
              break;
            default:
              iconName = '❓';
          }

          return (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: size, color }}>
                {iconName}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Events" 
        component={EventsScreen}
        options={{
          tabBarLabel: 'Events',
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{
          tabBarLabel: 'Challenges',
        }}
      />
      <Tab.Screen 
        name="Volunteer" 
        component={VolunteerScreen}
        options={{
          tabBarLabel: 'Volunteer',
        }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{
          tabBarLabel: 'Achievements',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

