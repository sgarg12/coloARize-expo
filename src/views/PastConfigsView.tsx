import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Button,
    Text,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/configStack";
import ColorButton from "../components/button";
import { Configuration } from "../redux/types";

type Props = NativeStackScreenProps<RootStackParamList, "PastConfigs">;

const get_config_component = (config: Configuration) => {
    const icon = require("../assets/icon_eye.png");
    const styles = StyleSheet.create({
        config: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center",
            width: "95%",
            // paddingHorizontal: "3%",
            paddingVertical: 5,
            marginVertical: 5,
            backgroundColor: "#ABC3FF",
            borderRadius: 10,
        },
        icon: {
            marginHorizontal: 5,
            backgroundColor: "#ffffff",
            borderRadius: 10,
        },
        config_name: {
            fontSize: 16,
            fontWeight: "bold",
        },
        badge_text: {
            fontSize: 13,
            paddingVertical: 2,
            paddingHorizontal: 4,
            marginHorizontal: 5,
            marginVertical: 3,
            textAlign: "center",
            borderRadius: 5,
        },

        badge_dichromacy_type: {
            backgroundColor: "#3836C9",
            color: "#ffffff",
        },
        badge_algorithm_type: {
            backgroundColor: "#E75858",
            color: "#ffffff",
        },
    });

    return (
        <TouchableOpacity
            style={styles.config}
            onPress={() => {
                console.log("Rishi Test");
            }}
        >
            <Image source={icon} style={styles.icon} />
            <Text style={styles.config_name}>{config.Name}</Text>
            <View>
                <Text style={[styles.badge_text, styles.badge_dichromacy_type]}>
                    {config.DichromacyType}
                </Text>
                <Text style={[styles.badge_text, styles.badge_algorithm_type]}>
                    {config.AlgorithmType}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
const get_config_components = () => {
    let configs: Configuration[] = [
        {
            Name: "config_protan",
            DichromacyType: "Protanopia",
            AlgorithmType: "Default",
            Parameters: {
                HueShift: 0.5,
                Phi: 0.7,
            },
        },
        {
            Name: "config_simulate_deutan",
            DichromacyType: "Deuteranopia",
            AlgorithmType: "Simulation",
            Parameters: {
                Severity: 0.8,
            },
        },
    ];

    let components = [];

    for (let i = 0; i < configs.length; i++) {
        components.push(get_config_component(configs[i]));
    }
    // components.push(<Text>Test 1</Text>);
    // components.push(<Text>Test 2</Text>);
    return <View>{components}</View>;
};
const PastConfigsView = ({ navigation }: Props) => {
    const goToScreen = () => {
        navigation.navigate("DichromacySelection");
    };

    let fields = get_config_components();
    return (
        <>
            {/* <Text>Past Configurations</Text> */}
            <ColorButton
                onPress={() => goToScreen()}
                title="New Config"
                color={"#FFFFFF"}
                backgroundColour={"#724DC6"}
            />

            {fields}
        </>
        //Other components
    );
};

export default PastConfigsView;
