import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/configStack";
import Slider from "@react-native-community/slider";
import {
  DeuteranopiaQuizAnswerKey,
  ProtanopiaQuizAnswerKey,
  TritanopiaQuizAnswerKey,
} from "../data/quizData";
import ColorButton from "../components/button";
import { useDispatch } from "react-redux";
import {
  addDichromacyConfiguration,
  deleteDichromacyConfiguration,
  editDichromacyConfiguration,
} from "../redux/actions";
import { store } from "../redux/store";
import {
  Configuration,
  AlgorithmType,
  DichromacyType,
  SimulationParams,
  DefaultParams,
  BaseParams,
  DefaultConfig,
  SimulatorConfig,
  SimulatorRemapConfig,
  ConfigurationState,
} from "../redux/types";
import { SliderBox } from "react-native-image-slider-box";
import Checkbox from "expo-checkbox";
import * as GL from "expo-gl";
import { GLView } from "expo-gl";
import {
  applyShaders,
  initParams,
  updateParams,
} from "../rendering/renderHelpers";
import { Asset } from "expo-asset";
import { BLESendService } from "./BLEView";

type Props = NativeStackScreenProps<RootStackParamList, "Config">;

const get_image = (type: DichromacyType, index: number) => {
  if (type == "Protanopia") {
    return ProtanopiaQuizAnswerKey[index].image;
  } else if (type == "Deuteranopia") {
    return DeuteranopiaQuizAnswerKey[index].image;
  } else {
    return TritanopiaQuizAnswerKey[index].image;
  }
};

const get_images = (type: DichromacyType) => {
  let images = [];
  if (type == "Protanopia") {
    for (let index = 0; index < ProtanopiaQuizAnswerKey.length; index++) {
      images.push(ProtanopiaQuizAnswerKey[index].image);
    }
  } else if (type == "Deuteranopia") {
    for (let index = 0; index < DeuteranopiaQuizAnswerKey.length; index++) {
      images.push(DeuteranopiaQuizAnswerKey[index].image);
    }
  } else {
    for (let index = 0; index < TritanopiaQuizAnswerKey.length; index++) {
      images.push(TritanopiaQuizAnswerKey[index].image);
    }
  }
  return images;
};

const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
};

export const create_new_config = (
  alg_type: AlgorithmType,
  d_type: DichromacyType,
  old_config: Configuration | null,
  edge_detection: number
): any => {
  const config_len = store.getState().configurations.length;
  const default_new_name = "config_" + (config_len + 1).toString();

  let base_params: BaseParams =
    old_config != null
      ? {
          Name: old_config.Name,
          DichromacyType: old_config.DichromacyType,
          EdgeDetection: edge_detection,
        }
      : {
          Name: default_new_name,
          DichromacyType: d_type,
          EdgeDetection: edge_detection,
        };

  let default_param: DefaultParams | null = null;
  let sim_params: SimulationParams | null = null;

  if (alg_type == "Default" || alg_type == "SimulationRemap") {
    default_param =
      old_config != null &&
      (old_config.AlgorithmType == "Default" ||
        old_config.AlgorithmType == "SimulationRemap")
        ? {
            Phi: (old_config as DefaultParams).Phi,
            HueShift: (old_config as DefaultParams).HueShift,
          }
        : {
            Phi: 0.0,
            HueShift: 0.0,
          };
  }

  if (alg_type == "Simulation" || alg_type == "SimulationRemap") {
    sim_params =
      old_config != null &&
      (old_config.AlgorithmType == "Simulation" ||
        old_config.AlgorithmType == "SimulationRemap")
        ? {
            Severity: (old_config as SimulationParams).Severity,
          }
        : {
            Severity: 0.0,
          };
  }

  return {
    ...base_params,
    ...default_param,
    ...sim_params,
    AlgorithmType: alg_type,
  };
};

