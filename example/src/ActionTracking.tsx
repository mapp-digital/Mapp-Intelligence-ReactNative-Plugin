import React, { Component } from 'react';
import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import { AppRegistry, FlatList, StyleSheet, View, Button } from 'react-native';
import {
  MIGender,
  type EventParameters,
  type UserCategories,
  type MIBirthday,
  type SessionParameters,
} from '../../src/helperMethods';

import {
  MappButton,
  MappInputText,
  DefaultStyles,
} from './components/MappComponents';

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
        var eventDict = new Map<number, string>().set(20, 'ck20Param1');
        var eventParamters: EventParameters = {
          customParameters: eventDict,
        };
        MappIntelligence.trackAction('TestAction', eventParamters);
        break;
      case 'Track Custom Action':
        var eventDict = new Map<number, string>().set(20, 'ck20Param1');
        eventParamters = {
          customParameters: eventDict,
        };
        const bithday: MIBirthday = {
          day: 12,
          month: 1,
          year: 1993,
        };
        var customCategoriesDict = new Map<number, string>().set(
          20,
          "( $', /:?@=&+ !.;()-_*"
        );
        var userCategories: UserCategories = {
          birthday: bithday,
          city: 'Paris',
          country: 'France',
          emailReceiverId: 'testd598378532',
          gender: MIGender.unknown,
          customerId: 'CustomerID',
          customCategories: customCategoriesDict,
        };
        var customSessionDict = new Map<number, string>().set(
          10,
          'sessionParam1'
        );
        const sessionParamters: SessionParameters = {
          parameters: customSessionDict,
        };
        MappIntelligence.trackAction(
          'TestAction',
          eventParamters,
          sessionParamters,
          userCategories
        );
        break;

      default:
        break;
    }
  };

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
