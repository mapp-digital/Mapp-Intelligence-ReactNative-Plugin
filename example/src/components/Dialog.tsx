import { Alert } from 'react-native';

export const Dialog = {
  show(props: {
    title: string;
    message: string;
    positiveButtonText: string | 'OK';
    positiveAction?: () => void | null;
    negativeButtonText?: string | null;
    negativeAction?: () => void | null;
    onDismissCallback?: () => void | null;
  }): void {
    let actions = [
      {
        text: props.positiveButtonText,
        isPreferred: true,
        onPress: () => {
          if (props.positiveAction) {
            props.positiveAction();
          }
        },
      },
    ];

    if (props.negativeButtonText) {
      actions.push({
        text: props.negativeButtonText,
        isPreferred: false,
        onPress: () => {
          if (props.negativeAction) {
            props.negativeAction();
          }
        },
      });
    }

    Alert.alert(props.title, props.message, actions, {
      cancelable: true,
      onDismiss: () => {
        if (props.onDismissCallback) {
          props.onDismissCallback();
        }
      },
    });
  },
};
