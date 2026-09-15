import { registerRootComponent } from 'expo';
import { Alert } from 'react-native';
import { setGlobalErrorHandler } from 'mapp-intelligence-reactnative-plugin';
import App from './src/App';

setGlobalErrorHandler((error, isFatal) => {
  Alert.alert(
    'Unexpected error occurred',
    `${isFatal ? 'Fatal: ' : ''}${error.name} ${error.message}`
  );
});

registerRootComponent(App);
