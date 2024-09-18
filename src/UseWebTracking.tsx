// useWebTracking.tsx
import { useRef, useCallback } from 'react';
import {
  trackPageWithCustomData,
  trackAction,
  trackException,
  getEverId,
} from './index';
//import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';

const runOnce = `
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, height=device-height, initial-scale=0.85, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        window.WebtrekkAndroidWebViewCallback = {};

        window.WebtrekkAndroidWebViewCallback.trackCustomPage = function(pageName,param){
            window.ReactNativeWebView.postMessage(JSON.stringify({ 'method': 'trackCustomPage', 'name':pageName, 'params':param }));
        }

        window.WebtrekkAndroidWebViewCallback.trackCustomEvent = function(eventName, param){
            window.ReactNativeWebView.postMessage(JSON.stringify({ 'method': 'trackCustomEvent', 'name':eventName, 'params':param }));
        }

        window.WebtrekkAndroidWebViewCallback.getEverId = function(){
            window.ReactNativeWebView.postMessage(JSON.stringify({ 'method': 'getEverId', 'name':'webtrekkApplicationEverId', 'params': window.webtrekkApplicationEverId }));
        }
    `;
const injectEverIdScript = `window.webtrekkApplicationEverId = '%everId%' ; true; `;

type OnMessage = (data: any) => void;

type OnLoad = () => void;

const useWebTracking = (
  onMessage?: OnMessage | null,
  onLoad?: OnLoad | null
) => {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        const method = message.method;
        const name = message.name;
        const params = message.params;

        console.log(method, name, params);

        if (method === 'trackCustomPage') {
          trackCustomPage(name, params);
        } else if (method === 'trackCustomEvent') {
          trackCustomEvent(name, params);
        }
      } catch (error) {
        console.error('Error parsing message from WebView', error);
      }
      onMessage?.(event.nativeEvent.data);
    },
    [onMessage]
  );

  const trackCustomPage = (name: string, params: any) => {
    try {
      const parameters = getJson(params) ?? new Map();
      console.log('Page Name: ', name, '; Params: ', parameters);
      trackPageWithCustomData(name, parameters);
    } catch (error) {
      console.error(error);
    }
  };

  const trackCustomEvent = (name: string, params: any) => {
    try {
      const parameters = getJson(params);
      console.log('Event Name: ', name, '; Params: ', parameters);
      trackAction(name, parameters, null, null, null, null);
    } catch (error) {
      console.error(error);
    }
  };

  const getJson = (data?: any | null): any => {
    try {
      if (data) {
        const json = JSON.parse(data);
        return json;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleLoad = useCallback(() => {
    getEverId()
      .then((everId: string) => {
        if (webViewRef.current) {
          const scripts = injectEverIdScript.replace('%everId%', everId);
          webViewRef.current.injectJavaScript(scripts);
          console.log('Injected scripts: ', scripts);

          setTimeout(() => {
            webViewRef.current?.injectJavaScript(
              `window.WebtrekkAndroidWebViewCallback.getEverId()`
            );
          }, 1000);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        trackException(error);
      });

    if (onLoad) {
      onLoad();
    }
  }, []);

  const getInjectedJavaScript = (script?: string | undefined | null) => {
    if (script) {
      return runOnce + '; true; ' + script;
    }
    return runOnce;
  };

  return { webViewRef, handleMessage, handleLoad, getInjectedJavaScript };
};

export default useWebTracking;
