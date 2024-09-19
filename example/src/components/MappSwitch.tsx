import React from 'react';
import { View, Switch, Text } from 'react-native';
export const MappSwitch = (props: {
  text: string;
  isChecked: boolean;
  onCheckedChanged: (checked: boolean) => void;
  isEnabled: boolean;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 5,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          flex: 1,
          textAlignVertical: 'center',
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {props.text}
      </Text>
      <Switch
        value={props.isChecked}
        onValueChange={props.onCheckedChanged}
        disabled={props.isEnabled !== true ? true : false}
      />
    </View>
  );
};
