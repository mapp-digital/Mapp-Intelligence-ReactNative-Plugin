import React from 'react';
import { FlatList, View } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';
import { MappIntelligencePlugin } from 'mapp-intelligence-reactnative-plugin';

const ExceptionTrackingView = () => {
  const TRACK_EXCEPTION_WITH_NAME = 'Track Exception With Name';
  const TRACK_ERROR = 'Track Error';
  const CRASH_APP = 'Crash App';
  const CRASH_APP_JS_LEVEL = 'Crash App JS Level';
  const TRIGGER_PROMISE_REJECTION = 'Trigger promise rejection';
  const TRIGGER_UNCAUGHT_EXCEPTION = 'Trigger uncaught exception';

  //handling onPress action
  const getListViewItem = (item: any) => {
    switch (item.key) {
      case TRACK_EXCEPTION_WITH_NAME:
        trackExceptionWithName();
        break;
      case TRACK_ERROR:
        trackError();
        break;
      case CRASH_APP:
        MappIntelligencePlugin.nativeCrash();
        break;
      case CRASH_APP_JS_LEVEL:
        throw new Error('Crash App JS Level');
      case TRIGGER_PROMISE_REJECTION:
        triggerUnhandledPromiseRejection();
        break;
      case TRIGGER_UNCAUGHT_EXCEPTION:
        triggerUncaughtException();
        break;
    }
  };

  const trackExceptionWithName = async () => {
    console.log('trackExceptionWithName');
    try {
      const result = JSON.parse('Invalid JSON String');
      console.log(result);
    } catch (e) {
      const error = e as Error;
      await MappIntelligencePlugin.trackExceptionWithName(
        error.name,
        error.message
      );
    }
  };

  const trackError = async () => {
    console.log('trackError');
    try {
      const result = JSON.parse('Invalid JSON String');
      console.log(result);
    } catch (e) {
      console.log('trackError - catch block');
      const error = e as Error;
      await MappIntelligencePlugin.trackException(error);
    }
  };

  // Unhandled Promise Rejection
  const triggerUnhandledPromiseRejection = async () => {
    Promise.reject(new Error('Unhandled Promise Rejection!'));
  };

  // Uncaught Exception
  const triggerUncaughtException = async () => {
    setTimeout(() => {
      throw new Error('Uncaught Exception!');
    }, 1000);
  };

  return (
    <View style={DefaultStyles.sectionContainer}>
      <FlatList
        data={[
          { key: TRACK_EXCEPTION_WITH_NAME },
          { key: TRACK_ERROR },
          { key: CRASH_APP },
          { key: CRASH_APP_JS_LEVEL },
          { key: TRIGGER_PROMISE_REJECTION },
          { key: TRIGGER_UNCAUGHT_EXCEPTION },
        ]}
        renderItem={({ item }) => (
          <MappButton
            buttonTitle={item.key}
            buttonOnPress={() => {
              getListViewItem(item);
            }}
          />
        )}
      />
    </View>
  );
};

export default ExceptionTrackingView;
