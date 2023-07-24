import React, { useState } from "react";
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
import { addDichromacyConfiguration } from "../redux/actions";
import {
    Configuration,
    ConfigurationList,
    AlgorithmType,
    DichromacyType,
    SimulationParams,
    DefaultParams,
} from "../redux/types";

type Props = NativeStackScreenProps<RootStackParamList, "Config">;

const renderImages = (image: ImageSourcePropType, label_2: String) => {
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

    const dispatch = useDispatch();

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

const renderInputsDefault = (config: Configuration) => {
    const param = config.Parameters as DefaultParams;

    const [phi, set_phi] = useState(param.Phi);
    const [hue_shift, set_hue_shift] = useState(param.HueShift);
    const [name, set_name] = useState(config.Name);

    return (
        <View>
            <View>
                <Text style={styles_input.input_label}>Enter Config Name:</Text>
                <TextInput
                    style={styles_input.text_input}
                    onChangeText={(name) => {
                        set_name(name);
                        config.Name = name;
                    }}
                    value={name}
                ></TextInput>
            </View>
            <View style={styles_input.sliders}>
                <Text style={styles_input.input_label}>Phi</Text>
                <Slider
                    step={0.001}
                    minimumValue={0.0}
                    maximumValue={1.0}
                    value={phi}
                    onValueChange={(slideValue) => {
                        set_phi(slideValue);
                        param.Phi = slideValue;
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
                    value={hue_shift}
                    onValueChange={(slideValue) => {
                        set_hue_shift(slideValue);
                        param.HueShift = slideValue;
                    }}
                    minimumTrackTintColor="#C6ADFF"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#C6ADFF"
                />
            </View>
        </View>
    );
};

const renderInputsSimulation = (config: Configuration) => {
    const param = config.Parameters as SimulationParams;

    const [severity, set_severity] = useState(param.Severity);
    const [name, set_name] = useState(config.Name);

    return (
        <View>
            <View>
                <Text style={styles_input.input_label}>Enter Config Name:</Text>
                <TextInput
                    style={styles_input.text_input}
                    onChangeText={(name) => {
                        set_name(name);
                        config.Name = name;
                    }}
                    value={name}
                ></TextInput>
            </View>
            <View style={styles_input.sliders}>
                <Text style={styles_input.input_label}>Severity</Text>
                <Slider
                    step={0.001}
                    minimumValue={0.0}
                    maximumValue={1.0}
                    value={severity}
                    onValueChange={(slideValue) => {
                        set_severity(slideValue);
                        param.Severity = slideValue;
                    }}
                    minimumTrackTintColor="#C6ADFF"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#C6ADFF"
                />
            </View>
        </View>
    );
};

const renderActions = (
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        "Config",
        undefined
    >,
    config: Configuration,
    old_name: String | null
) => {
    if (old_name == null) {
        return (
            <View>
                <ColorButton
                    onPress={() => navigation.navigate("PastConfigs")}
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
                        navigation.navigate("PastConfigs");
                        console.log("Saving new config: ");
                        console.log(config);
                    }}
                    title="Save"
                    color={"#FFFFFF"}
                    backgroundColour={"#724DC6"}
                />
                <ColorButton
                    onPress={() => navigation.navigate("PastConfigs")}
                    title="Delete"
                    color={"#FFFFFF"}
                    backgroundColour={"#FF6B6B"}
                />
            </View>
        );
    }
};
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
        return old_config;
    }

    let new_params: SimulationParams | DefaultParams;
    if (alg_type == "Default") {
        new_params = {
            Phi: 0.0,
            HueShift: 0.0,
        };
    } else {
        new_params = {
            Severity: 0.0,
        };
    }
    return {
        Name: default_new_name,
        DichromacyType: d_type,
        AlgorithmType: alg_type,
        Parameters: new_params,
    };
};

const ConfigurationView = ({ route, navigation }: Props) => {
    const rparams = route.params;
    const image = get_image(rparams.dichromacy_type);

    const old_name = rparams.config == null ? null : rparams.config.Name;
    const new_config = create_new_config(
        rparams.algorithm_type,
        rparams.dichromacy_type,
        rparams.config
    );

    console.log("Initializing new config: ");
    console.log(new_config);

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

    let screen;

    if (new_config.AlgorithmType == "Default") {
        screen = (
            <View>
                <Text style={styles.text_header}>
                    {rparams.dichromacy_type}
                </Text>
                {renderImages(image, "Remapped Image")}
                {renderInputsDefault(new_config)}
                {renderActions(navigation, new_config, old_name)}
            </View>
        );
    } else if (new_config.AlgorithmType == "Simulation") {
        screen = (
            <View>
                <Text style={styles.text_header}>
                    {rparams.dichromacy_type}
                </Text>
                {renderImages(image, "Simulated Image")}
                {renderInputsSimulation(new_config)}
                {renderActions(navigation, new_config, old_name)}
            </View>
        );
    }

    return <>{screen}</>;
};

export default ConfigurationView;
