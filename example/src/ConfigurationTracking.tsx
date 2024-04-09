import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import { MappInputText } from './components/MappInputText';
import { MappSwitch } from './components/MappSwitch';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import TextWithLabel from './components/TextWithLabel';
import { Dialog } from './components/Dialog';

const ConfigurationTrackingView = () => {
  const [readySwitchEnabled] = useState(false);
  const [everId, setEverId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [newEverId, setNewEverId] = useState('');

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
              MappIntelligencePlugin.setEverId(value);
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
          <MappButton buttonTitle="Init with everID" buttonOnPress={() => {}} />
          <MappButton
            buttonTitle="Opt out"
            buttonOnPress={() => {
              MappIntelligencePlugin.optOut(true);
            }}
          />
          <MappButton
            buttonTitle="Opt in"
            buttonOnPress={() => {
              MappIntelligencePlugin.optIn(true);
            }}
          />
          <MappButton
            buttonTitle="Reset"
            buttonOnPress={() => {
              MappIntelligencePlugin.reset();
            }}
          />
          <MappButton
            buttonTitle="Init at Runtime"
            buttonOnPress={() => {
              MappIntelligencePlugin.initWithConfiguration(
                [1, 2, 3, 4],
                'www.testDomain.com'
              );
              MappIntelligencePlugin.setLogLevel(1);
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
