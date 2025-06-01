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

export interface GenerateTicketParams {
  qrid: string;
  qrcode: string;
  userid: string;
}

export interface TicketGenerationResult {
  publicUrl?: string;
  message?: string;
  exists?: boolean;
  externalResponse?: any;
}
