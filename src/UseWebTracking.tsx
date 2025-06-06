import { MappIntelligencePlugin } from './MappIntelligencePlugin';
import { useRef, useCallback } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';

const runOnce = `
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, height=device-height, initial-scale=0.85, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
    `;
const injectEverIdScript = `window.webtrekkApplicationEverId = '%everId%' ; true; `;

type OnMessage = (data: any) => void;

type OnLoad = () => void;

export const useWebTracking = (
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
    MappIntelligencePlugin.getEverId()
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
        MappIntelligencePlugin.trackException(error);
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
