import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface AppIconProps {
  Icon: React.ComponentType<any>;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppIcon: React.FC<AppIconProps> = ({
  Icon,
  size = 24,
  color = 'black',
  strokeWidth = 2,
  style,
}) => {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} style={style} />
  );
};
