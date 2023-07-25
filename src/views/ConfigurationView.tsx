import React, { Dispatch, useEffect, useState } from "react";
import {
    StyleSheet,
    Button,
    Text,
    Image,
    View,
    ImageSourcePropType,
    TextInput,
} from "react-native";
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/configStack";
import Slider from "@react-native-community/slider";
import {
    DeuteranopiaQuizAnswerKey,
    ProtanopiaQuizAnswerKey,
    TritanopiaQuizAnswerKey,
    quizQuestion,
} from "../data/quizData";
import ColorButton from "../components/button";
import { useSelector, useDispatch } from "react-redux";
import {
    addDichromacyConfiguration,
    deleteDichromacyConfiguration,
    editDichromacyConfiguration,
} from "../redux/actions";
import {
    Configuration,
    ConfigurationList,
    AlgorithmType,
    DichromacyType,
    SimulationParams,
    DefaultParams,
    ConfigurationState,
    BaseParams,
    DefaultConfig,
    SimulatorConfig,
    SimulatorRemapConfig,
} from "../redux/types";
import { AnyAction } from "redux";

type Props = NativeStackScreenProps<RootStackParamList, "Config">;

const get_image = (type: DichromacyType) => {
    if (type == "Protanopia") {
        return ProtanopiaQuizAnswerKey[0].image;
    } else if (type == "Deuteranopia") {
        return DeuteranopiaQuizAnswerKey[0].image;
    } else {
        return TritanopiaQuizAnswerKey[0].image;
    }
};

const create_new_config = (
    alg_type: AlgorithmType,
    d_type: DichromacyType,
    old_config: Configuration | null
): Configuration => {
    const config_len = 2;
    const default_new_name = "config_" + (config_len + 1).toString();

    if (old_config != null) {
        return {
            ...old_config,
        };
    }

    let base_params: BaseParams = {
        Name: default_new_name,
        DichromacyType: d_type,
    };

    // let new_params: SimulationParams | DefaultParams;
    if (alg_type == "Default") {
        let default_param: DefaultParams = {
            Phi: 0.0,
            HueShift: 0.0,
        };

        return {
            ...base_params,
            ...default_param,
            AlgorithmType: "Default",
        };
    } else if (alg_type == "Simulation") {
        let sim_params: SimulationParams = {
            Severity: 0.0,
        };
        return {
            ...base_params,
            ...sim_params,
            AlgorithmType: "Simulation",
        };
    } else {
        let default_param = {
            Phi: 0.0,
            HueShift: 0.0,
        };
        let sim_params: SimulationParams = {
            Severity: 0.0,
        };
        return {
            ...base_params,
            ...default_param,
            ...sim_params,
            AlgorithmType: "SimulationRemap",
        };
    }
};

