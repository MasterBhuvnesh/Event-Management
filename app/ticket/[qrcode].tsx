import { QRCodeDisplay } from '@/components/QRcode';
import { theme } from '@/constants/theme';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function QRScreen() {
  const { qrcode, qrid } = useLocalSearchParams<{
    qrcode: string;
    qrid?: string;
  }>();
  const qrData = JSON.stringify({
    qrId: qrid,
    qrCode: qrcode,
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          title: 'Ticket',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.gray[500],
          headerTitleStyle: {
            fontWeight: 'medium',
            fontSize: 16,
            color: theme.colors.text,
          },
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: theme.colors.text,
          marginHorizontal: 20,
          marginTop: 20,
          padding: 20,
          marginBottom: 80,
          borderRadius: 10,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        {/*  For Event */}
        <View
          style={{
            width: '100%',
            height: '48%',
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          {/*  EVENT HERE  */}
        </View>
        {/* For QR */}
        <View
          style={{
            width: '100%',
            height: '48%',
            backgroundColor: theme.colors.text,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <QRCodeDisplay jsonData={qrData} size={200} />
          <Text
            style={{
              color: theme.colors.background,
              fontSize: 14,
              marginTop: 10,
              fontFamily: 'Bold',
              textAlign: 'center',
            }}
          >
            {`Registration ID: ${qrcode}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

// https://sasandasaumya.medium.com/building-a-qr-code-scanner-with-react-native-expo-df8e8f9e4c08
