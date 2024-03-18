import React, { Component } from 'react';

import { AppRegistry, FlatList, View, Alert } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';

export default class FlatListBasics extends Component {
  navigation: any;

  renderSeparator = () => {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };
  //handling onPress action
  getListViewItem = (item: any) => {
    switch (item.key) {
      case 'Configuration':
        this.navigation.navigate('ConfigurationTracking');
        return 'configuration tracking';
      case 'Page Tracking':
        this.navigation.navigate('PageTracking');
        return 'page tracking';
      case 'Action':
        this.navigation.navigate('ActionTracking');
        return 'action tracking';
      case 'Campaign':
        this.navigation.navigate('CampaignTracking');
        return 'campaign tracking';
      case 'Ecommerce':
        this.navigation.navigate('EcommerceTracking');
        return 'ecommerce tracking';
      case 'Webview':
        return 'Z';
      case 'Media':
        this.navigation.navigate('MediaTracking');
        return 'media tracking';
      case 'Exceptions':
        this.navigation.navigate('ExceptionTracking');
        return 'exception tracking';
      default:
        this.navigation.navigate('Home');
        return 'Home';
    }
  };

  render() {
    return (
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: 'Configuration' },
            { key: 'Page Tracking' },
            { key: 'Action' },
            { key: 'Campaign' },
            { key: 'Ecommerce' },
            { key: 'Webview' },
            { key: 'Media' },
            { key: 'Exceptions' },
          ]}
          renderItem={({ item }) => (
            <MappButton
              buttonTitle={item.key}
              buttonOnPress={() => {
                this.getListViewItem(item);
              }}
            />
          )}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
