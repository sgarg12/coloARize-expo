import { Camera, CameraType } from "expo-camera";
import * as GL from "expo-gl";
import { GLView } from "expo-gl";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  DefaultConfig,
  SimulatorConfig,
  SimulatorRemapConfig,
  Configuration,
} from "../redux/types";
import { CameraStackParamList } from "../navigation/cameraStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { useDispatch } from "react-redux";
import { editDichromacyConfiguration } from "../redux/actions";

const vertShaderSource = `#version 300 es
precision highp float;

in vec2 position;
out vec2 uv;

void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;

const fragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D cameraTexture;
uniform float hue_shift;
uniform float phi;
uniform int simType;
uniform float severity;
in vec2 uv;
out vec4 fragColor;

vec3 simColourBlind(int simType, vec3 rgb, float severity) {
  if (simType < 1 || simType > 3) {
    return rgb;
  }

  float one_minus_severity = (abs(severity - 1.0f) <= 1e-5f) ? 0.0f : 1.0f - severity;

  mat3 xyz_from_rgb = mat3(
    40.9568 / 100.0, 21.3389 / 100.0, 1.86297 / 100.0,
    35.5041 / 100.0, 70.6743 / 100.0,  11.462 / 100.0,
    17.9167 / 100.0,  7.9868 / 100.0, 91.2367 / 100.0
  );

  mat3 rgb_from_xyz = inverse(xyz_from_rgb);

  mat3 lms_from_xyz = mat3(
     0.15514, -0.15514,     0.0,
     0.54312,  0.45684,     0.0,
    -0.03286,  0.03286, 0.01608
  );

  mat3 xyz_from_lms = inverse(lms_from_xyz);

  mat3 protan = mat3(
         one_minus_severity, 0.0, 0.0,
     severity * 2.02344377f, 1.0, 0.0,
    severity * -2.52580405f, 0.0, 1.0
  );

  mat3 deutan = mat3(
    1.0, severity * 0.49420696f, 0.0,
    0.0,     one_minus_severity, 0.0,
    0.0, severity * 1.24826995f, 1.0
  );

  mat3 tritan = mat3(
    1.0, 0.0, severity * -0.01224491f,
    0.0, 1.0,  severity * 0.07203435f,
    0.0, 0.0,      one_minus_severity
  );

  mat3 simMatrix = lms_from_xyz * xyz_from_rgb;

  switch(simType) {
  case 1:
    simMatrix = protan * simMatrix;
    break;
  case 2:
    simMatrix = deutan * simMatrix;
    break;
  case 3:
    simMatrix = tritan * simMatrix;
    break;
  default:
    break;
  }

  simMatrix = rgb_from_xyz * xyz_from_lms * simMatrix;

  return simMatrix * rgb;
}

vec3 rgb_to_hsv(vec3 rgb) {
  vec3 hsv;
  float min, max, delta;

  min = rgb[0] < rgb[1] ? rgb[0] : rgb[1];
  min = min < rgb[2] ? min : rgb[2];

  max = rgb[0] > rgb[1] ? rgb[0] : rgb[1];
  max = max > rgb[2] ? max : rgb[2];

  hsv[2] = max; // v
  delta = max - min;
  if (delta < 0.00001) {
    hsv[1] = 0.0;
    hsv[0] = 0.0; // undefined, maybe nan?
    return hsv;
  }
  if (max > 0.0) { // NOTE: if Max is == 0, this divide would cause a crash
    hsv[1] = (delta / max); // s
  } else {
    // if max is 0, then r = g = b = 0
    // s = 0, h is undefined
    hsv[1] = 0.0;
    hsv[0] = 1.0 / 0.0; // its now undefined
    return hsv;
  }
  if (rgb[0] >= max) // > is bogus, just keeps compilor happy
    hsv[0] = (rgb[1] - rgb[2]) / delta; // between yellow & magenta
  else if (rgb[1] >= max)
    hsv[0] = 2.0 + (rgb[2] - rgb[0]) / delta; // between cyan & yellow
  else
    hsv[0] = 4.0 + (rgb[0] - rgb[1]) / delta; // between magenta & cyan

  hsv[0] *= 60.0; // degrees

  if (hsv[0] < 0.0)
    hsv[0] += 360.0;

  return hsv;
}

vec3 hsv_to_rgb(vec3 hsv) {
  float hh, p, q, t, ff;
  int i;
  vec3 rgb;

  if (hsv[1] <= 0.0) { // < is bogus, just shuts up warnings
    rgb[0] = hsv[2];
    rgb[1] = hsv[2];
    rgb[2] = hsv[2];
    return rgb;
  }
  hh = hsv[0];
  if (hh >= 360.0)
    hh = 0.0;
  hh /= 60.0;
  i = int(hh);
  ff = hh - float(i);
  p = hsv[2] * (1.0 - hsv[1]);
  q = hsv[2] * (1.0 - (hsv[1] * ff));
  t = hsv[2] * (1.0 - (hsv[1] * (1.0 - ff)));

  switch (i) {
  case 0:
    rgb[0] = hsv[2];
    rgb[1] = t;
    rgb[2] = p;
    break;
  case 1:
    rgb[0] = q;
    rgb[1] = hsv[2];
    rgb[2] = p;
    break;
  case 2:
    rgb[0] = p;
    rgb[1] = hsv[2];
    rgb[2] = t;
    break;
  case 3:
    rgb[0] = p;
    rgb[1] = q;
    rgb[2] = hsv[2];
    break;
  case 4:
    rgb[0] = t;
    rgb[1] = p;
    rgb[2] = hsv[2];
    break;
  case 5:
  default:
    rgb[0] = hsv[2];
    rgb[1] = p;
    rgb[2] = q;
    break;
  }

  return rgb;
}

vec3 remapColour(vec3 rgb, float hue_shift, float phi) {
  vec3 hsv = rgb_to_hsv(rgb);
  float new_hue = hsv[0] / 360.0;

  // // remap hue
  new_hue = new_hue + hue_shift / 360.0;
  new_hue = new_hue - floor(new_hue);
  new_hue = pow(new_hue, phi);
  new_hue = new_hue + 1.0f - hue_shift / 360.0;
  new_hue = new_hue - floor(new_hue);

  hsv[0] = new_hue * 360.0f;
  vec3 fixed_rgb = hsv_to_rgb(hsv);

  return fixed_rgb;
}

void main() {
  vec3 rgb = texture(cameraTexture, uv).rgb;

  // other possible in parameters
  float hue_min = 0.0;
  float hue_max = 150.0;
  float phi_min = 0.3;
  float phi_max = 0.9;

  vec3 fixed_rgb = remapColour(rgb, hue_shift, phi);

  fragColor = vec4(simColourBlind(simType, fixed_rgb, severity), 1.0);
}`;

