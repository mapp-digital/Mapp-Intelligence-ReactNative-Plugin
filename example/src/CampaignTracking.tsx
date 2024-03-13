import React, { Component } from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';

export default class CampaignTrackingView extends Component {
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
    Alert.alert(item.key);
  };

  render() {
    return (
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: 'Track Campaign' },
            { key: 'Test Link1' },
            { key: 'Test Link2' },
          ]}
          renderItem={({ item }) => (
            <MappButton
              buttonTitle={item.key}
              buttonOnPress={() => {
                this.getListViewItem.bind(this, item);
              }}
            />
          )}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('CampaignTracking', () => CampaignTrackingView);
