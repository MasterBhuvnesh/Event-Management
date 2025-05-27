import { SignOutButton } from '@/components/SignOutButton';
import GithubAuth from '@/components/sso/sso_github';
import GoogleAuth from '@/components/sso/sso_google';
import { theme } from '@/constants/theme';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <SignedIn>
        <Redirect href="/(main)/home" />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginVertical: 5,
          }}
        >
          <GithubAuth />
          <GoogleAuth />
        </View>
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'Medium',
            fontSize: 16,
            color: theme.colors.text,
          }}
        >
          Auth using Clerk
        </Text>
      </SignedOut>
    </View>
  );
}
