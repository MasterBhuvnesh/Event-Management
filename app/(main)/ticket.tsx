import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import useUserData from '@/hooks/useUserData';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { RefreshCw, ScanQrCodeIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function TicketScreen() {
  const { userData, loading, error } = useUserData();
  const { showToast } = useToast();

  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const fetchFiles = useCallback(async () => {
    if (!userData?.id) return;

    setLoadingFiles(true);
    const folder = userData.id;

    const { data, error } = await supabase.storage.from('qrtest').list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.error(error);
      showToast('Failed to load tickets', 'error');
    } else {
      setFiles(data ?? []);
      // console.log(' Storage Files  are fetched:', data); //Debug file
    }

    setLoadingFiles(false);
  }, [userData, showToast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.text} />
      </View>
    );
  }

  if (error) {
    showToast(error, 'error');
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.ticketBox}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Ticket</Text>
          <Pressable
            style={styles.reloadButton}
            onPress={fetchFiles}
            disabled={loadingFiles}
            accessibilityLabel="Reload tickets"
          >
            <AppIcon
              Icon={RefreshCw}
              size={22}
              color={theme.colors.text}
              style={{ opacity: loadingFiles ? 0.5 : 1 }}
            />
          </Pressable>
        </View>

        {loadingFiles ? (
          <ActivityIndicator size="small" color={theme.colors.text} />
        ) : files.length === 0 ? (
          <Text style={styles.message}>No tickets found</Text>
        ) : (
          <ScrollView contentContainerStyle={{ paddingTop: 16 }}>
            {files.map((file) => {
              if (!userData) return null;
              const { publicUrl } = supabase.storage
                .from('qrtest')
                .getPublicUrl(`${userData.id}/${file.name}`).data;

              return (
                <View key={file.name} style={styles.qrContainer}>
                  <Image
                    source={{ uri: publicUrl }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.qrText}>{file.name}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {userData?.role === 'Admin' && (
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  reloadButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Black',
    color: theme.colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: theme.colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  qrText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: 'Regular',
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
