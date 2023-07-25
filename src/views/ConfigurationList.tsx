import React from "react";
import { Button, ScrollView, Text, View, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraStackParamList } from "../navigation/cameraStack";
import { get_config_components } from "./PastConfigsView";
import { Configuration } from "../redux/types";
type Props = NativeStackScreenProps<CameraStackParamList, "ConfigList">;

const ConfigListView = ({ navigation }: Props) => {
  let fields = get_config_components((config: Configuration) => {
    navigation.navigate("Camera", config);
  });

  return (
    <ScrollView style={styles.container}>
      <View>{fields}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default ConfigListView;
