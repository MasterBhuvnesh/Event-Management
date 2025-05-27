import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useSSO } from '@clerk/clerk-expo';
import { FontAwesome5 } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function GithubAuth() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { showToast } = useToast();

  const onPress = useCallback(async () => {
    console.log('GitHub auth button pressed'); // Debug log

    try {
      console.log('Starting SSO flow...'); // Debug log
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_github',
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: 'event',
            path: '/',
          }),
        });

      console.log('SSO flow completed', { createdSessionId, signIn, signUp }); // Debug log

      if (createdSessionId) {
        console.log('Session created successfully', createdSessionId); // Debug log
        setActive!({ session: createdSessionId });
        showToast('You have successfully signed in!');
      } else {
        if (signIn) {
          console.log('Additional sign-in steps required', signIn); // Debug log
          showToast('Please complete the additional sign-in steps.');
        } else if (signUp) {
          console.log('New user sign-up required', signUp); // Debug log
          showToast('Please complete your account setup.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', JSON.stringify(err, null, 2)); // Error log
      showToast('An error occurred during authentication. Please try again.');

      // Additional error debugging
      if (err instanceof Error) {
        console.log('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      }
    }
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: theme.colors.gray[600],
        backgroundColor: theme.colors.gray[800],
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <FontAwesome5 name="github" size={18} color={theme.colors.text} />
        <Text
          style={{
            marginLeft: 10,
            fontFamily: 'Regular',
            fontSize: 16,
            color: theme.colors.text,
          }}
        >
          Github
        </Text>
      </TouchableOpacity>
    </View>
  );
}
