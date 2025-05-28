import { AppIcon } from '@/components/AppIcon';
import { theme } from '@/constants/theme';
import { ToastType } from '@/types/types';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

type ColorIntensity = 50 | 200 | 700;

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

// Utility function to get theme color
const getThemeColor = (type: ToastType, intensity: ColorIntensity) => {
  return theme.colors[type][intensity];
};

// Icon configuration mapping
const iconConfig = {
  success: {
    component: CheckCircle,
    color: getThemeColor('success', 700),
  },
  error: {
    component: XCircle,
    color: getThemeColor('error', 700),
  },
  warning: {
    component: AlertTriangle,
    color: getThemeColor('warning', 700),
  },
  info: {
    component: Info,
    color: getThemeColor('info', 700),
  },
};

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  textStyle,
  containerStyle,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  // Get all colors for the current type at once
  const colors = {
    background: getThemeColor(type, 50),
    border: getThemeColor(type, 200),
    text: getThemeColor(type, 700),
    iconBg: getThemeColor(type, 700),
  };

  const { component: IconComponent } = iconConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
          ...containerStyle,
        },
        Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow,
      ]}
    >
      <Animated.View
        style={[
          styles.iconBackground,
          {
            opacity: fadeAnim,
            backgroundColor: colors.iconBg,
          },
        ]}
      >
        <AppIcon Icon={IconComponent} strokeWidth={2} size={20} color="white" />
      </Animated.View>
      <Text
        style={[
          styles.message,
          {
            color: colors.text,
          },
          textStyle,
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Regular',
    marginLeft: 10,
    flexShrink: 1,
  },
  iconBackground: {
    borderRadius: 10,
    padding: 7,
  },
  androidShadow: {
    elevation: 6,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Toast;
