import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeView from "../views/HomeView";
import React from "react";
import QuizView from "../views/QuizView";
import CameraView from "../views/CameraView";
import ConfigStack from "./configStack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faClipboardQuestion,
  faCamera,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import CameraStack from "./cameraStack";
import { DeviceConnectDisconnectTestScreen } from "../views/BLEView";

const Tab = createBottomTabNavigator();

export const BottomTabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarStyle: {
          backgroundColor: "#6C2CFF",
        },
        headerStyle: {
          backgroundColor: "#6C2CFF",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#FFFFFF",
        },
        tabBarActiveBackgroundColor: "#C6ADFF",
      }}
    >
      <Tab.Screen
        name={"Quiz"}
        component={QuizView}
        options={{
          tabBarLabel: "Quiz",
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faClipboardQuestion} color={"#FFFFFF"} />
          ),
        }}
      />
      <Tab.Screen
        name={"Home"}
        component={HomeView}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faHouse} color={"#FFFFFF"} />
          ),
        }}
      />
      <Tab.Screen
        name={"CameraStack"}
        component={CameraStack}
        options={{
          headerShown: false,
          tabBarLabel: "Camera",
          tabBarIcon: () => (
            <FontAwesomeIcon icon={faCamera} color={"#FFFFFF"} />
          ),
        }}
      />
      <Tab.Screen
        name={"Configuration"}
        component={ConfigStack}
        options={{
          headerShown: false,
          tabBarLabel: "Config",
          tabBarIcon: () => <FontAwesomeIcon icon={faGear} color={"#FFFFFF"} />,
        }}
      />
      <Tab.Screen
        name={"DEVICE_CONNECT_DISCONNECT_TEST_SCREEN"}
        component={DeviceConnectDisconnectTestScreen}
        options={{
          headerShown: false,
          tabBarLabel: "BLE",
          tabBarIcon: () => <FontAwesomeIcon icon={faGear} color={"#FFFFFF"} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNav;