type Props = NativeStackScreenProps<CameraStackParamList, "Camera">;

// See: https://github.com/expo/expo/pull/10229#discussion_r490961694
// eslint-disable-next-line @typescript-eslint/ban-types
const CameraView = ({ route, navigation }: Props) => {
  const title = "Expo.Camera integration";

  var _rafID: number = 0;
  var camera: Camera;
  var glView: GL.GLView;
  var texture: WebGLTexture;
  var phi: Float = 1.0;
  var hue: Float = 0.0;
  var simType: number = 0;
  var severity: Float = 0.9;

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

  function initParams() {
    const { AlgorithmType } = route.params;
    if (AlgorithmType === "Default") {
      const config = route.params as DefaultConfig;
      phi = config.Phi;
      hue = config.HueShift;
      simType = 0;
    } else if (AlgorithmType === "Simulation") {
      const config = route.params as SimulatorConfig;
      phi = 1.0;
      hue = 0;
      severity = config.Severity;
      if (config.DichromacyType === "Deuteranopia") {
        simType = 2;
      } else if (config.DichromacyType === "Protanopia") {
        simType = 1;
      } else {
        simType = 3;
      }
    } else {
      const config = route.params as SimulatorRemapConfig;
      phi = config.Phi;
      hue = config.HueShift;
      severity = config.Severity;
      if (config.DichromacyType === "Deuteranopia") {
        simType = 2;
      } else if (config.DichromacyType === "Protanopia") {
        simType = 1;
      } else {
        simType = 3;
      }
    }
  }

  const onContextCreate = async (gl: GL.ExpoWebGLRenderingContext) => {
    // Create texture asynchronously
    texture = await createCameraTexture();
    const cameraTexture = texture;

    // Compile vertex and fragment shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);

    // Link, use program, save and enable attributes
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    gl.useProgram(program);

    const positionAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttrib);

    // Create, bind, fill buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Bind 'position' attribute
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // Set 'cameraTexture' uniform
    gl.uniform1i(gl.getUniformLocation(program, "cameraTexture"), 0);

    initParams();

    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, "simType"), simType);

    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "hue_shift"), hue);

    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "severity"), severity);

    // Activate unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Render loop
    const loop = () => {
      _rafID = requestAnimationFrame(loop);

      // Clear
      gl.clearColor(0, 0, 1, 1);
      // tslint:disable-next-line: no-bitwise
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "phi"), phi);
      // Bind texture if created
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

      // Draw!
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

      // Submit frame
      gl.endFrameEXP();
    };
    loop();
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
            onValueChange={(slideValue) => {
              phi = slideValue;
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
