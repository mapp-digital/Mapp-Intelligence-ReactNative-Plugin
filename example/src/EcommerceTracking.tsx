import React, { Component } from 'react';
import { AppRegistry, FlatList, View } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import {
  MIStatus,
  type EcommerceParameters,
  type MIProduct,
} from '../../src/DataTypes';

import * as MappIntelligencePlugin from 'mapp-intelligence-reactnative-plugin';

const VIEW_PRODUCT = 'View Product';
const ADD_TO_BASKET = 'Add to Basket';
const PURCHASED = 'Purchased';
const DELETE_FROM_CART = 'Delete from Cart';
const ADD_TO_WHISHLIST = 'Add to Whishlist';
const DELETE_FROM_WHISHLIST = 'Delete from Whishlist';
const CHECKOUT = 'Checkout';

const product: MIProduct = {
  name: 'Product 1',
  cost: 13,
  quantity: 4,
  productSoldOut: false,
  categories: new Map<number, string>([
    [1, 'ProductCat1'],
    [2, 'ProductCat2'],
  ]),
};
export default class EcommerceTrackingView extends Component {
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
      case VIEW_PRODUCT:
        this.viewProduct();
        break;
      case ADD_TO_BASKET:
        this.addToBasket();
        break;
      case PURCHASED:
        this.purchased();
        break;
      case DELETE_FROM_CART:
        this.deleteFromCart();
        break;
      case ADD_TO_WHISHLIST:
        this.addToWhishlist();
        break;
      case DELETE_FROM_WHISHLIST:
        this.deleteFromWhishlist();
        break;
      case CHECKOUT:
        this.checkout();
        break;
    }
  };

  async viewProduct() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.viewed,
      currency: 'EUR',
      orderID: 'ud679adn',
      orderValue: 456,
      returningOrNewCustomer: 'new customer',
      returnValue: 3,
      cancellationValue: 2,
      couponValue: 33,
      paymentMethod: 'cash',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'highest',
      shippingCost: 35,
      markUp: 1,
      orderStatus: 'order received',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async addToBasket() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.addedToBasket,
      currency: 'USD',
      orderID: 'ud679adn',
      orderValue: 549,
      returningOrNewCustomer: 'returning customer',
      returnValue: 1,
      cancellationValue: 2,
      couponValue: 10,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'normal',
      shippingCost: 15,
      markUp: 2,
      orderStatus: 'order added',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - add to basket',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async purchased() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.purchased,
      currency: '$',
      orderID: 'ud679adn',
      orderValue: 695,
      returningOrNewCustomer: 'returning customer',
      returnValue: 1,
      cancellationValue: 2,
      couponValue: 10,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'lower',
      shippingCost: 15,
      markUp: 2,
      orderStatus: 'order sent',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - purchased',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async deleteFromCart() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.deletedFromBasket,
      currency: '$',
      orderID: 'ud679adn',
      orderValue: 695,
      returningOrNewCustomer: 'returning customer',
      returnValue: 1,
      cancellationValue: 2,
      couponValue: 10,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'lower',
      shippingCost: 15,
      markUp: 2,
      orderStatus: 'order deleted from basket',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - delete from basket',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async addToWhishlist() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.addedToWishlist,
      currency: '$',
      orderID: '124kire43',
      orderValue: 235,
      returningOrNewCustomer: 'returning customer',
      returnValue: 2,
      cancellationValue: 4,
      couponValue: 13,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'lower',
      shippingCost: 23,
      markUp: 1,
      orderStatus: 'order received',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - added to whishlist',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async deleteFromWhishlist() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.deletedFromWishlist,
      currency: '$',
      orderID: '12ief45',
      orderValue: 345,
      returningOrNewCustomer: 'returning customer',
      returnValue: 1,
      cancellationValue: 2,
      couponValue: 18,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'lower',
      shippingCost: 20,
      markUp: 4,
      orderStatus: 'order removed from whishlist',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - purchased',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  async checkout() {
    let ecommerceParam: EcommerceParameters = {
      products: [product],
      status: MIStatus.checkout,
      currency: '$',
      orderID: 'ij485o',
      orderValue: 423,
      returningOrNewCustomer: 'new customer',
      returnValue: 1,
      cancellationValue: 3,
      couponValue: 45,
      paymentMethod: 'credit card',
      shippingServiceProvider: 'DHL',
      shippingSpeed: 'lower',
      shippingCost: 22,
      markUp: 1,
      orderStatus: 'order received',
      customParameters: new Map<number, string>([
        [1, 'ProductParam1'],
        [2, 'ProductParam2'],
      ]),
    };

    await MappIntelligencePlugin.trackCustomPage(
      'ECommerce Tracking - checkout',
      null,
      null,
      null,
      ecommerceParam
    );
  }

  render() {
    return (
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: VIEW_PRODUCT },
            { key: ADD_TO_BASKET },
            { key: PURCHASED },
            { key: DELETE_FROM_CART },
            { key: ADD_TO_WHISHLIST },
            { key: DELETE_FROM_WHISHLIST },
            { key: CHECKOUT },
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

AppRegistry.registerComponent('EcommerceTracking', () => EcommerceTrackingView);
