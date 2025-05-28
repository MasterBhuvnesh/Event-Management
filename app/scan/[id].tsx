import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { checkInToEvent } from '@/lib/checkin';
import { Camera, CameraView } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRScanner() {
  const { id: registerbyid } = useLocalSearchParams<{ id: string }>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const getCameraPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          showToast('Camera permission is required to scan QR codes', 'error');
        }
      } catch (error) {
        showToast('Failed to get camera permissions', 'error');
        console.error('Camera permission error:', error);
      }
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannedData(data);
    try {
      const parsedData = JSON.parse(data);
      const { qrId: registrationId, qrCode: code } = parsedData;

      if (!registrationId || !code) {
        throw new Error('Invalid QR code format');
      }

      checkInToEvent(registrationId, code, registerbyid)
        .then((result) => {
          showToast(result.message, result.icon);
        })
        .catch((error) => {
          console.error('Check-in error:', error);
          showToast(
            error.message || 'Check-in failed. Please try again.',
            'error'
          );
        });
    } catch (error) {
      console.error('QR code parsing error:', error);
      showToast('Invalid QR code format', 'error');
    }
  };

  const handleCloseScanner = () => {
    setIsScannerActive(false);
    router.back(); // Redirect to home screen
  };

  if (hasPermission === null) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={styles.text}>Requesting camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Close button in top left */}
      <TouchableOpacity style={styles.closeButton} onPress={handleCloseScanner}>
        <AppIcon Icon={X} color="white" size={24} />
      </TouchableOpacity>

      {isScannerActive ? (
        <>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
          />

          {/* Header text overlay */}
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>Scan QR Code</Text>
            <Text style={styles.subtitle}>
              Scan the booking QR code from{'\n'}your confirmation email
            </Text>
          </View>

          {/* Scan frame overlay */}
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame} />
          </View>
        </>
      ) : (
        <View style={styles.inactiveView}>
          <Text style={styles.text}>Scanner is inactive</Text>
        </View>
      )}

      {/* Bottom buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            styles.scanButton,
            scannedData && styles.activeButton,
          ]}
          onPress={() => setScannedData(null)}
        >
          <Text style={styles.bottomButtonText}>Scan code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.enterButton]}
          onPress={() => {
            // Handle manual entry - you can navigate to a manual entry screen
            console.log('Enter code manually');
          }}
        >
          <Text style={styles.bottomButtonTextSecondary}>Enter code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',

    paddingHorizontal: 20,
    zIndex: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Black',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Regular',
    lineHeight: 22,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    backgroundColor: 'white',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  enterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Medium',
    textAlign: 'center',
  },
  bottomButtonTextSecondary: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Medium',
    textAlign: 'center',
  },
  inactiveView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Regular',
  },
});

// DO SOMETHING ABOUT ENTER CODE BUTTON
