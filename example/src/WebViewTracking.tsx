import { useWebTracking } from 'mapp-intelligence-reactnative-plugin';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { BasicAuthCredential } from 'react-native-webview/lib/WebViewTypes';

const WebViewTracking = () => {
  // init custom hook for webview tracking
  const { webViewRef, handleMessage, handleLoad, getInjectedJavaScript } =
    useWebTracking(
      (data) => {
        // register callback when onMessage received to execute some additional logic
        console.log('On Message', data);
      },
      () => {
        // register callback when web page onLoad event triggers to execute some additional logic
        console.log('On Load');
      }
    );

  const basicAuthCredential: BasicAuthCredential = {
    username: 'demo',
    password: 'demo',
  };

  const demoUri = 'https://demoshop.webtrekk.com/media/web2app/index.html';

  return (
    <View style={{ flex: 1.0 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri: demoUri,
        }}
        basicAuthCredential={basicAuthCredential}
        useWebView2={true}
        javaScriptEnabled={true}
        onMessage={handleMessage}
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
        injectedJavaScript={getInjectedJavaScript(
          `document.body.style.backgroundColor = '#A9A9A9';
          true;`
        )}
        onLoad={handleLoad}
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
