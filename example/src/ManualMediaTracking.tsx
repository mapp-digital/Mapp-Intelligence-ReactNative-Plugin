import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { MappInputText } from './components/MappInputText';
import { Text } from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappSwitch } from './components/MappSwitch';
import { MappButton } from './components/MappButton';
import {
  MediaAction,
  MediaParam,
  type MediaEvent,
  type MediaParameteres,
  type SessionParameters,
  MIStatus,
  type EcommerceParameters,
  type MIProduct,
  type EventParameters,
} from '../../src/DataTypes';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';

const ManualMediaTracking = () => {
  const [incrementOnClick, setIncrementOnClick] = useState(false);
  const [position, setPosition] = useState('0');
  const [duration, setDuration] = useState('0');
  const [mediaName, setMediaName] = useState(
    'Sample test video for React Native'
  );

  const getPosition = (): number => {
    var pos = parseFloat(position);
    if (incrementOnClick) {
      pos = pos + 5;
      setPosition(pos.toString());
    }
    return pos;
  };

  const getDuration = (): number => {
    const dur = parseFloat(duration);
    return dur;
  };
  const onAction1 = (action: MediaAction) => {
    console.log('Action: ', action.valueOf());
    const params = new Map<MediaParam, string>([
      [MediaParam.media_action, action.valueOf()],
      [MediaParam.media_position, getPosition().toString()],
      [MediaParam.media_duration, getDuration().toString()],
      [MediaParam.name, mediaName.toString()],
    ]);

    MappIntelligencePlugin.trackMedia(
      params,
      mediaName,
      'Manual Media Tracking'
    );
  };

  const onAction2 = (action: MediaAction) => {
    console.log('Action: ', action.valueOf());
    const customMediaCategories = new Map<number, string>([[20, 'mediaCat']]);
    const mediaParams: MediaParameteres = {
      name: mediaName,
      action: action.valueOf(),
      position: getPosition(),
      duration: getDuration(),
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

    const mediaEvent: MediaEvent = {
      pageName: 'Manual Media Tracking',
      parameters: mediaParams,
      customParameters: customParams,
      eCommerceParameters: ecommerceParam,
      eventParameters: eventParameters,
      sessionParameters: sessionParameters,
    };

    MappIntelligencePlugin.trackMedia(mediaEvent);
  };
  return (
    <SafeAreaView style={DefaultStyles.sectionContainer}>
      <View>
        <ScrollView>
          <View>
            <Text>Media Name</Text>
            <MappInputText
              textValue={mediaName}
              hintValue={'Media name'}
              buttonTitle={''}
              onValueChanged={(newValue?: string | null) => {
                setMediaName(newValue ?? '');
              }}
            ></MappInputText>
          </View>
          <View style={{ height: 20 }} />
          <View style={styles.row}>
            <View style={styles.box}>
              <Text>Current position</Text>
              <MappInputText
                textValue={position.toString()}
                hintValue={'current position'}
                buttonTitle={''}
                onValueChanged={(newValue?: string | null) => {
                  setPosition(newValue ?? '0');
                }}
                keyboardMode={'decimal'}
              />
            </View>
            <View style={{ width: 20 }} />
            <View style={styles.box}>
              <Text>Duration</Text>
              <MappInputText
                textValue={duration.toString()}
                hintValue={'duration'}
                buttonTitle={''}
                onValueChanged={(newValue?: string | null) => {
                  setDuration(newValue ?? '0');
                }}
                keyboardMode={'decimal'}
              />
            </View>
          </View>
          <View style={{ height: 20 }} />
          <MappSwitch
            text={
              'Increment current position by 5 seconds on each action click'
            }
            isChecked={incrementOnClick}
            onCheckedChanged={(checked: boolean) => {
              setIncrementOnClick(checked);
            }}
            isEnabled={true}
          ></MappSwitch>
          <View style={{ height: 20 }} />
          <MappButton
            buttonTitle={'INIT'}
            buttonOnPress={() => {
              onAction1(MediaAction.init);
            }}
          />
          <MappButton
            buttonTitle={'PLAY'}
            buttonOnPress={() => {
              onAction2(MediaAction.play);
            }}
          />
          <MappButton
            buttonTitle={'PAUSE'}
            buttonOnPress={() => {
              onAction1(MediaAction.pause);
            }}
          />
          <MappButton
            buttonTitle={'STOP'}
            buttonOnPress={() => {
              onAction2(MediaAction.stop);
            }}
          />
          <MappButton
            buttonTitle={'POSITION'}
            buttonOnPress={() => {
              onAction1(MediaAction.pos);
            }}
          />
          <MappButton
            buttonTitle={'SEEK'}
            buttonOnPress={() => {
              onAction2(MediaAction.seek);
            }}
          />
          <MappButton
            buttonTitle={'EOF'}
            buttonOnPress={() => {
              onAction1(MediaAction.eof);
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },
  box: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default ManualMediaTracking;
