import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  MappIntelligencePlugin,
  LogLevel,
  type MediaEvent,
  type MIProduct,
  type EcommerceParameters,
  type PageParameters,
  type MIBirthday,
  type UserCategories,
  type SessionParameters,
  type EventParameters,
  type CampaignParameters,
  MIStatus,
  MIGender,
  MIAction,
  MediaAction,
} from 'mapp-intelligence-reactnative-plugin';
import { SafeAreaView } from 'react-native-safe-area-context';

type TestResult = { success: boolean; error?: string; duration?: number };
type SectionResults = { section: string; tests: Record<string, TestResult> };

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

const baseEcommerceParams: Omit<
  EcommerceParameters,
  'status' | 'orderID' | 'orderValue' | 'orderStatus'
> = {
  products: [product],
  currency: 'EUR',
  returningOrNewCustomer: 'new customer',
  returnValue: 3,
  cancellationValue: 2,
  couponValue: 33,
  paymentMethod: 'cash',
  shippingServiceProvider: 'DHL',
  shippingSpeed: 'highest',
  shippingCost: 35,
  markUp: 1,
  customParameters: new Map<number, string>([
    [1, 'ProductParam1'],
    [2, 'ProductParam2'],
  ]),
};

const buildManualMediaEvent = (
  action: MediaAction
): MediaEvent => {
  const customMediaCategories = new Map<number, string>([[20, 'mediaCat']]);

  const mediaParams = {
    name: 'Sample test video for React Native',
    action: action.valueOf(),
    position: 0,
    duration: 0,
    customCategories: customMediaCategories,
  };

  const eventParameters: EventParameters = {
    customParameters: new Map<number, string>([[1, 'MediaParam1']]),
  };

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

  const ecommerceParam: EcommerceParameters = {
    products: [product],
    status: MIStatus.noneStatus,
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

  const sessionParameters: SessionParameters = {
    parameters: new Map<number, string>().set(10, 'sessionParam1'),
  };

  const customParams = new Map<number, string>([[1, 'Param1']]);

  return {
    pageName: 'Manual Media Tracking',
    parameters: mediaParams,
    customParameters: customParams,
    eCommerceParameters: ecommerceParam,
    eventParameters,
    sessionParameters,
  };
};

export default function PluginIntegrationTest() {
  const [results, setResults] = useState<SectionResults[]>([]);
  const [running, setRunning] = useState(false);

  const runTest = useCallback(
    async (_name: string, fn: () => Promise<unknown>): Promise<TestResult> => {
      const start = Date.now();
      try {
        await fn();
        return { success: true, duration: Date.now() - start };
      } catch (e: unknown) {
        const err = e as Error;
        return {
          success: false,
          error: err?.message || String(e),
          duration: Date.now() - start,
        };
      }
    },
    []
  );

  const runAllTests = useCallback(async () => {
    setRunning(true);
    setResults([]);

    const pluginTests: Record<string, TestResult> = {};

    // Config methods (plugin may already be initialized from App)
    pluginTests.initWithConfiguration = await runTest(
      'initWithConfiguration',
      () =>
        MappIntelligencePlugin.initWithConfiguration(
          [794940687426749],
          'http://tracker-int-01.webtrekk.net'
        )
    );
    pluginTests.setLogLevel = await runTest('setLogLevel', () =>
      MappIntelligencePlugin.setLogLevel(LogLevel.all)
    );
    pluginTests.setBatchSupportEnabled = await runTest(
      'setBatchSupportEnabled',
      () => MappIntelligencePlugin.setBatchSupportEnabled(false)
    );
    pluginTests.setBatchSupportSize = await runTest(
      'setBatchSupportSize',
      () => MappIntelligencePlugin.setBatchSupportSize(150)
    );
    pluginTests.setRequestInterval = await runTest('setRequestInterval', () =>
      MappIntelligencePlugin.setRequestInterval(1)
    );
    pluginTests.setAnonymousTracking = await runTest(
      'setAnonymousTracking',
      () => MappIntelligencePlugin.setAnonymousTracking(false)
    );
    pluginTests.build = await runTest('build', () =>
      MappIntelligencePlugin.build()
    );

    // Tracking methods - with full params
    pluginTests.trackPage = await runTest('trackPage', () =>
      MappIntelligencePlugin.trackPage('Integration Test Page')
    );
    pluginTests.trackCustomPage_full = await runTest(
      'trackCustomPage (full params)',
      () =>
        MappIntelligencePlugin.trackCustomPage(
          'Integration Test Page',
          { params: new Map(), categories: new Map(), searchTerm: '' },
          { parameters: new Map() },
          null,
          null,
          null
        )
    );
    pluginTests.trackCustomPage_null = await runTest(
      'trackCustomPage (null params)',
      () => MappIntelligencePlugin.trackCustomPage('Test Page')
    );
    pluginTests.trackPageWithCustomData = await runTest(
      'trackPageWithCustomData',
      () =>
        MappIntelligencePlugin.trackPageWithCustomData(
          'Test Page',
          new Map([['cp1', 'val1']])
        )
    );
    pluginTests.trackPageWithCustomData_null = await runTest(
      'trackPageWithCustomData (null)',
      () => MappIntelligencePlugin.trackPageWithCustomData('Test Page', null)
    );
    pluginTests.trackAction_full = await runTest('trackAction (full)', () =>
      MappIntelligencePlugin.trackAction(
        'IntegrationTestAction',
        { customParameters: new Map() },
        null,
        null,
        null,
        null
      )
    );
    pluginTests.trackAction_null = await runTest(
      'trackAction (null params)',
      () => MappIntelligencePlugin.trackAction('Test Action')
    );
    pluginTests.trackUrl = await runTest('trackUrl', () =>
      MappIntelligencePlugin.trackUrl('https://example.com', 'code')
    );
    pluginTests.trackUrl_nullMedia = await runTest(
      'trackUrl (null mediaCode)',
      () => MappIntelligencePlugin.trackUrl('https://example.com')
    );
    pluginTests.trackMedia = await runTest('trackMedia', () =>
      MappIntelligencePlugin.trackMedia({
        pageName: 'Integration Test',
        parameters: {
          name: 'test',
          action: 'init',
          position: 0,
          duration: 0,
          customCategories: null,
        },
      } as MediaEvent)
    );
    pluginTests.trackMedia_null = await runTest(
      'trackMedia (null params)',
      () =>
        MappIntelligencePlugin.trackMedia({
          pageName: 'Test',
          parameters: null,
        } as MediaEvent)
    );
    pluginTests.trackException = await runTest('trackException', () =>
      MappIntelligencePlugin.trackException(
        new Error('Integration test exception'),
        'stack trace'
      )
    );
    pluginTests.trackExceptionWithName = await runTest(
      'trackExceptionWithName',
      () =>
        MappIntelligencePlugin.trackExceptionWithName(
          'IntegrationTestEx',
          'Test message',
          'stack'
        )
    );

    // Other methods
    pluginTests.getEverId = await runTest('getEverId', () =>
      MappIntelligencePlugin.getEverId()
    );
    pluginTests.isInitialized = await runTest('isInitialized', () =>
      MappIntelligencePlugin.isInitialized()
    );
    pluginTests.printCurrentConfig = await runTest('printCurrentConfig', () =>
      MappIntelligencePlugin.printCurrentConfig()
    );
    pluginTests.sendRequestsAndClean = await runTest(
      'sendRequestsAndClean',
      () => MappIntelligencePlugin.sendRequestsAndClean()
    );

    const ecommerceTests: Record<string, TestResult> = {};

    ecommerceTests.viewProduct = await runTest('View Product', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.viewed,
          orderID: 'ud679adn',
          orderValue: 456,
          orderStatus: 'order received',
        }
      )
    );

    ecommerceTests.addToBasket = await runTest('Add to Basket', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking - add to basket',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.addedToBasket,
          currency: 'USD',
          orderID: 'ud679adn',
          orderValue: 549,
          returningOrNewCustomer: 'returning customer',
          returnValue: 1,
          couponValue: 10,
          paymentMethod: 'credit card',
          shippingSpeed: 'normal',
          shippingCost: 15,
          markUp: 2,
          orderStatus: 'order added',
        }
      )
    );

    ecommerceTests.purchased = await runTest('Purchased', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking - purchased',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.purchased,
          currency: '$',
          orderID: 'ud679adn',
          orderValue: 695,
          returningOrNewCustomer: 'returning customer',
          returnValue: 1,
          couponValue: 10,
          paymentMethod: 'credit card',
          shippingSpeed: 'lower',
          shippingCost: 15,
          markUp: 2,
          orderStatus: 'order sent',
        }
      )
    );

    ecommerceTests.deleteFromCart = await runTest('Delete from Cart', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking - delete from basket',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.deletedFromBasket,
          currency: '$',
          orderID: 'ud679adn',
          orderValue: 695,
          returningOrNewCustomer: 'returning customer',
          returnValue: 1,
          couponValue: 10,
          paymentMethod: 'credit card',
          shippingSpeed: 'lower',
          shippingCost: 15,
          markUp: 2,
          orderStatus: 'order deleted from basket',
        }
      )
    );

    ecommerceTests.addToWhishlist = await runTest('Add to Whishlist', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking - added to whishlist',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.addedToWishlist,
          currency: '$',
          orderID: '124kire43',
          orderValue: 235,
          returnValue: 2,
          cancellationValue: 4,
          couponValue: 13,
          paymentMethod: 'credit card',
          shippingSpeed: 'lower',
          shippingCost: 23,
          markUp: 1,
          orderStatus: 'order received',
        }
      )
    );

    ecommerceTests.deleteFromWhishlist = await runTest(
      'Delete from Whishlist',
      () =>
        MappIntelligencePlugin.trackCustomPage(
          'ECommerce Tracking - purchased',
          null,
          null,
          null,
          {
            ...baseEcommerceParams,
            status: MIStatus.deletedFromWishlist,
            currency: '$',
            orderID: '12ief45',
            orderValue: 345,
            returnValue: 1,
            couponValue: 18,
            paymentMethod: 'credit card',
            shippingSpeed: 'lower',
            shippingCost: 20,
            markUp: 4,
            orderStatus: 'order removed from whishlist',
          }
        )
    );

    ecommerceTests.checkout = await runTest('Checkout', () =>
      MappIntelligencePlugin.trackCustomPage(
        'ECommerce Tracking - checkout',
        null,
        null,
        null,
        {
          ...baseEcommerceParams,
          status: MIStatus.checkout,
          currency: '$',
          orderID: 'ij485o',
          orderValue: 423,
          returningOrNewCustomer: 'new customer',
          returnValue: 1,
          cancellationValue: 3,
          couponValue: 45,
          paymentMethod: 'credit card',
          shippingSpeed: 'lower',
          shippingCost: 22,
          markUp: 1,
          orderStatus: 'order received',
        }
      )
    );

    const pageTrackingTests: Record<string, TestResult> = {};

    pageTrackingTests.trackPage = await runTest('Page: Track Page', () =>
      MappIntelligencePlugin.trackPage('Page 1')
    );

    pageTrackingTests.trackCustomPage = await runTest(
      'Page: Track Custom Page',
      async () => {
        const paramsDict = new Map<number, string>().set(20, 'cp20');
        const categoriesDict = new Map<number, string>().set(10, 'test');

        const pageParameters: PageParameters = {
          params: paramsDict,
          categories: categoriesDict,
          searchTerm: 'testSearchTerm',
        };

        const birthday: MIBirthday = {
          day: 7,
          month: 12,
          year: 1991,
        };

        const customCategoriesDict = new Map<number, string>().set(
          20,
          'userParam1'
        );

        const userCategories: UserCategories = {
          birthday,
          city: 'Paris',
          country: 'France',
          gender: MIGender.female,
          customerId: 'CustomerID',
          newsletterSubscribed: false,
          customCategories: customCategoriesDict,
        };

        const customSessionDict = new Map<number, string>().set(
          10,
          'sessionParam1'
        );
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
          products,
          status: MIStatus.purchased,
          currency: 'EUR',
          orderID: '1234nb5',
          orderValue: 120.56,
          returningOrNewCustomer: 'new customer',
          returnValue: 0,
          cancellationValue: 0,
          couponValue: 10,
          paymentMethod: 'Credit Card',
          shippingServiceProvider: 'DHL',
          shippingSpeed: 'express',
          shippingCost: 20,
          markUp: 0,
          orderStatus: 'order received',
          customParameters: new Map<number, string>(),
        };

        const campaignParameters: CampaignParameters = {
          campaignId: 'email.newsletter.nov2020.thursday',
          action: MIAction.view,
          mediaCode: 'abc',
          oncePerSession: true,
          customParameters: new Map<number, string>([[12, 'camParam1']]),
        };

        await MappIntelligencePlugin.trackCustomPage(
          'Page Tracking Example 1',
          pageParameters,
          sessionParameters,
          userCategories,
          ecommerceParameters,
          campaignParameters
        );
      }
    );

    pageTrackingTests.trackPageWithCustomData = await runTest(
      'Page: Track Page With Custom Data',
      () => {
        const customParameters = new Map<string, string>();
        customParameters.set('cp10', 'Override');
        customParameters.set('cg10', 'test');
        return MappIntelligencePlugin.trackPageWithCustomData(
          'testTitle1',
          customParameters
        );
      }
    );

    const actionTrackingTests: Record<string, TestResult> = {};

    actionTrackingTests.trackAction = await runTest(
      'Action: Track Action',
      async () => {
        const eventDict = new Map<number, string>().set(20, 'ck20Param1');
        const eventParameters: EventParameters = {
          customParameters: eventDict,
        };
        await MappIntelligencePlugin.trackAction('TestAction', eventParameters);
      }
    );

    actionTrackingTests.trackCustomAction = await runTest(
      'Action: Track Custom Action',
      async () => {
        const eventDict = new Map<number, string>().set(20, 'ck20Param1');
        const eventParamters: EventParameters = {
          customParameters: eventDict,
        };
        const birthday: MIBirthday = {
          day: 12,
          month: 1,
          year: 1993,
        };
        const customCategoriesDict = new Map<number, string>().set(
          20,
          "( $', /:?@=&+ !.;()-_"
        );
        const userCategories: UserCategories = {
          birthday,
          city: 'Paris',
          country: 'France',
          emailReceiverId: 'testd598378532',
          gender: MIGender.unknown,
          customerId: 'CustomerID',
          customCategories: customCategoriesDict,
        };
        const customSessionDict = new Map<number, string>().set(
          10,
          'sessionParam1'
        );
        const sessionParameters: SessionParameters = {
          parameters: customSessionDict,
        };
        await MappIntelligencePlugin.trackAction(
          'TestAction',
          eventParamters,
          sessionParameters,
          userCategories
        );
      }
    );

    const campaignTrackingTests: Record<string, TestResult> = {};

    campaignTrackingTests.trackCampaign = await runTest(
      'Campaign: Track Campaign',
      async () => {
        const campaignParameters: CampaignParameters = {
          campaignId: 'email.newsletter.nov2020.thursday',
          action: MIAction.view,
          mediaCode: 'abc',
          oncePerSession: true,
          customParameters: new Map<number, string>([[12, 'campParam1']]),
        };

        await MappIntelligencePlugin.trackCustomPage(
          'Test Campaign',
          null,
          null,
          null,
          null,
          campaignParameters
        );

        await MappIntelligencePlugin.sendRequestsAndClean();
      }
    );

    campaignTrackingTests.link1 = await runTest(
      'Campaign: Test Link1',
      async () => {
        const url =
          'https://testurl.com/?wt_mc=email.newsletter.nov2020.thursday&cc45=parameter45';

        await MappIntelligencePlugin.trackUrl(url);
        await MappIntelligencePlugin.trackPage('Campaign Tracking 1');
        await MappIntelligencePlugin.sendRequestsAndClean();
      }
    );

    campaignTrackingTests.link2 = await runTest(
      'Campaign: Test Link2',
      async () => {
        const url =
          'https://testurl.com/?abc=email.newsletter.nov2020.thursday&wt_cc12=parameter12';

        await MappIntelligencePlugin.trackUrl(url, 'abc');
        await MappIntelligencePlugin.trackPage('Campaign Tracking 2');
        await MappIntelligencePlugin.sendRequestsAndClean();
      }
    );

    const mediaManualTests: Record<string, TestResult> = {};

    mediaManualTests.init = await runTest('Media: INIT', () =>
      MappIntelligencePlugin.trackMedia(buildManualMediaEvent(MediaAction.init))
    );

    mediaManualTests.play = await runTest('Media: PLAY', () =>
      MappIntelligencePlugin.trackMedia(buildManualMediaEvent(MediaAction.play))
    );

    mediaManualTests.pause = await runTest('Media: PAUSE', () =>
      MappIntelligencePlugin.trackMedia(
        buildManualMediaEvent(MediaAction.pause)
      )
    );

    mediaManualTests.stop = await runTest('Media: STOP', () =>
      MappIntelligencePlugin.trackMedia(buildManualMediaEvent(MediaAction.stop))
    );

    mediaManualTests.position = await runTest('Media: POSITION', () =>
      MappIntelligencePlugin.trackMedia(buildManualMediaEvent(MediaAction.pos))
    );

    mediaManualTests.seek = await runTest('Media: SEEK', () =>
      MappIntelligencePlugin.trackMedia(
        buildManualMediaEvent(MediaAction.seek)
      )
    );

    mediaManualTests.eof = await runTest('Media: EOF', () =>
      MappIntelligencePlugin.trackMedia(buildManualMediaEvent(MediaAction.eof))
    );

    const exceptionTests: Record<string, TestResult> = {};

    exceptionTests.trackExceptionWithName = await runTest(
      'Exception: trackExceptionWithName',
      async () => {
        try {
          JSON.parse('Invalid JSON String');
        } catch (e) {
          const error = e as Error;
          await MappIntelligencePlugin.trackExceptionWithName(
            error.name,
            error.message
          );
        }
      }
    );

    exceptionTests.trackException = await runTest(
      'Exception: trackException',
      async () => {
        try {
          JSON.parse('Invalid JSON String');
        } catch (e) {
          const error = e as Error;
          await MappIntelligencePlugin.trackException(error);
        }
      }
    );

    setResults([
      { section: 'Plugin API', tests: pluginTests },
      { section: 'ECommerce Tracking', tests: ecommerceTests },
      { section: 'Page Tracking', tests: pageTrackingTests },
      { section: 'Action Tracking', tests: actionTrackingTests },
      { section: 'Campaign Tracking', tests: campaignTrackingTests },
      { section: 'Media Tracking (Manual)', tests: mediaManualTests },
      { section: 'Exception Tracking', tests: exceptionTests },
    ]);
    setRunning(false);
  }, [runTest]);

  const allTests = results.flatMap((section) =>
    Object.values(section.tests)
  );
  const passed = allTests.filter((r) => r.success).length;
  const failed = allTests.filter((r) => !r.success).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, running && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={running}
          testID="run-plugin-tests"
        >
          <Text style={styles.buttonText}>
            {running ? 'Running...' : 'Run All Plugin Tests'}
          </Text>
        </TouchableOpacity>

        {results.length > 0 && (
          <View testID="plugin-test-results">
            <Text style={styles.summary}>
              {passed} passed, {failed} failed
            </Text>
            {failed === 0 ? (
              <View
                testID="plugin-test-all-passed"
                collapsable={false}
                style={styles.successMarker}
              />
            ) : (
              <View
                testID="plugin-test-has-failures"
                collapsable={false}
                style={styles.failureMarker}
              />
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll}>
        {results.length > 0 &&
          results.map((section, index) => (
            <View key={section.section}>
              <Text
                style={[
                  styles.sectionHeader,
                  index === 0 && styles.sectionHeaderFirst,
                ]}
              >
                {section.section}
              </Text>
              {Object.entries(section.tests).map(([name, r]) => (
                <View
                  key={name}
                  style={[styles.row, !r.success && styles.rowFailed]}
                >
                  <Text style={styles.rowText}>
                    {r.success ? '✓' : '✗'} {name}
                    {r.duration != null && (
                      <Text style={styles.duration}> ({r.duration}ms)</Text>
                    )}
                  </Text>
                  {r.error != null && (
                    <Text style={styles.error} numberOfLines={2}>
                      {r.error}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  sectionHeaderFirst: {
    marginTop: 0,
  },
  successMarker: {
    height: 1,
    width: 1,
  },
  failureMarker: {
    height: 1,
    width: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowFailed: {
    backgroundColor: '#ffebee',
  },
  rowText: {
    fontSize: 14,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: '#c62828',
    fontSize: 12,
    marginTop: 4,
  },
});
