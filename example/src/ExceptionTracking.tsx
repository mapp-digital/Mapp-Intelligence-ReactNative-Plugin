import React from 'react';
import { FlatList, View } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';

const ExceptionTrackingView = () => {
  const TRACK_EXCEPTION_WITH_NAME = 'Track Exception With Name';
  const TRACK_ERROR = 'Track Error';

  //handling onPress action
  const getListViewItem = (item: any) => {
    switch (item.key) {
      case TRACK_EXCEPTION_WITH_NAME:
        trackExceptionWithName();
        break;
      case TRACK_ERROR:
        trackError();
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
        data={[{ key: TRACK_EXCEPTION_WITH_NAME }, { key: TRACK_ERROR }]}
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
