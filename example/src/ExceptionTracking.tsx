import React from 'react';
import { FlatList, View } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import CrashTester from 'react-native-crash-tester';

const ExceptionTrackingView = () => {
  const TRACK_EXCEPTION_WITH_NAME = 'Track Exception With Name';
  const TRACK_ERROR = 'Track Error';
  const CRASH_APP = 'Crash App';
  const CRASH_APP_JS_LEVEL = 'Crash App JS Level';

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
        CrashTester.nativeCrash();
        break;
      case CRASH_APP_JS_LEVEL:
        CrashTester.jsCrash();
        break;
    }
  };

  const trackExceptionWithName = async () => {
    console.log('trackExceptionWithName');
    try {
      const result = JSON.parse('Invalid JSON String');
    } catch (e: any) {
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
    } catch (e: any) {
      console.log('trackError - catch block');
      const error = e as Error;
      await MappIntelligencePlugin.trackException(error);
    }
  };

  return (
    <View style={DefaultStyles.sectionContainer}>
      <FlatList
        data={[
          { key: TRACK_EXCEPTION_WITH_NAME },
          { key: TRACK_ERROR },
          { key: CRASH_APP },
          { key: CRASH_APP_JS_LEVEL },
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
