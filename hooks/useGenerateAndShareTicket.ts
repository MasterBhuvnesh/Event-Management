import { GenerateTicketParams } from '@/types/qr';
import { generateQRCode } from '@/utils/generateticket';
import { useCallback, useEffect } from 'react';

export function useGenerateAndShareTicket(params: GenerateTicketParams) {
  const handleShareTicket = useCallback(async () => {
    try {
      const resultData = await generateQRCode({
        qrId: params.qrid,
        qrCode: params.qrcode,
        userId: params.userid,
      });

      if (!resultData.exists && resultData.publicUrl) {
        console.log('🎟️ Ticket already exists, URL:', resultData.publicUrl); // Debugging line to check if ticket already exists
        return;
      }

      if (resultData.exists && resultData.publicUrl) {
        console.log('✅ Ticket does not exist, URL:', resultData.publicUrl); // Debugging line to check Ticket URL
      } else {
        console.error('❌ No Ticket URL returned'); // Debugging line to check if URL is missing
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error generating ticket';
      console.error('🚨 Error generating Ticket:', message); // Debugging line to check error
    }
  }, [params.qrid, params.qrcode, params.userid]);

  useEffect(() => {
    if (params.qrid && params.qrcode && params.userid) {
      handleShareTicket();
    }
  }, [params.qrid, params.qrcode, params.userid, handleShareTicket]);

  return handleShareTicket;
}
