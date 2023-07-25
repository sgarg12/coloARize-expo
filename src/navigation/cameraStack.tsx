import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { Configuration, DichromacyType } from "../redux/types";
import ConfigListView from "../views/ConfigurationList";
import CameraView from "../views/CameraView";

export type CameraStackParamList = {
  ConfigList: undefined;
  Camera: Configuration;
};

const Stack = createNativeStackNavigator<CameraStackParamList>();

export default function CameraStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={"ConfigList"}
        component={ConfigListView}
        options={{
          title: "Choose Configuration",
        }}
      />
      <Stack.Screen
        name={"Camera"}
        component={CameraView}
        options={{
          title: "Camera",
        }}
      />
    </Stack.Navigator>
  );
}

const screenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: "#6C2CFF",
    // backgroundColor: '#ff0000',
  },
  headerTitleAlign: "center",
  headerTitleStyle: {
    color: "#FFFFFF",
  },
  headerTintColor: "#FFFFFF",
  headerBackTitleVisible: false,
};
