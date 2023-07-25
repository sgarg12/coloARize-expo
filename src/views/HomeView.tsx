import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";

//import HomeViewModel

const HomeView = () => {
  return (
    <>
      <View style={styles.parent_container}>
        <Text style={styles.text_header}>What is ColoARize?</Text>
        <View style={styles.container}>
          <Text style={styles.text}>
            An app to help configure your ColoARize MR headset to custom colour
            mappings
          </Text>
        </View>
        <Text style={styles.text_header}>Types of Dichromacy</Text>
        <View style={styles.container}>
          <Text style={styles.container_header}>
            Red-Green Colour Blindness
          </Text>

          <View style={styles.container_body}>
            <View>
              <Text style={styles.text}>1. Protanopia</Text>
              <Text style={styles.text}>2. Protanomaly</Text>
              <Text style={styles.text}>3. Deuteranopia</Text>
              <Text style={styles.text}>4. Deuteranomaly</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.container_header}>
            Blue-Yellow Colour Blindness
          </Text>

          <View style={styles.container_body}>
            <View>
              <Text style={styles.text}>1. Tritanopia</Text>
              <Text style={styles.text}>2. Tritanomaly</Text>
            </View>
          </View>
        </View>
      </View>
    </>
    //Other components
  );
};

export default HomeView;

const styles = StyleSheet.create({
  text_header: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
    margin: 5,
  },
  container: {
    backgroundColor: "#724DC6",
    margin: 10,
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 15,
  },
  container_header: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#FFFFFF",
  },
  container_body: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },

  text: {
    color: "#FFFFFF",
  },

  parent_container: {
    paddingTop: 40,
  },
});
