import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import {
  MediaAction,
  type EventParameters,
  type MediaEvent,
  type MediaParameteres,
  type SessionParameters,
  MIStatus,
  type EcommerceParameters,
  type MIProduct,
} from '../../src/DataTypes';
import { useNavigation } from '@react-navigation/native';
import { Dialog } from './components/Dialog';

const StreamingVideoExample = () => {
  const navigation = useNavigation();

  const sources: MediaSource[] = [
    {
      title: 'Stream',
      url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    },
    {
      title: 'Stream 2',
      url: 'https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8',
    },
  ];

  const REPEAT_TIME_MS = 5000;

  const videoRef = useRef<VideoRef>(null);

  const [videoProgress, setVideoProgress] = useState<{
    currentTime: number;
    duration: number;
    seekable: number;
  }>({ currentTime: 0, duration: 0, seekable: 0 });

  const [busy, setBusy] = useState(false);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  /**
   * Method to create and send EOF media event
   */
  const onEof = async () => {
    console.log('onEof - started!');

    const customCategories: Map<number, string> = new Map([
      [1, 'CustomParam1'],
      [2, 'CustomParam2'],
    ]);
    const mediaParams: MediaParameteres = {
      name: 'Big Bunny',
      action: MediaAction.eof.valueOf(),
      position: videoProgress.currentTime,
      duration: 0, // for streaming video set duration to 0
      customCategories: customCategories,
    };
    const mediaEvent: MediaEvent = {
      pageName: 'Streaming Video Sample',
      parameters: mediaParams,
    };

    await MappIntelligencePlugin.trackMedia(mediaEvent);
    console.log('onEof - finished!');
  };

  const onProgressEvent = async (
    current: number,
    playableDuration: number,
    seekableDuration: number
  ) => {
    console.log(
      'Current time: ' +
        current +
        ';  Playable time: ' +
        playableDuration +
        ';  Seekable time: ' +
        seekableDuration
    );

    const product: MIProduct = {
      name: 'Product 1',
      cost: 13,
      quantity: 4,
      productSoldOut: false,
      categories: new Map<number, string>([
        [1, 'ProductCat1'],
        [2, 'ProductCat2'],
      ]),
    };
    const ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.noneStatus,
      currency: 'EUR',
      orderID: 'ud679adn',
      orderValue: 456,
      returningOrNewCustomer: 'new customer',
      returnValue: 3,
      cancellationValue: 2,
      couponValue: 33,
      paymentMethod: 'cash',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'highest',
      shippingCost: 35,
      markUp: 1,
      orderStatus: 'order received',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    const customSessionParams = new Map<number, string>().set(
      10,
      'sessionParam1'
    );
    const sessionParameters: SessionParameters = {
      parameters: customSessionParams,
    };

    const customCategories: Map<number, string> = new Map([
      [1, 'CustomCat1'],
      [2, 'CustomCat2'],
    ]);

    const mediaParams: MediaParameteres = {
      name: 'Big Bunny',
      action: MediaAction.pos.valueOf(),
      position: current,
      duration: 0, // for streaming video set duration to 0
      customCategories: customCategories,
    };

    const customParams = new Map<number, string>([[1, 'CustomParam1']]);

    const eventParameters: EventParameters = {
      customParameters: new Map<number, string>([[1, 'MediaEventParam1']]),
    };

    const mediaEvent: MediaEvent = {
      pageName: 'Streaming Video Sample',
      parameters: mediaParams,
      sessionParameters: sessionParameters,
      eCommerceParameters: ecommerceParam,
      customParameters: customParams,
      eventParameters: eventParameters,
    };

    await MappIntelligencePlugin.trackMedia(mediaEvent);
  };

  /**
   * Listener for playing status; Send play/pause media event.
   * @param isPlaying is true when video is playing; otherwise is false
   */
  const onPlaybackStateChangedEvent = async (isPlaying: boolean) => {
    console.log('Is Playing: ' + isPlaying);
    var action = MediaAction.stop.valueOf();

    if (isPlaying) action = MediaAction.play.valueOf();
    else action = MediaAction.pause.valueOf();

    const customCategories: Map<number, string> = new Map([
      [1, 'CustomParam1'],
      [2, 'CustomParam2'],
    ]);

    const mediaParams: MediaParameteres = {
      name: 'Big Bunny',
      action: action,
      position: videoProgress.currentTime,
      duration: 0, // for streaming video set duration to 0
      customCategories: customCategories,
    };
    const mediaEvent: MediaEvent = {
      pageName: 'Streaming Video Sample',
      parameters: mediaParams,
    };

    await MappIntelligencePlugin.trackMedia(mediaEvent);
  };

  /**
   * When video loaded, send INIT media event
   * @param currentTime
   * @param duration
   */
  const onLoadEvent = async (currentTime: number, duration: number) => {
    console.log('OnLoad: ');

    const customCategories: Map<number, string> = new Map([
      [1, 'CustomParam1'],
      [2, 'CustomParam2'],
    ]);
    const mediaParams: MediaParameteres = {
      name: 'Big Buck Bunny',
      action: MediaAction.init.valueOf(),
      position: currentTime,
      duration: duration,
      customCategories: customCategories,
    };
    const mediaEvent: MediaEvent = {
      pageName: 'Streaming Video Sample',
      parameters: mediaParams,
    };

    await MappIntelligencePlugin.trackMedia(mediaEvent);
  };

  // subscribe navigation event when screen is about to unmount
  // send EOF media event
  React.useEffect(() => {
    const unsubscribe: any = navigation.addListener('blur', async () => {
      await onEof();

      return unsubscribe;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        // Can be a URL or a local file.
        source={{ uri: sources[0]?.url }}
        // Store reference
        ref={videoRef}
        // Callback when video cannot be loaded
        onError={(e) => {
          console.log(e);
          const errorMessage = e.error.errorString ?? 'Unknown error';
          Dialog.show({
            title: 'Error Playing Video',
            message: errorMessage,
            positiveButtonText: 'OK',
          });
        }}
        resizeMode="none"
        style={styles.backgroundVideo}
        controls={true}
        onVolumeChange={(e) => {
          console.log(e);
        }}
        collapsable={false}
        onProgress={(e) => {
          setVideoProgress({
            currentTime: e.currentTime,
            duration: e.playableDuration,
            seekable: e.seekableDuration,
          });
          videoProgress.currentTime = e.currentTime;
          videoProgress.duration = e.playableDuration;
          videoProgress.seekable = e.seekableDuration;
          if (!busy) {
            setBusy(true);
            clearTimeout(timeoutId);
            const timeId = setTimeout(() => {
              if (navigation.isFocused()) {
                onProgressEvent(
                  e.currentTime,
                  e.playableDuration,
                  e.seekableDuration
                );
                setBusy(false);
              }
            }, REPEAT_TIME_MS);
            setTimeoutId(timeId);
          }
        }}
        onLoad={(e) => {
          e.naturalSize.orientation;
          onLoadEvent(e.currentTime, e.duration);
        }}
        onPlaybackStateChanged={(e) => {
          onPlaybackStateChangedEvent(e.isPlaying);
        }}
      />
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
  },
});

interface IMediaSource {
  title: string;
  url: string;
}
type MediaSource = Required<IMediaSource>;

export default StreamingVideoExample;
