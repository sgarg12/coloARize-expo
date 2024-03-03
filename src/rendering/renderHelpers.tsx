import * as GL from "expo-gl";
import {
  Configuration,
  DefaultConfig,
  SimulatorConfig,
  SimulatorRemapConfig,
} from "../redux/types";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Dimensions } from "react-native";

export type RenderParams = {
  phi?: Float;
  hue?: Float;
  simType?: number;
  severity?: Float;
};

export var phi: Float = 1.0;
export var hue: Float = 0.0;
export var simType: number = 0;
export var severity: Float = 0.9;

export function initParams(params: Configuration) {
  const { AlgorithmType } = params;
  if (AlgorithmType === "Default") {
    const config = params as DefaultConfig;
    phi = config.Phi;
    hue = config.HueShift;
    simType = 0;
  } else if (AlgorithmType === "Simulation") {
    const config = params as SimulatorConfig;
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
    const config = params as SimulatorRemapConfig;
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

export function updateParams(params: RenderParams) {
  if (params.phi !== undefined) {
    phi = params.phi;
  }
  if (params.hue !== undefined) {
    hue = params.hue;
  }
  if (params.simType !== undefined) {
    simType = params.simType;
  }
  if (params.severity !== undefined) {
    severity = params.severity;
  }
}

export const applyShaders = (
  gl: GL.ExpoWebGLRenderingContext,
  texture: WebGLTexture,
  setRafID: (callback: () => number) => void
) => {
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

  // Set 'textureSource' uniform
  gl.uniform1i(gl.getUniformLocation(program, "textureSource"), 0);

  // Activate unit 0
  gl.activeTexture(gl.TEXTURE0);

  // gl.texParameteri(gl.TEXTURE_2D, )
  // int w, h;
  // int miplevel = 0;
  // gl.getTexParameter(gl.TEXTURE_2D, )
  // console.log("width: " + texture.width);
  // glGetTexLevelParameteriv(GL_TEXTURE_2D, miplevel, GL_TEXTURE_WIDTH, &w);
  // glGetTexLevelParameteriv(GL_TEXTURE_2D, miplevel, GL_TEXTURE_HEIGHT, &h);

  // Render loop
  const loop = () => {
    const rafCallback = () => {
      return requestAnimationFrame(loop);
    };
    setRafID(rafCallback);

    // Clear
    gl.clearColor(0, 0, 1, 1);
    // tslint:disable-next-line: no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "phi"), phi);
    gl.uniform1f(gl.getUniformLocation(program, "severity"), severity);
    gl.uniform1f(gl.getUniformLocation(program, "hue_shift"), hue);

    let width = Dimensions.get("window").width;
    let height = Dimensions.get("window").height;
    console.log("Width: ", width, " Height: ", height);

    gl.uniform1f(gl.getUniformLocation(program, "kernel_off_x"), 1.0 / width);
    gl.uniform1f(gl.getUniformLocation(program, "kernel_off_y"), 1.0 / height);

    gl.uniform1i(gl.getUniformLocation(program, "simType"), simType);

    let kernel = new Float32Array([
      -1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0,
      // 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    ]);
    let kernel_2 = new Float32Array([
      -1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0,
      // 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    ]);
    gl.uniformMatrix3fv(
      gl.getUniformLocation(program, "kernel"),
      false,
      kernel
    );
    gl.uniformMatrix3fv(
      gl.getUniformLocation(program, "kernel"),
      false,
      kernel_2
    );

    // Bind texture if created
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Draw!
    gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

    // Submit frame
    gl.endFrameEXP();
  };
  loop();
};

export const vertShaderSource = `#version 300 es
precision highp float;

in vec2 position;
out vec2 uv;

void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;

export const fragShaderSource = `#version 300 es
precision highp float;
uniform mat3 kernel;
uniform mat3 kernel_2;

uniform float kernel_off_x;
uniform float kernel_off_y;

uniform sampler2D textureSource;
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
  new_hue = new_hue + hue_shift;
  new_hue = new_hue - floor(new_hue);
  new_hue = pow(new_hue, 1.0 - phi);
  new_hue = new_hue + 1.0f - hue_shift;
  new_hue = new_hue - floor(new_hue);

  hsv[0] = new_hue * 360.0f;
  vec3 fixed_rgb = hsv_to_rgb(hsv);

  return fixed_rgb;
}


vec3 edge_detection() {
  vec2 offset_x = vec2(kernel_off_x, 0.0);
  vec2 offset_y = vec2(0.0, kernel_off_y);

  // top
  vec3 rgb_1 = texture(textureSource, uv + offset_y - offset_x).rgb;
  vec3 rgb_2 = texture(textureSource, uv + offset_y).rgb;
  vec3 rgb_3 = texture(textureSource, uv + offset_y + offset_x).rgb;

  vec3 rgb_4 = texture(textureSource, uv - offset_x).rgb;
  vec3 rgb_5 = texture(textureSource, uv).rgb;
  vec3 rgb_6 = texture(textureSource, uv + offset_x).rgb;

  vec3 rgb_7 = texture(textureSource, uv - offset_y - offset_x).rgb;
  vec3 rgb_8 = texture(textureSource, uv - offset_y).rgb;
  vec3 rgb_9 = texture(textureSource, uv - offset_y + offset_x).rgb;


  // kernel[col][row]
  vec3 result_1 = kernel[0][0] * rgb_1 + kernel[1][0] * rgb_2 + kernel[2][0] * rgb_3 +
  kernel[0][1] * rgb_4 + kernel[1][1] * rgb_5 + kernel[2][1] * rgb_6 +
  kernel[0][2] * rgb_7 + kernel[1][2] * rgb_8 + kernel[2][2] * rgb_9;

  vec3 result_2 = kernel_2[0][0] * rgb_1 + kernel_2[1][0] * rgb_2 + kernel_2[2][0] * rgb_3 +
  kernel_2[0][1] * rgb_4 + kernel_2[1][1] * rgb_5 + kernel_2[2][1] * rgb_6 +
  kernel_2[0][2] * rgb_7 + kernel_2[1][2] * rgb_8 + kernel_2[2][2] * rgb_9;
  
  float conv_1 = (result_1.x + result_1.y + result_1.z) / 3.0;
  float conv_2 = (result_2.x + result_2.y + result_2.z) / 3.0;
  float res = 2.0f * sqrt(conv_1 * conv_1 + conv_2 * conv_2);

  vec3 edge_color = clamp(vec3(res, res, res), 0.0, 1.0);
  return rgb_5 + edge_color;

  // return clamp(vec3(2.0, 0.0, 0.0), 0.0, 1.0);

}

void main() {
  // vec3 rgb = texture(textureSource, uv).rgb;

  // other possible in parameters
  // float hue_min = 0.0;
  // float hue_max = 150.0;
  // float phi_min = 0.3;
  // float phi_max = 0.9;

  //vec3 fixed_rgb = remapColour(rgb, hue_shift, phi);

  //fragColor = vec4(simColourBlind(simType, fixed_rgb, severity), 1.0);
  fragColor = vec4(edge_detection(), 1.0);
}`;
