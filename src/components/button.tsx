import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  backgroundColour: string;
  color: string;
}

export default function ColorButton(props: Props) {
  const {onPress, title, backgroundColour, color} = props;
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: backgroundColour}]}
      onPress={onPress}>
      <Text style={[styles.text, {color: color}]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '50%',
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 12,
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
});
