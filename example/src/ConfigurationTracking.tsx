import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import { MappInputText } from './components/MappInputText';
import { MappSwitch } from './components/MappSwitch';
import TextWithLabel from './components/TextWithLabel';
import { Dialog } from './components/Dialog';
import {
  ExceptionType,
  LogLevel,
  MappIntelligencePlugin,
} from 'mapp-intelligence-reactnative-plugin';

const ConfigurationTrackingView = () => {
  const [readySwitchEnabled] = useState(false);
  const [everId, setEverId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [newEverId, setNewEverId] = useState('');
  const [resetReady, setResetReady] = useState(true);

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
      let everId = await MappIntelligencePlugin.getEverId();
      setEverId(everId);
    }
  };

  init();
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
            buttonTitle="Opt out"
            buttonOnPress={async () => {
              MappIntelligencePlugin.optOut(true);
              const everId = await MappIntelligencePlugin.getEverId();
              updateEverId(everId);
            }}
          />
          <MappButton
            buttonTitle="Opt in"
            buttonOnPress={async () => {
              MappIntelligencePlugin.optIn(true);
              const everId = await MappIntelligencePlugin.getEverId();
              updateEverId(everId);
            }}
          />
          <MappButton
            buttonTitle="Reset"
            enabled={resetReady}
            lockDelay={1000}
            buttonOnPress={async () => {
              setResetReady(false);
              await MappIntelligencePlugin.reset();
              if (Platform.OS === 'ios') {
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
                await MappIntelligencePlugin.setShouldMigrate(true);
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
              await updateEverId(everId);
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
              const everId = await MappIntelligencePlugin.getEverId();
              updateEverId(everId);
            }}
          />
          <MappButton
            buttonTitle="Print current config"
            buttonOnPress={async () => {
              const config = await MappIntelligencePlugin.printCurrentConfig();
              console.log(config);
            }}
          />
          <MappButton
            buttonTitle="User matching set to true"
            buttonOnPress={() => {
              MappIntelligencePlugin.setEnableUserMatching(true);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfigurationTrackingView;
