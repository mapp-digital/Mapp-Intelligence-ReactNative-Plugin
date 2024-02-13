import React, { Component } from 'react';

import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
} from 'react-native';
import PageTrackingView from './PageTracking';
const showAlert = () =>
  Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
      {
        text: 'Cancel',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    }
  );
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
        return 'z';
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
        Alert.alert(item.key);
    }
  };

  render() {
    return (
      <View style={styles.container}>
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
            <Button
              title={item.key}
              onPress={() => {
                this.getListViewItem(item);
              }}
            />
          )}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
