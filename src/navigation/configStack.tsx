import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import PastConfigsView from "../views/PastConfigsView";
import DichromacySelectionView from "../views/DichromacySelectionView";
import ConfigurationView from "../views/ConfigurationView";
import { AlgorithmType, Configuration, DichromacyType } from "../redux/types";

export type RootStackParamList = {
  PastConfigs: undefined;
  DichromacySelection: undefined;
  Config: {
    dichromacy_type: DichromacyType;
    algorithm_type: AlgorithmType;
    config: Configuration | null;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ConfigStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={"PastConfigs"}
        component={PastConfigsView}
        options={{
          title: "Saved Configs",
        }}
      />
      <Stack.Screen
        name={"DichromacySelection"}
        component={DichromacySelectionView}
        options={{
          title: "Create New Config",
        }}
      />
      <Stack.Screen
        name={"Config"}
        component={ConfigurationView}
        options={{
          title: "Adjust Config",
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
};
