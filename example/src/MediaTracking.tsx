import React from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';
import { Routes } from './Routes';

function MediaTrackingView(props: { navigation: any }) {
  return (
    <SafeAreaView>
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            Routes.VIDEO_EXAMPLE,
            Routes.STREAMING_VIDEO_EXAMPLE,
            Routes.MANUAL_MEDIA_TRACKING,
          ]}
          renderItem={({ item }) => (
            <MappButton
              buttonTitle={item.valueOf()}
              buttonOnPress={() => {
                props.navigation.navigate(item.valueOf());
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default MediaTrackingView;
