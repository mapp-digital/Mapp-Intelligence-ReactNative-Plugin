import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import PageTrackingView from './PageTracking';
import ActionTrackingView from './ActionTracking';
import CampaignTrackingView from './CampaignTracking';
import EcommerceTrackingView from './EcommerceTracking';
import MediaTrackingView from './MediaTracking';
import ExceptionTrackingView from './ExceptionTracking';
import ConfigurationTrackingView from './ConfigurationTracking';
import { ExceptionType, LogLevel } from '../../src/DataTypes';
import StreamingVideoExample from './StreamingVideoExample';
import ManualMediaTracking from './ManualMediaTracking';
import VideoExample from './VideoExample';
import HomeScreen from './HomeScreen';
import { Routes } from './Routes';

const Stack = createNativeStackNavigator();

const App = () => {
  function Home({ navigation }: { navigation: any }) {
    initMappTracking();
    const home = HomeScreen({ navigation });
    return home;
  }

  async function initMappTracking() {
    await MappIntelligence.setAnonymousTracking(false);
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
    await MappIntelligence.setEnableUserMatching(false);

    await MappIntelligence.build();
  }

  function PageTracking() {
    return new PageTrackingView({}).render();
  }

  function DefaultPage() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenListeners={{
            transitionEnd: (e) => {
              if (e.data.closing != true) {
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return <DefaultPage />;
};

export default App;
