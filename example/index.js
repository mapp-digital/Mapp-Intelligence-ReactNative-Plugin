import { AppRegistry, Alert, LogBox, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { setGlobalErrorHandler } from 'react-native-mappinteligence';

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
