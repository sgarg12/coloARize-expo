import { Camera, CameraType } from "expo-camera";
import * as GL from "expo-gl";
import { GLView } from "expo-gl";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  DefaultConfig,
  SimulatorRemapConfig,
  Configuration,
} from "../redux/types";
import { CameraStackParamList } from "../navigation/cameraStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { useDispatch } from "react-redux";
import { editDichromacyConfiguration } from "../redux/actions";
import {
  phi,
  applyShaders,
  initParams,
  updateParams,
} from "../rendering/renderHelpers";

type Props = NativeStackScreenProps<CameraStackParamList, "Camera">;

// See: https://github.com/expo/expo/pull/10229#discussion_r490961694
// eslint-disable-next-line @typescript-eslint/ban-types
const CameraView = ({ route, navigation }: Props) => {
  const title = "Expo.Camera integration";

  var _rafID: number = 0;
  var camera: Camera;
  var glView: GL.GLView;
  var texture: WebGLTexture;

  useEffect(() => {
    if (_rafID !== undefined) {
      cancelAnimationFrame(_rafID);
    }
  }, [_rafID]);

  async function createCameraTexture(): Promise<WebGLTexture> {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      throw new Error("Denied camera permissions!");
    }
    return glView!.createCameraTextureAsync(camera!);
  }

  const onContextCreate = async (gl: GL.ExpoWebGLRenderingContext) => {
    // Create texture asynchronously
    texture = await createCameraTexture();
    const cameraTexture = texture;

    const setRafID = (callback: () => number) => {
      _rafID = callback();
    };

    initParams(route.params);
    applyShaders(gl, cameraTexture, 1, setRafID);
  };

  const dispatch = useDispatch();

  const saveConfig = () => {
    var obj: Configuration;
    if (route.params.AlgorithmType === "Default") {
      obj = { ...(route.params as DefaultConfig), Phi: phi };
    } else {
      obj = { ...(route.params as SimulatorRemapConfig), Phi: phi };
    }
    dispatch(editDichromacyConfiguration(obj, route.params.Name));
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        type={CameraType.back}
        ref={(ref) => (camera = ref!)}
      />
      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        ref={(ref) => (glView = ref!)}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={saveConfig}>
          <Text>Save</Text>
        </TouchableOpacity>
        {route.params.AlgorithmType != "Simulation" && (
          <Slider
            style={{ width: 200, height: 40 }}
            step={0.01}
            minimumValue={0.1}
            maximumValue={1.0}
            value={route.params.Phi}
            onValueChange={(sliderValue) => {
              updateParams({ phi: sliderValue });
            }}
            minimumTrackTintColor="#C6ADFF"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#C6ADFF"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  buttons: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    height: 40,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CameraView;
