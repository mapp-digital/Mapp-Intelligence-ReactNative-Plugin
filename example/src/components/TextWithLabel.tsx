import React from 'react';
import { Text, View } from 'react-native';
import { DefaultStyles } from './Styles';

export const TextWithLabel = (props: {
  label: string;
  content?: string | null;
}) => {
  return (
    <View style={DefaultStyles.sectionTextColumn}>
      <Text style={DefaultStyles.sectionLabel}>{props.label}</Text>
      <Text style={DefaultStyles.sectionDescription}>{props.content}</Text>
    </View>
  );
};

export default TextWithLabel;
