import { SignOutButton } from '@/components/SignOutButton';
import { theme } from '@/constants/theme';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ fontFamily: 'Regular', color: theme.colors.text }}>
        {user?.fullName}
      </Text>
      <Text style={{ fontFamily: 'Regular', color: theme.colors.text }}>
        Hi, {user?.emailAddresses[0].emailAddress}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: theme.colors.text,
            borderRadius: 5,
            marginRight: 5,
          }}
        >
          <Link href="/edit">
            <Text
              style={{
                color: theme.colors.background,
                fontFamily: 'Regular',
                textAlign: 'center',
              }}
            >
              Edit Profile
            </Text>
          </Link>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: theme.colors.error[500],
            borderRadius: 5,
            marginRight: 5,
          }}
        >
          <SignOutButton />
        </Pressable>
      </View>
    </View>
  );
}
