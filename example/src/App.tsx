import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import FlatListBasics from './mainView';
import PageTrackingView from './PageTracking';
import ActionTrackingView from './ActionTracking';
import CampaignTrackingView from './CampaignTracking';
import EcommerceTrackingView from './EcommerceTracking';
import MediaTrackingView from './MediaTracking';
import ExceptionTrackingView from './ExceptionTracking';
import ConfigurationTrackingView from './ConfigurationTracking';

const Stack = createNativeStackNavigator();
export default function App() {
  function Home({ navigation }: { navigation: any }) {
    var home = new FlatListBasics({});
    initMappTracking();
    home.navigation = navigation;
    return home.render();
  }

  async function initMappTracking() {
    await MappIntelligence.setAnonymousTracking(false);
    await MappIntelligence.initWithConfiguration(
      [794940687426749],
      'http://tracker-int-01.webtrekk.net'
    );
    await MappIntelligence.setLogLevel(1);
    await MappIntelligence.setBatchSupportEnabled(false);
    await MappIntelligence.setBatchSupportSize(150);
    await MappIntelligence.setRequestInterval(1);
    await MappIntelligence.setRequestPerQueue(300);
    await MappIntelligence.setShouldMigrate(true);
    await MappIntelligence.setSendAppVersionInEveryRequest(true);
    await MappIntelligence.setEnableBackgroundSendout(true);
    await MappIntelligence.setEnableUserMatching(false);
    await MappIntelligence.build();
  }

  function PageTracking() {
    return new PageTrackingView({}).render();
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PageTracking" component={PageTracking} />
        <Stack.Screen name="ActionTracking" component={ActionTrackingView} />
        <Stack.Screen
          name="CampaignTracking"
          component={CampaignTrackingView}
        />
        <Stack.Screen
          name="EcommerceTracking"
          component={EcommerceTrackingView}
        />
        <Stack.Screen name="MediaTracking" component={MediaTrackingView} />
        <Stack.Screen
          name="ExceptionTracking"
          component={ExceptionTrackingView}
        />
        <Stack.Screen
          name="ConfigurationTracking"
          component={ConfigurationTrackingView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
