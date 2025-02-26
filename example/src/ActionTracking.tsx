import React, { Component } from 'react';
import { AppRegistry, FlatList, View } from 'react-native';
import { MappButton, DefaultStyles } from './components/MappComponents';
import {
  MappIntelligencePlugin,
  MIGender,
  type EventParameters,
  type MIBirthday,
  type SessionParameters,
  type UserCategories,
} from 'mapp-intelligence-reactnative-plugin';

export default class ActionTrackingView extends Component {
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
      case 'Track Action':
        this.trackAction();
        break;
      case 'Track Custom Action':
        this.trackCustomAction();
        break;
    }
  };

  async trackAction() {
    var eventDict = new Map<number, string>().set(20, 'ck20Param1');
    var eventParamters: EventParameters = {
      customParameters: eventDict,
    };
    await MappIntelligencePlugin.trackAction('TestAction', eventParamters);
  }

  async trackCustomAction() {
    let eventDict = new Map<number, string>().set(20, 'ck20Param1');
    let eventParamters = {
      customParameters: eventDict,
    };
    const bithday: MIBirthday = {
      day: 12,
      month: 1,
      year: 1993,
    };
    let customCategoriesDict = new Map<number, string>().set(
      20,
      "( $', /:?@=&+ !.;()-_"
    );
    let userCategories: UserCategories = {
      birthday: bithday,
      city: 'Paris',
      country: 'France',
      emailReceiverId: 'testd598378532',
      gender: MIGender.unknown,
      customerId: 'CustomerID',
      customCategories: customCategoriesDict,
    };
    let customSessionDict = new Map<number, string>().set(10, 'sessionParam1');
    const sessionParamters: SessionParameters = {
      parameters: customSessionDict,
    };
    await MappIntelligencePlugin.trackAction(
      'TestAction',
      eventParamters,
      sessionParamters,
      userCategories
    );
  }
  render() {
    return (
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[{ key: 'Track Action' }, { key: 'Track Custom Action' }]}
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

AppRegistry.registerComponent('ActionTracking', () => ActionTrackingView);
