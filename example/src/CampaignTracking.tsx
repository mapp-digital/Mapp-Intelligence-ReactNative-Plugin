import React, { Component } from 'react';
import { AppRegistry, FlatList, View } from 'react-native';
import { MappButton } from './components/MappButton';
import { DefaultStyles } from './components/Styles';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import { MIAction, type CampaignParameters } from '../../src/DataTypes';

export default class CampaignTrackingView extends Component {
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
      case 'Track Campaign':
        this.trackCampaign();
        break;
      case 'Test Link1':
        this.trackLink1();
        break;
      case 'Test Link2':
        this.trackLink2();
        break;
    }
  };

  async trackCampaign() {
    let campaignProperties: CampaignParameters = {
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
      campaignProperties
    );

    await MappIntelligencePlugin.sendRequestsAndClean();
  }

  async trackLink1() {
    const url =
      'https://testurl.com/?wt_mc=email.newsletter.nov2020.thursday&cc45=parameter45';

    await MappIntelligencePlugin.trackUrl(url);
    await MappIntelligencePlugin.trackPage('Campaign Tracking 1');
    await MappIntelligencePlugin.sendRequestsAndClean();
  }

  async trackLink2() {
    const url =
      'https://testurl.com/?abc=email.newsletter.nov2020.thursday&wt_cc12=parameter12';

    await MappIntelligencePlugin.trackUrl(url, 'abc');
    await MappIntelligencePlugin.trackPage('Campaign Tracking 2');
    await MappIntelligencePlugin.sendRequestsAndClean();
  }

  render() {
    return (
      <View style={DefaultStyles.sectionContainer}>
        <FlatList
          data={[
            { key: 'Track Campaign' },
            { key: 'Test Link1' },
            { key: 'Test Link2' },
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

AppRegistry.registerComponent('CampaignTracking', () => CampaignTrackingView);
