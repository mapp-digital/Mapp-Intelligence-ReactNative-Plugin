import React, { Component } from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

export default class MediaTrackingView extends Component {
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
      <View style={styles.container}>
        <FlatList
          data={[
            { key: 'Test Media1' },
            { key: 'Play Example' },
            { key: 'Play Example2' },
            { key: 'Live Stream Example' },
          ]}
          renderItem={({ item }) => (
            <Text
              style={styles.item}
              onPress={this.getListViewItem.bind(this, item)}
            >
              {item.key}
            </Text>
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

AppRegistry.registerComponent('MediaTracking', () => MediaTrackingView);