const ConfigurationView = ({ route, navigation }: Props) => {
    const rparams = route.params;
    const image = get_image(rparams.dichromacy_type);

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

    const styles_input = StyleSheet.create({
        sliders: {
            marginVertical: 10,
        },
        input_label: {
            // marginVertical: 5,
            marginHorizontal: 10,
            fontSize: 16,
            // fontWeight: "bold",
        },

        text_input: {
            height: 35,
            marginHorizontal: 10,
            borderWidth: 1,
            paddingHorizontal: 10,
        },
    });

    const dispatch = useDispatch();
    // const [phi, set_phi] = useState(0);
    // const [hue_shift, set_hue_shift] = useState(0);
    // const [name, set_name] = useState("");
    // const [severity, set_severity] = useState(0);
    const [new_config, set_new_config] = useState<Configuration>(
        create_new_config(
            rparams.algorithm_type,
            rparams.dichromacy_type,
            rparams.config
        )
    );
    const [run_dispatch, set_run_dispatch] = useState<
        "Add" | "Edit" | "Delete" | ""
    >("");

    useEffect(() => {
        if (run_dispatch === "Add") {
            dispatch(addDichromacyConfiguration(new_config));
            navigation.navigate("PastConfigs");
        } else if (run_dispatch == "Edit") {
            dispatch(
                editDichromacyConfiguration(new_config, old_name as string)
            );
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
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                // marginVertical: 0,
            },
            image: {
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            },
        });

        // const dispatch = useDispatch();

        // dispatch(
        //     addDichromacyConfiguration({
        //         Name: "test",
        //         DichromacyType: "Tritanopia",
        //         AlgorithmType: "Default",
        //         Parameters: {
        //             Severity: 1,
        //             HueShift: 1,
        //         },
        //     })
        // );

        // console.log(useSelector((state: ConfigurationState) => state.configurations));

        return (
            <View style={styles.view_images}>
                <View style={styles.image}>
                    <Image source={image} />
                    <Text style={{ marginVertical: 5 }}> Original Image </Text>
                </View>
                <View style={styles.image}>
                    <Image source={image} />
                    <Text style={{ marginVertical: 5 }}> {label_2} </Text>
                </View>
            </View>
        );
    };

    const renderInputsDefault = () => {
        return (
            <View>
                <View>
                    <Text style={styles_input.input_label}>
                        Enter Config Name:
                    </Text>
                    <TextInput
                        style={styles_input.text_input}
                        onChangeText={(name) => {
                            set_new_config({
                                ...new_config,
                                Name: name,
                            });

                            // console.log("Rishi 1");
                            // console.log(new_config);
                        }}
                        value={new_config.Name}
                    ></TextInput>
                </View>
                <View style={styles_input.sliders}>
                    <Text style={styles_input.input_label}>Phi</Text>
                    <Slider
                        step={0.001}
                        minimumValue={0.0}
                        maximumValue={1.0}
                        value={
                            (new_config as DefaultConfig | SimulatorRemapConfig)
                                .Phi
                        }
                        onValueChange={(slideValue) => {
                            if (new_config.AlgorithmType !== "Simulation") {
                                set_new_config({
                                    ...new_config,
                                    Phi: slideValue,
                                });
                            }
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
                            (new_config as DefaultConfig | SimulatorRemapConfig)
                                .HueShift
                        }
                        onValueChange={(slideValue) => {
                            if (new_config.AlgorithmType !== "Simulation") {
                                set_new_config({
                                    ...new_config,
                                    HueShift: slideValue,
                                });
                            }
                        }}
                        minimumTrackTintColor="#C6ADFF"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#C6ADFF"
                    />
                </View>
            </View>
        );
    };

    const renderInputsSimulation = () => {
        // let config = new_config;
        // const param = config.Parameters as SimulationParams;

        // set_severity(param.Severity);
        // set_name(config.Name);

        return (
            <View>
                <View>
                    <Text style={styles_input.input_label}>
                        Enter Config Name:
                    </Text>
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
                <View style={styles_input.sliders}>
                    <Text style={styles_input.input_label}>Severity</Text>
                    <Slider
                        step={0.001}
                        minimumValue={0.0}
                        maximumValue={1.0}
                        value={
                            (
                                new_config as
                                    | SimulatorConfig
                                    | SimulatorRemapConfig
                            ).Severity
                        }
                        onValueChange={(slideValue) => {
                            if (new_config.AlgorithmType !== "Default") {
                                set_new_config({
                                    ...new_config,
                                    Severity: slideValue,
                                });
                            }
                        }}
                        minimumTrackTintColor="#C6ADFF"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#C6ADFF"
                    />
                </View>
            </View>
        );
    };

    const renderActions = () => {
        if (old_name == null) {
            return (
                <View>
                    <ColorButton
                        onPress={() => {
                            set_run_dispatch("Add");
                        }}
                        title="Create"
                        color={"#FFFFFF"}
                        backgroundColour={"#724DC6"}
                    />
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
                    />
                    <ColorButton
                        onPress={() => {
                            set_run_dispatch("Delete");
                        }}
                        title="Delete"
                        color={"#FFFFFF"}
                        backgroundColour={"#FF6B6B"}
                    />
                </View>
            );
        }
    };

    let screen;
    if (new_config.AlgorithmType == "Default") {
        screen = (
            <View>
                <Text style={styles.text_header}>
                    {rparams.dichromacy_type}
                </Text>
                {renderImages("Remapped Image")}
                {renderInputsDefault()}
                {renderActions()}
            </View>
        );
    } else if (new_config.AlgorithmType == "Simulation") {
        screen = (
            <View>
                <Text style={styles.text_header}>
                    {rparams.dichromacy_type}
                </Text>
                {renderImages("Simulated Image")}
                {renderInputsSimulation()}
                {renderActions()}
            </View>
        );
    }

    return <>{screen}</>;
};

export default ConfigurationView;
