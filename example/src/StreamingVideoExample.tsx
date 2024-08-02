import React, { useRef } from 'react';
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
import { Dialog } from './components/Dialog';

type VideoProgress = {
  currentTime: number;
  duration: number;
  seekable: number;
};

const StreamingVideoExample = (props: { route: any; navigation: any }) => {
  const params = props.route.params;
  const navigation = props.navigation;
  const url = params['url'];
  console.log('Received URL', url);
  //const navigation = useNavigation();

  const REPEAT_TIME_MS = 5000;

  const videoRef = useRef<VideoRef>(null);

  var videoProgress: VideoProgress = {
    currentTime: 0,
    duration: 0,
    seekable: 0,
  };

  var busy = false;

  var timeoutId: NodeJS.Timeout | undefined;

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
        source={{ uri: url }}
        // Store reference
        ref={videoRef}
        // Callback when video cannot be loaded
        onError={(e) => {
          console.log(e);
          const errorMessage = e.error.errorString ?? 'Unknown error';
          Dialog.show({
            title: 'Video Player Error',
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
          videoProgress = {
            currentTime: e.currentTime,
            duration: e.playableDuration,
            seekable: e.seekableDuration,
          };

          if (!busy) {
            busy = true;
            clearTimeout(timeoutId);
            const timeId = setTimeout(() => {
              if (navigation.isFocused()) {
                onProgressEvent(
                  e.currentTime,
                  e.playableDuration,
                  e.seekableDuration
                );
                busy = false;
              }
            }, REPEAT_TIME_MS);
            timeoutId = timeId;
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
//@ts-ignore
type MediaSource = Required<IMediaSource>;

export default StreamingVideoExample;
