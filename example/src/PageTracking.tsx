import React, { Component } from 'react';
import * as MappIntelligence from 'react-native-mappinteligence-plugin';
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
} from '../../src/helperMethods';
import {
  AppRegistry,
  StyleSheet,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

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

  async trackPage(): Promise<number> {
    console.log('trackPage()');
    return MappIntelligence.trackPage();
  }

  trackCustomPage(): Promise<number> {
    console.log('trackCustomPage()');
    var paramsDict = new Map<number, string>().set(20, 'cp20Override');
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
      emailAddress: '',
      emailReceiverId: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      street: '',
      streetNumber: '',
      zipCode: '',
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
      productSoldOut: 2,
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
    return MappIntelligence.trackCustomPage(
      pageParameters,
      sessionParameters,
      userCategories,
      ecommerceParameters,
      campaignParameters
    );
  }

  trackPageWithCustomData(): Promise<number> {
    console.log('trackPageWithCustomData()');
    var customParameters = new Map<string, string>();
    customParameters.set('cp10', 'cp10Override');
    customParameters.set('cg10', 'test');
    return MappIntelligence.trackPageWithCustomData(
      'testTitle1',
      customParameters
    );
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.sectionContainer}
        >
          <Button title="Track Page" onPress={this.trackPage} />
          <Button title="Track Custom Page" onPress={this.trackCustomPage} />
          <Button
            title="Track Page with Custom Data"
            onPress={this.trackPageWithCustomData}
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
