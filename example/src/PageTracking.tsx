import React, { Component } from 'react';
import * as MappIntelligence from 'react-native-mappinteligence';

import {
  MIGender,
  type MIBirthday,
  type PageParameters,
  type UserCategories,
  type SessionParameters,
  type EcommerceParameters,
  type CampaignParameters,
  MIStatus,
  type MIProduct,
  MIAction,
} from '../../src/DataTypes';
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';

export default class PageTrackingView extends Component {
  renderSeparator = () => {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={DefaultStyles.sectionContainer}
      />
    );
  };

  trackPage(): void {
    console.log('trackPage()');
    MappIntelligence.trackPage('Page 1');
  }

  trackCustomPage(): void {
    console.log('trackCustomPage()');
    var paramsDict = new Map<number, string>().set(20, 'cp20');
    var categoriesDict = new Map<number, string>().set(10, 'test');

    const pageParameters: PageParameters = {
      params: paramsDict,
      categories: categoriesDict,
      searchTerm: 'testSearchTerm',
    };

    const bithday: MIBirthday = {
      day: 7,
      month: 12,
      year: 1991,
    };
    var customCategoriesDict = new Map<number, string>().set(20, 'userParam1');

    const userCategories: UserCategories = {
      birthday: bithday,
      city: 'Paris',
      country: 'France',
      gender: MIGender.female,
      customerId: 'CustomerID',
      newsletterSubscribed: false,
      customCategories: customCategoriesDict,
    };

    var customSessionDict = new Map<number, string>().set(10, 'sessionParam1');
    const sessionParameters: SessionParameters = {
      parameters: customSessionDict,
    };

    const prod1: MIProduct = {
      name: 'Product 1',
      cost: 110.56,
      quantity: 1,
      productAdvertiseID: 12345,
      productSoldOut: true,
      productVariant: 'a',
      categories: new Map<number, string>([[1, 'group 1']]),
      ecommerceParameters: null,
    };

    const products: MIProduct[] = [prod1];
    const ecommerceParameters: EcommerceParameters = {
      products: products,
      status: MIStatus.purchased,
      currency: 'EUR',
      orderID: '1234nb5',
      orderValue: 120.56,
      returningOrNewCustomer: null,
      returnValue: null,
      cancellationValue: null,
      couponValue: 10,
      paymentMethod: 'Credit Card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'express',
      shippingCost: 20,
      markUp: null,
      orderStatus: null,
      customParameters: null,
    };
    const campaignParameters: CampaignParameters = {
      campaignId: 'email.newsletter.nov2020.thursday',
      action: MIAction.view,
      mediaCode: 'abc',
      oncePerSession: true,
      customParameters: new Map<number, string>([[12, 'camParam1']]),
    };
    MappIntelligence.trackCustomPage(
      'Page Tracking Example 1',
      pageParameters,
      sessionParameters,
      userCategories,
      ecommerceParameters,
      campaignParameters
    );
  }

  trackPageWithCustomData(): void {
    console.log('trackPageWithCustomData()');
    var customParameters = new Map<string, string>();
    customParameters.set('cp10', 'Override');
    customParameters.set('cg10', 'test');
    MappIntelligence.trackPageWithCustomData('testTitle1', customParameters);
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.sectionContainer}
        >
          <MappButton buttonTitle="Track Page" buttonOnPress={this.trackPage} />
          <MappButton
            buttonTitle="Track Custom Page"
            buttonOnPress={this.trackCustomPage}
          />
          <MappButton
            buttonTitle="Track Page with Custom Data"
            buttonOnPress={this.trackPageWithCustomData}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
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
