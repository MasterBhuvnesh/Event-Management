import { QRCodeDisplay } from '@/components/QRcode';
import { theme } from '@/constants/theme';
import { formatDate } from '@/utils/date';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
export default function QRScreen() {
  const { qrcode, qrid, eventinfo } = useLocalSearchParams<{
    qrcode: string;
    qrid?: string;
    eventinfo?: string;
  }>();

  const parsedEventInfo = eventinfo
    ? JSON.parse(decodeURIComponent(eventinfo))
    : null;
  // console.log('Event Data - QR:', { parsedEventInfo }); // Debugging line to check event data

  const qrData = JSON.stringify({
    qrId: qrid,
    qrCode: qrcode,
  });
  console.log('QR Data 👀👀:', qrData); // Debugging line to check QR data
  if (!qrcode || !qrid) {
    let message = !qrcode ? 'No QR code provided.' : 'No QR ID provided.';
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>{message}</Text>
      </View>
    );
  }

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
        <View
          style={{
            width: '100%',
            height: '48%',
            backgroundColor: theme.colors.text,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={parsedEventInfo?.img || ''}
              style={{ width: '50%', height: 100, borderRadius: 10 }}
              contentFit="cover"
            />
            <View style={{ width: '50%', paddingLeft: 10 }}>
              <Text
                style={{
                  color: theme.colors.background,
                  fontSize: 24,
                  marginTop: 10,
                  fontFamily: 'Black',
                  textAlign: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 24,
                }}
              >
                {parsedEventInfo?.title || 'Event Title'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              marginTop: 8,
            }}
          >
            {parsedEventInfo?.starttime && (
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 100,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    fontFamily: 'Regular',
                    textAlign: 'center',
                  }}
                >
                  {formatDate(parsedEventInfo.starttime)}
                </Text>
              </View>
            )}

            {parsedEventInfo?.endtime && (
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 100,
                  flex: 1,
                  marginLeft: parsedEventInfo?.starttime ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    fontFamily: 'Regular',
                    textAlign: 'center',
                  }}
                >
                  {formatDate(parsedEventInfo.endtime)}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: theme.colors.gray[200],
              borderRadius: 20,
              maxWidth: '90%',
              alignSelf: 'center',
              shadowColor: theme.colors.gray[500],
              shadowOpacity: 0.2,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              overflow: 'hidden',
            }}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontSize: 15,
                fontFamily: 'Regular',
              }}
            >
              Here is the location :
            </Text>

            <Text
              style={{
                color: theme.colors.background,
                fontSize: 15,
                fontFamily: 'Regular',
                textAlign: 'center',
                backgroundColor: theme.colors.gray[100],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {parsedEventInfo?.location || 'Event Location'}
            </Text>
          </View>
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
      {/*  DOWNLOAD TICKET PART & SHARE TICKET PART  */}
    </View>
  );
}
