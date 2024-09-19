import { View } from 'react-native';
import { useState } from 'react';
import { MappButton } from './components/MappButton';
import { Routes } from './Routes';
import { MappInputBox } from './components/MappInputBox';
import { StyleSheet } from 'react-native';
import { Dialog } from './components/Dialog';

const urlPattern = new RegExp(
  '^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i' // fragment locator
);

const isValidUrl = (url?: string | null) => {
  const nonEmptyUrl = String(url ?? '').toLowerCase();
  const valid = urlPattern.test(nonEmptyUrl);
  console.log('Is URL Valid: ', nonEmptyUrl, valid);
  return valid;
};

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
        enabled={isValidUrl(videoUrl)}
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
