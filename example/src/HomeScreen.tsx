import React from 'react';

import { FlatList, View } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import { Routes } from './Routes';

const HomeScreen = (props: { navigation: any }) => {
  const routeNames = props.navigation.getState().routeNames;
  console.log('Navigation State:', routeNames);

  return (
    <View style={DefaultStyles.sectionContainer}>
      <FlatList
        data={[
          Routes.CONFIG_TRACKING,
          Routes.PAGE_TRACKING,
          Routes.ACTION_TRACKING,
          Routes.CAMPAIGN_TRACKING,
          Routes.ECOMMERCE_TRACKING,
          Routes.MEDIA_TRACKING,
          Routes.EXCEPTION_TRACKING,
          Routes.WEBVIEW_TRACKING,
        ]}
        renderItem={({ item }) => (
          <MappButton
            buttonTitle={item.valueOf()}
            buttonOnPress={() => {
              props.navigation.navigate(item.valueOf());
            }}
            enabled={routeNames.includes(item.valueOf())}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
