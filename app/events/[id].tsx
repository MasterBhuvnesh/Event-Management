import { theme } from '@/constants/theme';
import { useSingleEventData } from '@/hooks/useSingleEventData';
import { registerForEvent } from '@/lib/events';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import icons from expo/vector-icons
import { useToast } from '@/context/ToastContext';
import useUserData from '@/hooks/useUserData';
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { Pressable } from 'react-native';

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    elevation: 3,
    shadowColor: theme.colors.gray[800],
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.gray[200],
    borderTopLeftRadius: 12,
  },
  content: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.gray[300],
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  info: {
    fontSize: 14,
    color: theme.colors.gray[500],
  },
  registerContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  registerButton: {
    backgroundColor: theme.colors.info[500],
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonPressed: {
    backgroundColor: theme.colors.info[700],
    opacity: 0.85,
  },
  registerText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default function EventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event, loading, error } = useSingleEventData(id);
  const { userData, loading: userloading, error: usererror } = useUserData();

  const { showToast } = useToast();
  if (loading && userloading) return <Text>Loading...</Text>;
  if (error && usererror) return <Text>Error loading event.</Text>;
  if (!event || !Array.isArray(event) || event.length === 0)
    return <Text>No event found.</Text>;

  const eventData = event[0];

  const handleRegister = async () => {
    if (!userData) {
      showToast('User data not loaded. Please try again.', 'error');
      return;
    }
    registerForEvent(eventData.id, userData.id)
      .then(({ registrationId, code, newRegistration }) => {
        if (newRegistration) {
          console.log(
            `Successfully registered for event ${eventData.title} with registration ID: ${registrationId}, code: ${code}`
          );
          showToast(
            `Successfully registered for event ${eventData.title}`,
            'success',
            1200
          );
        } else {
          console.log(
            `You have already registered for event ${eventData.title} with registration ID: ${registrationId}, code: ${code}`
          );
          showToast(
            `Already registered for event ${eventData.title}`,
            'info',
            1200
          );
        }

        // Create event info JSON
        const eventInfo = {
          title: eventData.title,
          description: eventData.description,
          starttime: eventData.start_time,
          endtime: eventData.end_time,
          location: eventData.location,
          img: eventData.banner_image_url,
        };

        router.push(
          `/ticket/${code}?qrid=${registrationId}&eventinfo=${encodeURIComponent(
            JSON.stringify(eventInfo)
          )}`
        );
      })
      .catch((err) => {
        console.error(err);
        showToast('Registration failed. Please try again.', 'error');
      });
  };

  return (
    <SafeAreaView style={styles.card}>
      <Stack.Screen
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerTintColor: theme.colors.text,
          headerStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Image
        source={eventData.banner_image_url}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{eventData.title}</Text>
        <Text style={styles.description}>{eventData.description}</Text>
        <View style={styles.infoRow}>
          <MaterialIcons
            name="location-on"
            size={18}
            color={theme.colors.gray[500]}
            style={styles.icon}
          />
          <Text style={styles.info}>Location: {eventData.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar-start"
            size={18}
            color={theme.colors.gray[500]}
            style={styles.icon}
          />
          <Text style={styles.info}>
            Start: {new Date(eventData.start_time).toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar-end"
            size={18}
            color={theme.colors.gray[500]}
            style={styles.icon}
          />
          <Text style={styles.info}>
            End: {new Date(eventData.end_time).toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5
            name="money-bill-wave"
            size={16}
            color={theme.colors.gray[500]}
            style={styles.icon}
          />
          <Text style={styles.info}>Price: {eventData.price_description}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons
            name="info"
            size={18}
            color={theme.colors.gray[500]}
            style={styles.icon}
          />
          <Text style={styles.info}>Status: {eventData.status}</Text>
        </View>
      </View>
      <View style={styles.registerContainer}>
        {eventData.registration_status !== 'Open' ? (
          <Text style={styles.registerText}>
            Registration is currently closed.
          </Text>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.registerButtonPressed,
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>Show My Ticket</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

// Convert into model later
