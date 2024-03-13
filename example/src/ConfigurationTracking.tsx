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
import { MappInputText } from './components/MappInputText';
import { MappSwitch } from './components/MappSwitch';

export default class ConfigurationTrackingView extends Component {
  constructor(props: {
    isEnabled: boolean;
    isInitialized: boolean;
    text?: string | null;
  }) {
    super(props);
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
    return (
      <View style={DefaultStyles.sectionContainer}>
        <MappSwitch
          onCheckedChanged={this.toggleSwitch}
          isChecked={true}
          text={'Is Ready'}
          isEnabled={false}
        />
        <MappInputText
          buttonTitle="Ever ID"
          onValueChanged={(value: string) => {}}
          textValue=""
          hintValue="Ever ID"
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
