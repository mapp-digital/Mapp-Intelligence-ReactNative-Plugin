import React, { Component } from 'react';
import * as MappIntelligence from 'react-native-mappinteligence-plugin';
import {
  MIGender,
  type MIBirthday,
  type PageParameters,
  type UserCategories,
  type SessionParameters,
} from '../../src/helperMethods';
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
        var paramsDict = new Map<number, string>().set(20, 'cp20Override');
        var categoriesDict = new Map<number, string>();
        categoriesDict.set(10, 'test');
        const pagaParameters: PageParameters = {
          params: JSON.stringify(Object.fromEntries(paramsDict)),
          categories: JSON.stringify(Object.fromEntries(categoriesDict)),
          searchTerm: 'testSearchTerm',
        };
        const bithday: MIBirthday = {
          day: 7,
          month: 12,
          year: 1991,
        };
        var customCategoriesDict = new Map<number, string>().set(
          20,
          'userParam1'
        );
        const userCategories: UserCategories = {
          birthday: JSON.stringify(bithday),
          city: 'Paris',
          country: 'France',
          gender: String(Number(MIGender.female)),
          customerId: 'CustomerID',
          newsletterSubscribed: false,
          customCategories: JSON.stringify(
            Object.fromEntries(customCategoriesDict)
          ),
        };
        var customSessionDict = new Map<number, string>().set(
          10,
          'sessionParam1'
        );
        const sessionParamters: SessionParameters = {
          parameters: JSON.stringify(Object.fromEntries(customSessionDict)),
        };
        MappIntelligence.trackCustomPage(
          pagaParameters,
          sessionParamters,
          userCategories
        );
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
