import { useToast } from '@/context/ToastContext';
import { GenerateTicketParams } from '@/types/qr';
import { generateQRCode } from '@/utils/generateticket';
import { useCallback, useEffect, useState } from 'react';

interface UseGenerateAndShareTicketReturn {
  generateTicket: () => Promise<string | null>;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to handle ticket generation and sharing
 * @param {GenerateTicketParams} params - Parameters required for ticket generation
 * @returns {UseGenerateAndShareTicketReturn} Object containing generate function, loading state and error state
 */
export function useGenerateAndShareTicket(
  params: GenerateTicketParams
): UseGenerateAndShareTicketReturn {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateTicket = useCallback(async () => {
    if (!params.qrid || !params.qrcode || !params.userid) {
      setError(new Error('Missing required parameters'));
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await generateQRCode({
        qrId: params.qrid,
        qrCode: params.qrcode,
        userId: params.userid,
      });

      if (!result.publicUrl) {
        throw new Error('Failed to generate ticket URL');
      }

      if (!result.exists) {
        showToast('Ticket generated successfully', 'success');
      }

      return result.publicUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate ticket';
      setError(new Error(errorMessage));
      showToast('Failed to generate ticket', 'error');
      console.error('[useGenerateAndShareTicket] Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [params.qrid, params.qrcode, params.userid, showToast]);

  useEffect(() => {
    if (params.qrid && params.qrcode && params.userid) {
      generateTicket();
    }
  }, [params.qrid, params.qrcode, params.userid, generateTicket]);

  return { generateTicket, loading, error };
}
