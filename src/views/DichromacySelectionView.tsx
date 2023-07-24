import React from 'react';
import {Button, StyleSheet, Text} from 'react-native';
import {RootStackParamList} from '../navigation/configStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ColorButton from '../components/button';

type Props = NativeStackScreenProps<RootStackParamList, 'DichromacySelection'>;

const DichromacySelectionView = ({navigation}: Props) => {
  const goToScreen = (type: 'Deuteranopia' | 'Protanopia' | 'Tritanopia') => {
    navigation.navigate('Config', {
      type: type,
    });
  };

  return (
    <>
      <Text style={styles.text}>Select type of dichromacy</Text>
      <ColorButton
        onPress={() => goToScreen('Protanopia')}
        title="Protanopia"
        color={'#FFFFFF'}
        backgroundColour={'#724DC6'}
      />
      <ColorButton
        onPress={() => goToScreen('Deuteranopia')}
        title="Deuteranopia"
        color={'#FFFFFF'}
        backgroundColour={'#724DC6'}
      />
      <ColorButton
        onPress={() => goToScreen('Tritanopia')}
        title="Tritanopia"
        color={'#FFFFFF'}
        backgroundColour={'#724DC6'}
      />
    </>
    //Other components
  );
};

export default DichromacySelectionView;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },

  button: {
    color: '#FFFFFF',
    backgroundColor: '#724DC6',
  },
});
