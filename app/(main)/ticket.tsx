import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { Link } from 'expo-router';
import { ScanQrCodeIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TicketScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.ticketBox}>
        <Text style={styles.title}>My Ticket</Text>
      </View>
      <Pressable style={styles.scanButton}>
        <Link href="/scan">
          <AppIcon
            Icon={ScanQrCodeIcon}
            size={24}
            color={theme.colors.background}
          />
        </Link>
      </Pressable>
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
