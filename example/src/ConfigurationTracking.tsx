import React, { Component, useState } from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
  TextInput,
} from 'react-native';

export default class ConfigurationTrackingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      text: 'Useless Text',
    };
  }
  toggleSwitch = () => setIsEnabled((previousState) => !previousState);
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
    function onChangeNumber(_text: string): void {
      throw new Error('Function not implemented.');
    }

    return (
      <View style={styles.container}>
        <Text>EverID:090909090</Text>
        <Text>Anonymous tracking</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={this.toggleSwitch}
          value={this.state.isEnabled}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={this.state.text}
          placeholder="Ever ID"
        />
        <FlatList
          data={[
            { key: 'Init with everID' },
            { key: 'Opt out' },
            { key: 'Opt in' },
            { key: 'Reset' },
            { key: 'Init at Runtime' },
            { key: 'User matching set to true' },
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

AppRegistry.registerComponent(
  'ConfigurationTracking',
  () => ConfigurationTrackingView
);
function setIsEnabled(_arg0: (previousState: any) => boolean) {
  throw new Error('Function not implemented.');
}
