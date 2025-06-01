import { EventCard } from '@/components/EventCard';
import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useEventsData } from '@/hooks/useEventsData';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const { events, loading, error, refetch } = useEventsData();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);
  const renderContent = () => {
    if (loading && events.length === 0) {
      return <ActivityIndicator size="large" color="#000" />;
    }

    if (error && events.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!loading && events.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events available.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error[500],
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default HomeScreen;
