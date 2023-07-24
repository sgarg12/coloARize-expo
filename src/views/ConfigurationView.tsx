import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  ImageSourcePropType,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
  ConfigurationList,
  ConfigurationState,
  DichromacyType,
} from "../redux/types";

type Props = NativeStackScreenProps<RootStackParamList, "Config">;

const renderImages = (image: ImageSourcePropType) => {
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
  //   addDichromacyConfiguration({
  //     Name: "test",
  //     DichromacyType: "Tritanopia",
  //     AlgorithmType: "Default",
  //     Parameters: {
  //       Severity: 1,
  //       HueShift: 1,
  //     },
  //   })
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
        <Text style={{ marginVertical: 5 }}> Remapped Image </Text>
      </View>
    </View>
  );
};

const renderInputs = () => {
  const [severity, set_severity] = useState(0.0);
  const [value, set_value] = useState(0.0);
  return (
    <View>
      <Text>Severity</Text>
      <Slider
        step={0.001}
        minimumValue={0.0}
        maximumValue={1.0}
        value={severity}
        onValueChange={(slideValue) => {
          set_severity(slideValue);
        }}
        minimumTrackTintColor="#C6ADFF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#C6ADFF"
      />

      <Text>Hue range</Text>

      <Slider
        step={0.001}
        minimumValue={0.0}
        maximumValue={1.0}
        value={value}
        onValueChange={(slideValue) => {
          set_value(slideValue);
        }}
        minimumTrackTintColor="#C6ADFF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#C6ADFF"
      />
    </View>
  );
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
const ConfigurationView = ({ route, navigation }: Props) => {
  const params = route.params;
  const image = get_image(params.type);

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

  return (
    <>
      <Text style={styles.text_header}>{params.type}</Text>
      {renderImages(image)}
      {renderInputs()}
      <ColorButton
        onPress={() => navigation.navigate("PastConfigs")}
        title="Create"
        color={"#FFFFFF"}
        backgroundColour={"#724DC6"}
      />
    </>
  );
};

export default ConfigurationView;
