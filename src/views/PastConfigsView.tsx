import React from 'react';
import {Button, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/configStack';

//import HistoryViewModel to get what to display (i.e type)

type Props = NativeStackScreenProps<RootStackParamList, 'PastConfigs'>;

const PastConfigsView = ({navigation}: Props) => {
  const goToScreen = () => {
    navigation.navigate('DichromacySelection');
  };

  return (
    <>
      <Text>Past Configurations</Text>
      <Button onPress={goToScreen} title="New config" />
      {/* display dichromacy type using info given by HistoryViewModel */}
    </>
    //Other components
  );
};

export default PastConfigsView;
