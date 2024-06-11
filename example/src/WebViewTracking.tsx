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

  const runOnce = `
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, height=device-height, initial-scale=0.85, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        window.WebtrekkAndroidWebViewCallback = {};

        window.WebtrekkAndroidWebViewCallback.trackCustomPage = function(pageName,param){
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: 'trackCustomPage', 'name':pageName, 'params':param }));
        }

        window.WebtrekkAndroidWebViewCallback.trackCustomEvent = function(eventName, param){
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: 'trackCustomEvent', 'name':eventName, 'params':param }));
        }

        window.WebtrekkAndroidWebViewCallback.getEverId = function(){
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: 'getEverId' }));
        }
    `;
  const injectEverIdScript = `wtSmart.utils.identifier.everId('%everId%'); true; `;

  const onMessage = (event: WebViewMessageEvent) => {
    const json = JSON.parse(event.nativeEvent.data);
    const method = json.method;
    const name = json.name;
    const params = json.params;

    console.log(method, name, params);

    if (method === 'trackCustomPage') {
      trackCustomPage(name, params);
    } else if (method === 'trackCustomEvent') {
      trackCustomEvent(name, params);
    } else if (method === 'getEverId') {
      injectEverId();
    }

    Alert.alert(method, name + ': ' + JSON.stringify(params));
  };

  const trackCustomPage = (name: string, params: string) => {
    try {
      const parameters = getJson(params);
      console.log('Page Name: ', name, '; Params: ', parameters);
      MappIntelligencePlugin.trackPageWithCustomData(name, parameters);
    } catch (error) {
      console.error(error);
    }
  };

  const trackCustomEvent = (name: string, params: any) => {
    try {
      const parameters = getJson(params);
      console.log('Event Name: ', name, '; Params: ', parameters);
      MappIntelligencePlugin.trackAction(
        name,
        parameters,
        null,
        null,
        null,
        null
      );
    } catch (error) {
      console.error(error);
    }
  };

  const injectEverId = () => {
    MappIntelligencePlugin.getEverId()
      .then((everId) => {
        let webView = webviewRef.current;
        if (webView != null) {
          const script = injectEverIdScript.replace('%everId%', everId);
          webView.injectJavaScript(script);
          console.log('SCRIPT TO INJECT: ', script);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getJson = (data: any): any => {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      return null;
    }
  };

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
        onLoad={injectEverId}
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
