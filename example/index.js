import { AppRegistry, Alert } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { setGlobalErrorHandler } from 'mapp-intelligence-reactnative-plugin';

const showError = (error, isFatal) => {
  Alert.alert(
    'Unexpected error occurred',
    `
        Error: ${isFatal ? 'Fatal:' : ''} ${error.name} ${error.message}

        We have reported this to our team! Please close the app and start again!
      `,
    [
      {
        text: 'Close',
        onPress: () => {
          // Optionally, you can close the app or restart it
        },
      },
    ]
  );
};

setGlobalErrorHandler((error, isFatal) => {
  showError(error, isFatal);
});

AppRegistry.registerComponent(appName, () => App);
