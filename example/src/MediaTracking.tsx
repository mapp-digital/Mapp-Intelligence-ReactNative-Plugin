import React from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import {
  MediaParam,
  type MediaEvent,
  type MediaParameteres,
  type EventParameters,
  type EcommerceParameters,
  type MIProduct,
  MIStatus,
  type SessionParameters,
} from '../../src/DataTypes';

function MediaTrackingView(props: { navigation: any }) {
  const TEST_MEDIA = 'Test Media';
  const PLAY_EXAMPLE = 'Play Example';
  const LIVE_STREAM_EXAMPLE = 'Live Stream Example';
  const MANUAL_MEDIA_TRACKING = 'Manual Media Tracking';

  //const navigation = useNavigation();
  //handling onPress action
  const getListViewItem = (item: any) => {
    switch (item.key) {
      case TEST_MEDIA:
        testMedia();
        break;
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

  const testMedia = async () => {
    // let trackingParams: Map<MediaParam, string> = new Map<MediaParam, string>([
    //   [MediaParam.media_position, '100'],
    //   [MediaParam.bandwidth, '80kbps'],
    // ]);

    // await MappIntelligencePlugin.trackMedia(
    //   trackingParams,
    //   'Bunny 3gp',
    //   'Media Tracking'
    // );
    props.navigation.navigate('VideoPlayer');
  };

  const playExample = async () => {
    const customMediaCategories = new Map<number, string>([[20, 'mediaCat']]);
    const mediaParams: MediaParameteres = {
      name: 'Test Video',
      action: 'view',
      position: 10,
      duration: 80,
      soundVolume: 6,
      soundIsMuted: false,
      bandwith: 140,
      customCategories: customMediaCategories,
    };

    const eventParameters: EventParameters = {
      customParameters: new Map<number, string>([[1, 'MediaParam1']]),
    };

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

    const customSessionDict = new Map<number, string>().set(
      10,
      'sessionParam1'
    );
    const sessionParameters: SessionParameters = {
      parameters: customSessionDict,
    };

    const customParams = new Map<number, string>([[1, 'Param1']]);

    let mediaEvent: MediaEvent = {
      pageName: 'Playing Video Page',
      parameters: mediaParams,
      eventParameters: eventParameters,
      customParameters: customParams,
      eCommerceParameters: ecommerceParam,
      sessionParameters: sessionParameters,
    };
    await MappIntelligencePlugin.trackMedia(mediaEvent);
  };

  const livestreamExample = async () => {
    let mediaParams: MediaParameteres = {
      name: 'Live Stream Video',
      action: 'play',
      position: 51,
      duration: 0,
      customCategories: new Map<number, string>([[15, 'mediaCat2']]),
    };
    let mediaEvent: MediaEvent = {
      pageName: 'Live Streaming Page',
      parameters: mediaParams,
    };
    await MappIntelligencePlugin.trackMedia(mediaEvent);
  };

  const manualMediaTracking = async () => {
    props.navigation.navigate('ManualMediaTracking');
  };

  return (
    <SafeAreaView>
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: TEST_MEDIA },
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
