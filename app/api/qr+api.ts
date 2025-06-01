import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

// Supabase config
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey // Use service role key only in API routes (never in client)
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { qrId, qrCode, userId } = body;

    if (!qrId || !qrCode || !userId) {
      return Response.json(
        { error: 'qrId , userId and  qrCode  are required' },
        { status: 400 }
      );
    }

    // Convert JSON to string and generate QR buffer
    const qrData = JSON.stringify({ qrId, qrCode });
    const qrBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      errorCorrectionLevel: 'H',
    });

    // Define upload path
    const fileName = `${userId}/${qrId}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('qrtest')
      .upload(fileName, qrBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error(error);
      return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL (optional)
    const { publicUrl } = supabase.storage
      .from('qrtest')
      .getPublicUrl(fileName).data;

    return Response.json({
      message: 'QR code uploaded successfully',
      path: data?.path,
      publicUrl,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
