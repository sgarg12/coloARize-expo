import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from '../views/HomeView';
import React from 'react';
import QuizView from '../views/QuizView';
import CameraView from '../views/CameraView';
import ConfigStack from './configStack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faClipboardQuestion,
  faCamera,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

export const BottomTabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#6C2CFF',
        },
        headerStyle: {
          backgroundColor: '#6C2CFF',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        tabBarActiveBackgroundColor: '#C6ADFF',
      }}>
      <Tab.Screen
        name={'Quiz'}
        component={QuizView}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faClipboardQuestion} color={'#FFFFFF'} />
          ),
        }}
      />
      <Tab.Screen
        name={'Home'}
        component={HomeView}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faHouse} color={'#FFFFFF'} />
          ),
        }}
      />
      <Tab.Screen
        name={'Camera'}
        component={CameraView}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faCamera} color={'#FFFFFF'} />
          ),
        }}
      />
      <Tab.Screen
        name={'Configuration'}
        component={ConfigStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Config',
          tabBarIcon: () => <FontAwesomeIcon icon={faGear} color={'#FFFFFF'} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNav;
