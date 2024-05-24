import React from 'react';
import { useState } from 'react';
import { View, Button } from 'react-native';

export const MappButton = (props: {
  buttonTitle: string;
  buttonOnPress?: () => void;
  enabled?: boolean | true;
}) => {
  const [buttonEnabled, setButtonEnabled] = useState(props.enabled ?? true);
  const setTimer = async () => {
    const func = setTimeout(() => {
      setButtonEnabled(true);
    }, 100);
    return func;
  };

  return (
    <View style={{ marginVertical: 5 }}>
      <Button
        title={props.buttonTitle}
        onPress={() => {
          setButtonEnabled(false);
          try {
            if (props.buttonOnPress) {
              props.buttonOnPress();
            }
          } finally {
            setTimer();
          }
        }}
        disabled={!buttonEnabled}
        color="#06A806"
      />
    </View>
  );
};
