import React from 'react';
import { useState } from 'react';
import { TouchableOpacity, TextInput, Text, View } from 'react-native';
export const MappInputText = (props: {
  textValue: string;
  hintValue: string;
  buttonTitle: string;
  onValueChanged: (newValue: string) => void | null;
  onClick?: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(props.textValue);
  return (
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        padding: 5,
      }}
    >
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
      />
      <View style={{ margin: 0 }}>
        <TouchableOpacity
          disabled={inputValue == undefined || inputValue == ''}
          style={{
            margin: 5,
            padding: 10,
            borderRadius: 100,
            justifyContent: 'space-around',
            backgroundColor:
              inputValue == undefined || inputValue == ''
                ? '#cccccc'
                : '#06A806',
          }}
          onPress={() => {
            if (props.onClick) {
              props.onClick(inputValue);
            }
            setInputValue('');
          }}
        >
          <Text>{props.buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
