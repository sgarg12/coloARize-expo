import React from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';

//import HomeViewModel

const HomeView = () => {
  return (
    <>
      <Text style={styles.text_header}>What is ColoARize?</Text>
      <Text style={styles.container}>
        An app to help configure your ColoARize MR headset to custom colour
        mappings
      </Text>

      <Text style={styles.text_header}>Types of Dichromacy</Text>
      <View style={styles.container}>
        <Text style={styles.container_header}>Red-Green Colour Blindness</Text>

        <View style={styles.container_body}>
          <View>
            <Text>1. Protanopia</Text>
            <Text>2. Protanomaly</Text>
            <Text>3. Deuteranopia</Text>
            <Text>4. Deuteranomaly</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.container_header}>
          Blue-Yellow Colour Blindness
        </Text>

        <View style={styles.container_body}>
          <View>
            <Text>1. Tritanopia</Text>
            <Text>2. Tritanomaly</Text>
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
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textAlign: 'center',
    margin: 5,
  },
  container: {
    backgroundColor: '#724DC6',
    margin: 10,
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 15,
  },
  container_header: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textAlign: 'center',
    // color: '#dddddd',
  },
  container_body: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  //   button: {
  //     height: 50,
  //     width: '50%',
  //     borderRadius: 25,
  //     alignItems: 'center',
  //     alignSelf: 'center',
  //     paddingTop: 12,
  //     marginBottom: 15,
  //   },
  //   text: {
  //     fontSize: 16,
  //     lineHeight: 21,
  //     fontWeight: 'bold',
  //     letterSpacing: 0.25,
  //   },
});
