import React, { Component } from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { DefaultStyles } from './components/Styles';
import { MappButton } from './components/MappButton';

export default class ExceptionTrackingView extends Component {
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
            { key: 'Track Exception With Name' },
            { key: 'Track Error' },
            { key: 'Uncought Error' },
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

AppRegistry.registerComponent('ExceptionTracking', () => ExceptionTrackingView);
