import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import { Mapp } from 'react-native-mapp-plugin';
import PageTrackingView from './PageTracking';
import ActionTrackingView from './ActionTracking';
import CampaignTrackingView from './CampaignTracking';
import EcommerceTrackingView from './EcommerceTracking';
import MediaTrackingView from './MediaTracking';
import ExceptionTrackingView from './ExceptionTracking';
import ConfigurationTrackingView from './ConfigurationTracking';
import WebViewTracking from './WebViewTracking';
import { ExceptionType, LogLevel } from '../../src/DataTypes';
import StreamingVideoExample from './StreamingVideoExample';
import ManualMediaTracking from './ManualMediaTracking';
import VideoExample from './VideoExample';
import HomeScreen from './HomeScreen';
import { Routes } from './Routes';
import { Dialog } from './components/Dialog';

const Stack = createNativeStackNavigator();
const PageTracking = () => {
  return new PageTrackingView({}).render();
};

const DefaultPage = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenListeners={{
          transitionEnd: (e) => {
            if (e.data.closing !== true) {
              console.log(
                'Transition end: ',
                e.target?.substring(0, e.target?.indexOf('-'))
              );
            }
          },
        }}
      >
        <Stack.Screen name={Routes.HOME.valueOf()} component={Home} />
        <Stack.Screen
          name={Routes.PAGE_TRACKING.valueOf()}
          component={PageTracking}
        />
        <Stack.Screen
          name={Routes.ACTION_TRACKING.valueOf()}
          component={ActionTrackingView}
        />
        <Stack.Screen
          name={Routes.CAMPAIGN_TRACKING.valueOf()}
          component={CampaignTrackingView}
        />
        <Stack.Screen
          name={Routes.ECOMMERCE_TRACKING.valueOf()}
          component={EcommerceTrackingView}
        />
        <Stack.Screen
          name={Routes.MEDIA_TRACKING.valueOf()}
          component={MediaTrackingView}
        />
        <Stack.Screen
          name={Routes.EXCEPTION_TRACKING.valueOf()}
          component={ExceptionTrackingView}
        />
        <Stack.Screen
          name={Routes.CONFIG_TRACKING.valueOf()}
          component={ConfigurationTrackingView}
        />
        <Stack.Screen
          name={Routes.STREAMING_VIDEO_EXAMPLE.valueOf()}
          component={StreamingVideoExample}
        />
        <Stack.Screen
          name={Routes.VIDEO_EXAMPLE.valueOf()}
          component={VideoExample}
        />
        <Stack.Screen
          name={Routes.MANUAL_MEDIA_TRACKING.valueOf()}
          component={ManualMediaTracking}
        />
        {
          <Stack.Screen
            name={Routes.WEBVIEW_TRACKING.valueOf()}
            component={WebViewTracking}
          />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Home = ({ navigation }: { navigation: any }) => {
  Dialog.show({
    title: 'Consent',
    message: 'Allow tracking with Ever ID?',
    positiveButtonText: 'Yes',
    positiveAction: async () => {
      await initMappTracking(false);
    },
    negativeButtonText: 'No',
    negativeAction: async () => {
      await initMappTracking(true);
    },
  });

  const home = HomeScreen({ navigation });
  return home;
};

const initMappTracking = async (anonymous: boolean) => {
  await MappIntelligence.setAnonymousTracking(anonymous);
  await MappIntelligence.initWithConfiguration(
    [794940687426749],
    'http://tracker-int-01.webtrekk.net'
  );
  await MappIntelligence.setLogLevel(LogLevel.all);
  await MappIntelligence.setBatchSupportEnabled(false);
  await MappIntelligence.setBatchSupportSize(150);
  await MappIntelligence.setRequestInterval(1);
  await MappIntelligence.setRequestPerQueue(300);
  await MappIntelligence.setShouldMigrate(true);
  await MappIntelligence.setSendAppVersionInEveryRequest(true);
  await MappIntelligence.setEnableBackgroundSendout(true);
  await MappIntelligence.setExceptionLogLevel(ExceptionType.all);
  await MappIntelligence.setEnableUserMatching(true);

  await MappIntelligence.build();

  Mapp.engage(
    '183408d0cd3632.83592719',
    '785651527831',
    'L3',
    '206974',
    '5963'
  );
};

const App = () => {
  return <DefaultPage />;
};

export default App;