const ConfigurationView = ({ route, navigation }: Props) => {
  const [index, setIndex] = useState(0);
  const [enableGL, setEnableGL] = useState(true);

  const rparams = route.params;
  const image = get_image(rparams.dichromacy_type, index);

  const images = get_images(rparams.dichromacy_type);

  const old_name = rparams.config == null ? null : rparams.config.Name;
  const styles = StyleSheet.create({
    text_header: {
      fontSize: 20,
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      textAlign: "center",
      marginTop: 10,
    },
  });

  var _rafID: number = 0;

  useEffect(() => {
    if (_rafID !== undefined) {
      cancelAnimationFrame(_rafID);
    }
  }, [_rafID]);

  const onContextCreate = async (gl: GL.ExpoWebGLRenderingContext) => {
    var imageAsset = Asset.fromModule(
      get_image(rparams.dichromacy_type, index).valueOf() as any
    );
    await imageAsset.downloadAsync();

    const imageTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageAsset as any
    );
    gl;

    const setRafID = (callback: () => number) => {
      _rafID = callback();
    };

    initParams(new_config);

    if (imageTexture != null) {
      applyShaders(gl, imageTexture, 0, setRafID);
    }
  };

  const dispatch = useDispatch();

  let flag_remap_init = true;
  let flag_simulate_init = false;
  let flag_edge_detection_init = 0;
  if (rparams.config != null) {
    const t = rparams.config.AlgorithmType;
    flag_remap_init = t == "Default" || t == "SimulationRemap";
    flag_simulate_init = t == "Simulation" || t == "SimulationRemap";
    flag_edge_detection_init = rparams.config.EdgeDetection;
  }

  const [flag_remap, set_flag_remap] = useState(flag_remap_init);
  const [flag_simulation, set_flag_simulation] = useState(flag_simulate_init);
  const [flag_edge_detection, set_flag_edge_detection] = useState(
    flag_edge_detection_init
  );

  const get_new_config_type = (
    remap: boolean,
    simulate: boolean
  ): AlgorithmType => {
    let ret: AlgorithmType;
    if (remap && simulate) ret = "SimulationRemap";
    else if (remap && !simulate) ret = "Default";
    else if (!remap && simulate) ret = "Simulation";
    else ret = "Default";
    return ret;
  };

  const [new_config, set_new_config] = useState<Configuration>(
    create_new_config(
      get_new_config_type(flag_remap, flag_simulation),
      rparams.dichromacy_type,
      rparams.config,
      flag_edge_detection
    )
  );
  const [run_dispatch, set_run_dispatch] = useState<
    "Add" | "Edit" | "Delete" | ""
  >("");

  const sendToHeadset = () => {
    BLESendService.sendToHeadset(new_config);
  };

  useEffect(() => {
    if (run_dispatch === "Add") {
      dispatch(addDichromacyConfiguration(new_config));
      navigation.navigate("PastConfigs");
    } else if (run_dispatch == "Edit") {
      dispatch(editDichromacyConfiguration(new_config, old_name as string));
      navigation.navigate("PastConfigs");
    } else if (run_dispatch == "Delete") {
      dispatch(deleteDichromacyConfiguration(old_name as string));
      navigation.navigate("PastConfigs");
    }
  }, [run_dispatch]);

  const renderImages = (label_2: String) => {
    const styles = StyleSheet.create({
      view_images: {
        // color: '#FFFFFF',
        // backgroundColor: '#724DC6',
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 15,
        // marginVertical: 0,
      },
      image: {
        paddingTop: 30,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      slider: {
        height: 200,
      },
      caption: {
        justifyContent: "center",
      },
    });

    return (
      <View style={styles.view_images}>
        <View style={styles.slider}>
          <SliderBox
            images={images}
            currentImageEmitter={(index: number) => {
              setIndex(index);
              setEnableGL(false);
              setTimeout(() => {
                setEnableGL(true);
              }, 50);
            }}
            parentWidth={180}
            sliderBoxHeight={180}
            inactiveDotColor={"#724DC6"}
          />
        </View>
        <Text style={styles.caption}>Original Image</Text>
        <View style={styles.image}>
          {enableGL && (
            <GLView
              style={{
                width: 180,
                height: 180,
                transform: [{ rotateY: "180deg" }],
              }}
              onContextCreate={onContextCreate}
            />
          )}

          <Text style={{ marginVertical: 5 }}> {label_2} </Text>
        </View>
      </View>
    );
  };

  const renderInputsDefault = () => {
    return (
      <View>
        <View style={styles_input.text_input_container}>
          <Text style={styles_input.input_label}>Enter Config Name:</Text>
          <TextInput
            style={styles_input.text_input}
            onChangeText={(name) => {
              set_new_config({
                ...new_config,
                Name: name,
              });
            }}
            value={new_config.Name}
          ></TextInput>
        </View>

        <View style={styles_input.checkbox_container}>
          <Text style={styles_input.checkbox_container_label}>
            Enable Remap Params
          </Text>
          <Checkbox
            style={styles_input.checkbox_container_inner}
            value={flag_remap}
            onValueChange={(val) => {
              set_flag_remap(val);
              const cfg = create_new_config(
                get_new_config_type(val, flag_simulation),
                rparams.dichromacy_type,
                new_config,
                flag_edge_detection
              );
              set_new_config(cfg);

              if (!val) {
                updateParams({ phi: 1.0, hue: 0.0 });
              }
            }}
            // color={flag_remap ? '#' }
          />
        </View>

        {flag_remap && (
          <>
            <View style={styles_input.sliders}>
              <Text style={styles_input.input_label}>
                Correctional Severity
              </Text>
              <Slider
                step={0.001}
                minimumValue={0.0}
                maximumValue={1.0}
                value={(new_config as DefaultConfig | SimulatorRemapConfig).Phi}
                onValueChange={(slideValue) => {
                  if (new_config.AlgorithmType !== "Simulation") {
                    set_new_config({
                      ...new_config,
                      Phi: slideValue,
                    });
                  }
                  updateParams({ phi: slideValue });
                }}
                minimumTrackTintColor="#C6ADFF"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#C6ADFF"
              />
            </View>
            <View style={styles_input.sliders}>
              <Text style={styles_input.input_label}>Hue range</Text>
              <Slider
                step={0.001}
                minimumValue={0.0}
                maximumValue={1.0}
                value={
                  (new_config as DefaultConfig | SimulatorRemapConfig).HueShift
                }
                onValueChange={(slideValue) => {
                  if (new_config.AlgorithmType !== "Simulation") {
                    set_new_config({
                      ...new_config,
                      HueShift: slideValue,
                    });
                  }
                  updateParams({ hue: slideValue });
                }}
                minimumTrackTintColor="#C6ADFF"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#C6ADFF"
              />
            </View>
          </>
        )}

        <View style={styles_input.checkbox_container}>
          <Text style={styles_input.checkbox_container_label}>
            Enable Edge Detection
          </Text>
          <Checkbox
            style={styles_input.checkbox_container_inner}
            value={flag_edge_detection == 1 ? true : false}
            onValueChange={(val) => {
              const val_num = val == true ? 1 : 0;
              set_flag_edge_detection(val_num);
              const cfg = create_new_config(
                get_new_config_type(flag_remap, flag_simulation),
                rparams.dichromacy_type,
                new_config,
                val_num
              );
              set_new_config(cfg);
              updateParams({ EdgeDetection: val_num });
            }}
          />
        </View>
        <View style={styles_input.checkbox_container}>
          <Text style={styles_input.checkbox_container_label}>
            Enable Simulation Params
          </Text>
          <Checkbox
            style={styles_input.checkbox_container_inner}
            value={flag_simulation}
            onValueChange={(val) => {
              set_flag_simulation(val);
              const cfg = create_new_config(
                get_new_config_type(flag_remap, val),
                rparams.dichromacy_type,
                new_config,
                flag_edge_detection
              );
              set_new_config(cfg);

              if (!val) {
                updateParams({ severity: 0.0, simType: 0 });
              } else {
                switch (rparams.dichromacy_type) {
                  case "Protanopia":
                    updateParams({ simType: 1 });
                    break;
                  case "Deuteranopia":
                    updateParams({ simType: 2 });
                    break;
                  case "Tritanopia":
                    updateParams({ simType: 3 });
                    break;
                }
              }
            }}
          />
        </View>
        {flag_simulation && (
          <>
            <View style={styles_input.sliders}>
              <Text style={styles_input.input_label}>Severity</Text>
              <Slider
                step={0.001}
                minimumValue={0.0}
                maximumValue={1.0}
                value={
                  (new_config as SimulatorConfig | SimulatorRemapConfig)
                    .Severity
                }
                onValueChange={(slideValue) => {
                  if (new_config.AlgorithmType !== "Default") {
                    set_new_config({
                      ...new_config,
                      Severity: slideValue,
                    });
                  }

                  updateParams({ severity: slideValue });
                }}
                minimumTrackTintColor="#C6ADFF"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#C6ADFF"
              />
            </View>
          </>
        )}
      </View>
    );
  };

  const renderActions = () => {
    var isDisabled = !flag_remap && !flag_simulation;
    if (old_name == null) {
      return (
        <View>
          <ColorButton
            onPress={() => {
              set_run_dispatch("Add");
              sendToHeadset();
            }}
            title="Create"
            color={"#FFFFFF"}
            backgroundColour={"#724DC6"}
            disabled={isDisabled}
          />
          {isDisabled && (
            <Text style={styles_input.error_text}>
              Please select at least one setting
            </Text>
          )}
        </View>
      );
    } else {
      const style = StyleSheet.create({
        buttons: {
          // flexDirection: "row",
          // justifyContent: "space-around",
        },
      });
      return (
        <View style={style.buttons}>
          <ColorButton
            onPress={() => {
              set_run_dispatch("Edit");
            }}
            title="Save"
            color={"#FFFFFF"}
            backgroundColour={"#724DC6"}
            disabled={isDisabled}
          />
          <ColorButton
            onPress={() => {
              set_run_dispatch("Delete");
            }}
            title="Delete"
            color={"#FFFFFF"}
            backgroundColour={"#FF6B6B"}
          />
          <ColorButton
            onPress={() => {
              sendToHeadset();
            }}
            title="Apply to Headset"
            color={"#FFFFFF"}
            backgroundColour={"#3836C9"}
          />
          {isDisabled && (
            <Text style={styles_input.error_text}>
              Please select at least one setting
            </Text>
          )}
        </View>
      );
    }
  };

  let screen;
  if (
    new_config.AlgorithmType == "Default" ||
    new_config.AlgorithmType == "Simulation" ||
    new_config.AlgorithmType == "SimulationRemap"
  ) {
    screen = (
      <ScrollView>
        <View>
          <Text style={styles.text_header}>{rparams.dichromacy_type}</Text>
          {renderImages("Remapped Image")}
          {renderInputsDefault()}
          {renderActions()}
        </View>
      </ScrollView>
    );
  }

  return <>{screen}</>;
};

const styles_input = StyleSheet.create({
  sliders: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  input_label: {
    // marginVertical: 5,
    marginHorizontal: 10,
    fontSize: 16,
    // fontWeight: "bold",
  },
  text_input_container: {
    marginVertical: 10,
  },
  text_input: {
    height: 35,
    marginHorizontal: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },

  checkbox_container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  checkbox_container_inner: {
    width: 23,
    height: 23,
  },
  checkbox_container_label: {
    marginHorizontal: 10,
  },
  error_text: {
    fontSize: 14,
    color: "#E75858",
    textAlign: "center",
  },
});

export default ConfigurationView;
