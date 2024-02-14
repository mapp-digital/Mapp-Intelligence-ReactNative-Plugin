import React, { Component } from 'react';
import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import { AppRegistry, FlatList, StyleSheet, View, Button } from 'react-native';

export default class PageTrackingView extends Component {
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
      case 'Track Page':
        MappIntelligence.trackPage();
        return 'haha';
      case 'Track Custom Page':
        return 'haha';
      case 'Track Page with Custom Data':
        return 'haha';

      default:
        break;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            { key: 'Track Page' },
            { key: 'Track Custom Page' },
            { key: 'Track Page with Custom Data' },
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

AppRegistry.registerComponent('PageTracking', () => PageTrackingView);
