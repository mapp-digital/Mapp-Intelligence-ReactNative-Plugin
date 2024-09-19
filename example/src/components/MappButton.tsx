import React from 'react';
import { useState } from 'react';
import { View, Button } from 'react-native';

export const MappButton = (props: {
  buttonTitle: string;
  buttonOnPress?: () => void;
  enabled?: boolean | true;
  lockDelay?: number | 100;
}) => {
  const buttonEnabled = props.enabled ?? true;

  const [buttonLocked, setButtonLocked] = useState(false);
  const setTimer = async () => {
    const func = setTimeout(() => {
      setButtonLocked(false);
    }, props.lockDelay);
    return func;
  };

  return (
    <View style={{ marginVertical: 5 }}>
      <Button
        title={props.buttonTitle}
        onPress={() => {
          setButtonLocked(true);
          try {
            if (props.buttonOnPress) {
              props.buttonOnPress();
            }
          } finally {
            setTimer();
          }
        }}
        disabled={!buttonEnabled || buttonLocked}
        color="#06A806"
      />
    </View>
  );
};
