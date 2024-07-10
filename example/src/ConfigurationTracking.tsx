import React, { useLayoutEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import { MappInputText } from './components/MappInputText';
import { MappSwitch } from './components/MappSwitch';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import TextWithLabel from './components/TextWithLabel';
import { Dialog } from './components/Dialog';
import { ExceptionType, LogLevel } from '../../src/DataTypes';

const ConfigurationTrackingView = () => {
  const [readySwitchEnabled] = useState(false);
  const [everId, setEverId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [newEverId, setNewEverId] = useState('');
  const [optedIn, setOptedIn] = useState(true);
  const [anonymousTracking, setAnonymousTracking] = useState(false);
  const [userMatching, setUserMatching] = useState(false);

  const updateEverId = async (value?: string | null) => {
    if (!value) {
      Dialog.show({
        title: 'Reset EverId',
        message:
          'Empty everID will reset and autogenerate everId. Do you want to proceed?',
        positiveButtonText: 'Yes',
        positiveAction: async () => {
          const result = await MappIntelligencePlugin.setEverId(value);
          if (result) {
            setTimeout(() => {
              init();
            }, 300);
          }
        },
        negativeButtonText: 'No',
      });
    } else {
      const result = await MappIntelligencePlugin.setEverId(value);
      if (result) {
        setTimeout(() => {
          init();
        }, 300);
      }
    }
  };

  const init = async () => {
    let isInitialized = await MappIntelligencePlugin.isInitialized();
    setIsReady(+isInitialized === 1 ? true : false);
    if (isInitialized) {
      const eId = await MappIntelligencePlugin.getEverId();
      setEverId(eId);

      let opted = await MappIntelligencePlugin.isOptedIn();
      setOptedIn(opted);

      let anonymous = await MappIntelligencePlugin.isAnonymousTracking();
      setAnonymousTracking(anonymous);

      let uMatching = await MappIntelligencePlugin.isUserMatchingEnabled();
      setUserMatching(uMatching);
    }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const updateAnonymousTracking = async (enabled: boolean) => {
    setAnonymousTracking(enabled);
    await MappIntelligencePlugin.setAnonymousTracking(enabled);
    const eId = await MappIntelligencePlugin.getEverId();
    setEverId(eId);
  };

  const updateUserMatching = async (enabled: boolean) => {
    await MappIntelligencePlugin.setEnableUserMatching(enabled);
    setUserMatching(enabled);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={DefaultStyles.sectionContainer}>
          <MappSwitch
            onCheckedChanged={(_) => {}}
            isChecked={isReady}
            text={'Is Ready'}
            isEnabled={readySwitchEnabled}
          />
          <MappSwitch
            text={
              optedIn
                ? 'Opt In - (tracking enabled)'
                : 'Opt Out - (tracking disabled)'
            }
            isChecked={optedIn}
            onCheckedChanged={function (checked: boolean): void {
              setOptedIn(checked);
              if (checked) {
                MappIntelligencePlugin.optOut(true);
              } else {
                MappIntelligencePlugin.optIn(true);
              }
            }}
            isEnabled={true}
          />
          <MappSwitch
            text={
              anonymousTracking
                ? 'Anonymous Tracking - (enabled)'
                : 'Anonymous Tracking - (disabled)'
            }
            isChecked={anonymousTracking}
            onCheckedChanged={function (checked: boolean): void {
              updateAnonymousTracking(checked);
            }}
            isEnabled={true}
          />
          <MappSwitch
            text={
              userMatching
                ? 'User matching - (enabled)'
                : 'User matching - (disabled)'
            }
            isChecked={userMatching}
            onCheckedChanged={function (checked: boolean): void {
              updateUserMatching(checked);
            }}
            isEnabled={true}
          />
          <TextWithLabel label="Current Ever ID" content={everId} />
          <MappInputText
            disableWhenEmpty={false}
            buttonTitle="Set"
            buttonTitleColor={'#ffffff'}
            buttonBackgroundColor={'#06A806'}
            onValueChanged={(value: string) => {
              setNewEverId(value);
              //MappIntelligencePlugin.setEverId(value);
            }}
            onClick={async (value) => {
              updateEverId(value);
            }}
            textValue={newEverId}
            hintValue="Ever ID"
          />
          <MappButton
            buttonTitle="Send requests and clean"
            buttonOnPress={() => {
              MappIntelligencePlugin.sendRequestsAndClean();
            }}
          />

          <MappButton
            buttonTitle="Reset"
            buttonOnPress={async () => {
              MappIntelligencePlugin.reset();
              if ((Platform.OS = 'ios')) {
                await MappIntelligencePlugin.setAnonymousTracking(false);
                await MappIntelligencePlugin.initWithConfiguration(
                  [794940687426749],
                  'http://tracker-int-01.webtrekk.net'
                );
                await MappIntelligencePlugin.setLogLevel(LogLevel.all);
                await MappIntelligencePlugin.setBatchSupportEnabled(false);
                await MappIntelligencePlugin.setBatchSupportSize(150);
                await MappIntelligencePlugin.setRequestInterval(1);
                await MappIntelligencePlugin.setRequestPerQueue(300);
                await MappIntelligencePlugin.setSendAppVersionInEveryRequest(
                  true
                );
                await MappIntelligencePlugin.setEnableBackgroundSendout(true);
                await MappIntelligencePlugin.setExceptionLogLevel(
                  ExceptionType.all
                );
                await MappIntelligencePlugin.setEnableUserMatching(false);
              }
              const everId = await MappIntelligencePlugin.getEverId();
              updateEverId(everId);
            }}
          />
          <MappButton
            buttonTitle="Init at Runtime"
            buttonOnPress={async () => {
              MappIntelligencePlugin.initWithConfiguration(
                [1, 2, 3, 4],
                'www.testDomain.com'
              );
              MappIntelligencePlugin.setLogLevel(1);
              const eId = await MappIntelligencePlugin.getEverId();
              updateEverId(eId);
            }}
          />
          <MappButton
            buttonTitle="Print current config"
            buttonOnPress={async () => {
              const config = await MappIntelligencePlugin.printCurrentConfig();
              const configFormatted = config.replace(',', '\n');
              console.log(configFormatted);
              Dialog.show({
                title: 'Config',
                message: configFormatted,
                positiveButtonText: 'OK',
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfigurationTrackingView;
