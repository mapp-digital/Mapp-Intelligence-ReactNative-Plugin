import React, { Component } from 'react';
import { AppRegistry, FlatList, View, Alert } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';

export default class EcommerceTrackingView extends Component {
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
            { key: 'View Product' },
            { key: 'Add to Basket' },
            { key: 'Confirmation' },
            { key: 'Delete from cart' },
            { key: 'Add to whishlist' },
            { key: 'Delete from whishlist' },
            { key: 'Checkout' },
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

AppRegistry.registerComponent('EcommerceTracking', () => EcommerceTrackingView);
