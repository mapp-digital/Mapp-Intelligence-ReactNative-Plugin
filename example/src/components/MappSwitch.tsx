import React from 'react';
import { View, Switch, Text } from 'react-native';
export const MappSwitch = (props: {
  text: string;
  isChecked: boolean;
  onCheckedChanged: (checked: boolean) => void;
  isEnabled: boolean;
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ flex: 1, textAlignVertical: 'center' }}>{props.text}</Text>
      <Switch
        value={props.isChecked}
        onValueChange={props.onCheckedChanged}
        disabled={
          props.isEnabled == true || props.isEnabled == undefined ? true : false
        }
      />
    </View>
  );
};
