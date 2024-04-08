import React from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';

function MediaTrackingView(props: { navigation: any }) {
  const PLAY_EXAMPLE = 'Play Example';
  const LIVE_STREAM_EXAMPLE = 'Live Stream Example';
  const MANUAL_MEDIA_TRACKING = 'Manual Media Tracking';

  //const navigation = useNavigation();
  //handling onPress action
  const getListViewItem = (item: any) => {
    switch (item.key) {
      case PLAY_EXAMPLE:
        playExample();
        break;
      case LIVE_STREAM_EXAMPLE:
        livestreamExample();
        break;
      case MANUAL_MEDIA_TRACKING:
        manualMediaTracking();
        break;
    }
  };

  const playExample = async () => {
    props.navigation.navigate('VideoExample');
  };

  const livestreamExample = async () => {
    props.navigation.navigate('StreamingVideoExample');
  };

  const manualMediaTracking = async () => {
    props.navigation.navigate('ManualMediaTracking');
  };

  return (
    <SafeAreaView>
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: PLAY_EXAMPLE },
            { key: LIVE_STREAM_EXAMPLE },
            { key: MANUAL_MEDIA_TRACKING },
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
    </SafeAreaView>
  );
}

export default MediaTrackingView;
