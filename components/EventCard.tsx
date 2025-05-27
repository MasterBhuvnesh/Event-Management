import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { Event } from '@/types/types';
import { formatDate } from '@/utils/date';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CalendarClock, IndianRupee, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  event: Event;
}

export const EventCard = ({ event }: Props) => {
  return (
    <View style={styles.card}>
      <Image
        source={event.banner_image_url}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.row}>
          <AppIcon Icon={MapPin} color={theme.colors.text} size={18} />
          <Text style={styles.text}>{event.location}</Text>
        </View>

        {event.start_time && (
          <View style={styles.row}>
            <AppIcon Icon={CalendarClock} color={theme.colors.text} size={18} />
            <Text style={styles.text}>
              Start At : {formatDate(event.start_time)}
            </Text>
          </View>
        )}
        {event.end_time && (
          <View style={styles.row}>
            <AppIcon Icon={CalendarClock} color={theme.colors.text} size={18} />
            <Text style={styles.text}>
              End At : {formatDate(event.end_time)}
            </Text>
          </View>
        )}
        {event.price !== undefined && (
          <View style={styles.row}>
            <AppIcon Icon={IndianRupee} color={theme.colors.text} size={18} />
            <Text style={styles.text}>
              ₹{event.price} ({event.price_description})
            </Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => {
          console.log(`View More : ${event.title}`); // Debug log
          router.push({ pathname: '/events/[id]', params: { id: event.id } });
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? theme.colors.gray[200]
              : theme.colors.text,
            borderRadius: 8,
            margin: 12,
            paddingVertical: 10,
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{
            color: theme.colors.background,
            fontFamily: 'Bold',
            fontSize: 16,
          }}
        >
          View More
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  image: {
    width: 180,
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Bold',
    color: theme.colors.text,
  },
  description: {
    fontSize: 14,
    marginTop: 6,
    color: theme.colors.gray[600],
    fontFamily: 'Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: theme.colors.text,
  },
});
