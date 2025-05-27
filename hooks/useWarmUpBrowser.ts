import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Only warm up on native platforms
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
    }
    return () => {
      // Only cool down on native platforms
      if (Platform.OS !== 'web') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}
