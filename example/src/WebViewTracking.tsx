import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { Alert, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  BasicAuthCredential,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';

const WebViewTracking = () => {
  const webviewRef = useRef<WebView>(null);
  const basicAuthCredential: BasicAuthCredential = {
    username: 'demo',
    password: 'demo',
  };

  const onMessage = (event: WebViewMessageEvent) => {
    const json = JSON.parse(event.nativeEvent.data);
    console.log(event);
    Alert.alert(json.type, json.data);
  };

  const init = () => {
    MappIntelligencePlugin.getEverId()
      .then((everId) => {
        let webView = webviewRef.current;
        if (webView != null) {
          const script =
            "wtSmart.utils.identifier.everId('" + everId + "'); true;";
          webView.injectJavaScript(script);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const runOnce = `
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, height=device-height, initial-scale=0.85, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        window.callTrackCustomPage = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'trackCustomPage', data: 'test' }));
        };
        
        window.callTrackCustomEvent = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'trackCustomEvent', data: 'test' }));
        };

        window.getEverId = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'getEverId', data: 'test' }));
        };
    `;
  const demoUri = 'https://demoshop.webtrekk.com/media/web2app/index.html';
  const html = `
      <html>
      <head></head>
      <body>
        <script>
          setTimeout(function () {
            window.ReactNativeWebView.postMessage("Hello!")
          }, 2000)
        </script>
      </body>
      </html>
    `;
  return (
    <View style={{ flex: 1.0 }}>
      <WebView
        ref={webviewRef}
        source={{
          uri: demoUri,
        }}
        basicAuthCredential={basicAuthCredential}
        useWebView2={true}
        javaScriptEnabled={true}
        onMessage={onMessage}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        bounces={false}
        webviewDebuggingEnabled={true}
        startInLoadingState={true} // Show a loading indicator while the page is loading
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        injectedJavaScript={runOnce}
        onLoadEnd={init}
      ></WebView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WebViewTracking;
