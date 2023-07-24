import React from "react";
import { Button, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraStackParamList } from "../navigation/cameraStack";

type Props = NativeStackScreenProps<CameraStackParamList, "ConfigList">;

const ConfigListView = ({ navigation }: Props) => {
  const goToScreen = () => {
    navigation.navigate("Camera", {
      Name: "test",
      DichromacyType: "Deuteranopia",
      AlgorithmType: "Default",
      Parameters: { Phi: 0.45, HueShift: 1 },
    });
  };

  return (
    <>
      <Text>Configurations</Text>
      <Button onPress={goToScreen} title="Test config" />
    </>
  );
};

export default ConfigListView;
