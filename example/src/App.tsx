import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// @ts-ignore
import { Mapp } from 'react-native-mapp-plugin';
import PageTrackingView from './PageTracking';
import ActionTrackingView from './ActionTracking';
import CampaignTrackingView from './CampaignTracking';
import EcommerceTrackingView from './EcommerceTracking';
import MediaTrackingView from './MediaTracking';
import ExceptionTrackingView from './ExceptionTracking';
import ConfigurationTrackingView from './ConfigurationTracking';
import WebViewTracking from './WebViewTracking';
import StreamingVideoExample from './StreamingVideoExample';
import ManualMediaTracking from './ManualMediaTracking';
import VideoExample from './VideoExample';
import HomeScreen from './HomeScreen';
import { Routes } from './Routes';
import {
  MappIntelligencePlugin,
  ExceptionType,
  LogLevel,
} from 'mapp-intelligence-reactnative-plugin';
import FetchExample from './FetchExample';

const Stack = createNativeStackNavigator();

const App = () => {
  function Home({ navigation }: { navigation: any }) {
    initMappTracking();
    const home = HomeScreen({ navigation });
    return home;
  }

  async function initMappTracking() {
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
    await MappIntelligencePlugin.setSendAppVersionInEveryRequest(true);
    await MappIntelligencePlugin.setEnableBackgroundSendout(true);
    await MappIntelligencePlugin.setExceptionLogLevel(ExceptionType.all);
    await MappIntelligencePlugin.setEnableUserMatching(true);

    await MappIntelligencePlugin.build();

    Mapp.engage(
      '183408d0cd3632.83592719',
      '785651527831',
      'L3',
      '206974',
      '5963'
    );
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
          {
            <Stack.Screen
              name={Routes.WEBVIEW_TRACKING.valueOf()}
              component={WebViewTracking}
            />
          }
                    {
            <Stack.Screen
              name={Routes.FETCH_EXAMPLE.valueOf()}
              component={FetchExample}
            />
          }
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return <DefaultPage />;
};

export default App;
