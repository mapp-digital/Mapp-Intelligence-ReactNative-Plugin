import React from 'react';
import { useState } from 'react';
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  type StyleProp,
  type ColorValue,
  type InputModeOptions,
} from 'react-native';
import { DefaultStyles } from './Styles';
export const MappInputText = (props: {
  textValue: string;
  hintValue: string;
  buttonTitle: string;
  buttonTitleColor?: ColorValue | '#ffffff';
  buttonBackgroundColor?: ColorValue | '#06A806';
  onValueChanged: (newValue: string) => void | null;
  onClick?: (value: string) => void;
  disableWhenEmpty?: boolean | false;
  keyboardMode?: InputModeOptions | 'text' | null;
}) => {
  const [inputValue, setInputValue] = useState(props.textValue);
  return (
    <View style={DefaultStyles.sectionTextRow}>
      <TextInput
        style={{ flex: 1 }}
        onChangeText={(value) => {
          setInputValue(value);
          if (props.onValueChanged) {
            props.onValueChanged(value);
          }
        }}
        placeholder={props.hintValue}
        value={inputValue}
        inputMode={props.keyboardMode ?? 'text'}
      />
      <View style={{ margin: 0 }}>
        <TouchableOpacity
          disabled={
            props.disableWhenEmpty &&
            (inputValue == undefined || inputValue == '')
          }
          style={{
            margin: 5,
            padding: 10,
            borderRadius: 100,
            justifyContent: 'space-around',
            backgroundColor:
              props.disableWhenEmpty &&
              (inputValue == undefined || inputValue == '')
                ? '#cccccc'
                : props.buttonBackgroundColor,
          }}
          onPress={() => {
            if (props.onClick) {
              props.onClick(inputValue);
            }
            setInputValue('');
          }}
        >
          <Text style={{ color: props.buttonTitleColor }}>
            {props.buttonTitle}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
