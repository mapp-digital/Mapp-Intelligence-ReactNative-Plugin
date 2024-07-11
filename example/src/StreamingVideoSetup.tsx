import { View } from 'react-native';
import { useState } from 'react';
import { MappButton } from './components/MappButton';
import { Routes } from './Routes';
import { MappInputBox } from './components/MappInputBox';
import { StyleSheet } from 'react-native';
import { Dialog } from './components/Dialog';

const StreamingVideoSetup = (props: { navigation: any }) => {
  const navigation = props.navigation;
  const [videoUrl, setVideoUrl] = useState<string | undefined | null>(
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8'
  );

  console.log('Streaming Video Setup - Start', videoUrl);
  return (
    <View style={styles.container}>
      <MappInputBox
        textValue={videoUrl ?? ''}
        hintValue={'Live Video Url...'}
        buttonTitle={'Clear'}
        disableWhenEmpty={true}
        buttonTitleColor={'#ffffff'}
        buttonBackgroundColor={'#06A806'}
        onClick={() => {
          setVideoUrl('');
        }}
        onValueChanged={function (newValue: string): void | null {
          setVideoUrl(newValue);
        }}
      />
      <View style={{ paddingVertical: 10 }} />
      <MappButton
        enabled={videoUrl != ''}
        buttonTitle={'Open video'}
        buttonOnPress={() => {
          if (videoUrl == '') {
            Dialog.show({
              title: 'Stream Url',
              message: "Stream URL can't be empty!",
              positiveButtonText: 'OK',
            });
          } else {
            navigation.navigate(Routes.STREAMING_VIDEO_EXAMPLE.valueOf(), {
              url: videoUrl,
            });
          }
        }}
      />
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
});
export default StreamingVideoSetup;
