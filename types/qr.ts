export type QRRequestData = {
  qrCode: string;
  qrId: string;
  userId: string;
};

export type QRResponse = {
  publicUrl?: string;
  message?: string;
  exists?: boolean;
  externalResponse?: any;
};
