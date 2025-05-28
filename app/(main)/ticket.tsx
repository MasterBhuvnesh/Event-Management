import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import useUserData from '@/hooks/useUserData';
import { router } from 'expo-router';
import { ScanQrCodeIcon } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function TicketScreen() {
  const { userData, loading, error } = useUserData();
  const { showToast } = useToast();
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.text} />
      </View>
    );
  }
  if (error) {
    return showToast(error, 'error');
  }
  return (
    <View style={styles.container}>
      <View style={styles.ticketBox}>
        <Text style={styles.title}>My Ticket</Text>
      </View>
      {userData?.role == 'Admin' && (
        <Pressable
          style={styles.scanButton}
          onPress={() => {
            router.push({
              pathname: '/scan/[id]',
              params: { id: userData?.id },
            });
          }}
        >
          <AppIcon
            Icon={ScanQrCodeIcon}
            size={24}
            color={theme.colors.background}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  ticketBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Black',
    color: theme.colors.text,
    textAlign: 'center',
  },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
