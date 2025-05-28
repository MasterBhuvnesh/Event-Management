// import { AppIcon } from '@/components/AppIcon';
// import { theme } from '@/constants/theme';
// import { useToast } from '@/context/ToastContext';
// import { useNavigation } from '@react-navigation/native';
// import { Camera, CameraView } from 'expo-camera';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { Scan, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function QRScanner() {
//   const navigation = useNavigation();
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scannedData, setScannedData] = useState<string | null>(null);
//   const [isScannerActive, setIsScannerActive] = useState(true);
//   const { showToast } = useToast();

//   useEffect(() => {
//     const getCameraPermissions = async () => {
//       try {
//         const { status } = await Camera.requestCameraPermissionsAsync();
//         setHasPermission(status === 'granted');
//         if (status !== 'granted') {
//           showToast('Camera permission is required to scan QR codes', 'error');
//         }
//       } catch (error) {
//         showToast('Failed to get camera permissions', 'error');
//         console.error('Camera permission error:', error);
//       }
//     };

//     getCameraPermissions();
//   }, []);

//   const handleBarCodeScanned = ({ data }: { data: string }) => {
//     setScannedData(data);
//     console.log('Scanned data:', data);
//     showToast('QR code scanned successfully', 'success');
//     // Add your QR code processing logic here
//   };

//   const handleCloseScanner = () => {
//     setIsScannerActive(false);
//     router.back(); // Redirect to home screen
//   };

//   if (hasPermission === null) {
//     return (
//       <View
//         style={[styles.container, { backgroundColor: theme.colors.background }]}
//       >
//         <Text>Requesting camera permission</Text>
//       </View>
//     );
//   }
//   if (hasPermission === false) {
//     return (
//       <View
//         style={[styles.container, { backgroundColor: theme.colors.background }]}
//       >
//         <Text style={styles.text}>No access to camera</Text>
//       </View>
//     );
//   }

//   return (
//     <View
//       style={[styles.container, { backgroundColor: theme.colors.background }]}
//     >
//       <StatusBar style="light" />

//       {isScannerActive ? (
//         <>
//           <CameraView
//             style={styles.camera}
//             facing="back"
//             barcodeScannerSettings={{
//               barcodeTypes: ['qr'],
//             }}
//             onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
//           />

//           <View style={styles.overlay}>
//             <View style={styles.scanFrame} />
//           </View>
//         </>
//       ) : (
//         <View style={styles.inactiveView}>
//           <Text style={styles.text}>Scanner is inactive</Text>
//         </View>
//       )}

//       <View style={styles.buttonContainer}>
//         {scannedData && (
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => setScannedData(null)}
//           >
//             <AppIcon Icon={Scan} color={theme.colors.text} size={20} />
//             <Text style={styles.buttonText}>Scan Again</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.button} onPress={handleCloseScanner}>
//           <AppIcon Icon={X} color={theme.colors.text} size={20} />
//           <Text style={styles.buttonText}>Close Scanner</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   scanFrame: {
//     width: 250,
//     height: 250,
//     borderWidth: 2,
//     borderColor: 'white',
//     backgroundColor: 'transparent',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 40,
//     width: '100%',
//     alignItems: 'center',
//     gap: 16,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     width: '50%',
//     opacity: 0.7,
//     backgroundColor: theme.colors.gray[800],
//     shadowColor: theme.colors.gray[500],
//     gap: 8,
//   },
//   buttonText: {
//     color: theme.colors.text,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   inactiveView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background,
//   },
//   text: {
//     color: theme.colors.text,
//     fontSize: 18,
//   },
// });
import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRScanner() {
  const navigation = useNavigation();
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
    console.log('Scanned data:', data);
    showToast('QR code scanned successfully', 'success', 1200);
    // Add your QR code processing logic here
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
    bottom: 60,
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
