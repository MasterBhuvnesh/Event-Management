import React from 'react';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  jsonData: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const QRCodeDisplay = ({
  jsonData,
  size = 200,
  color = 'black',
  backgroundColor = 'white',
}: QRCodeDisplayProps) => (
  <QRCode
    value={jsonData}
    size={size}
    color={color}
    backgroundColor={backgroundColor}
  />
);
