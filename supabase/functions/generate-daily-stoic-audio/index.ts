import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice ID
const DEFAULT_VOICE_ID = "o8m5cSPHyC9ngHsxGRCs";

// Stoic reflections map (simplified - we'll get today's reflection)
const getReflectionForDate = (date: Date): { title: string; text: string; question: string } | null => {
  // This will be called from frontend with the actual reflection data
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get reflection data from request body (for cron) or generate for today
    let reflection: { title: string; text: string; question: string };
    let dateKey: string;

    const body = await req.json().catch(() => ({}));
    
    if (body.title && body.text && body.question && body.dateKey) {
      reflection = { title: body.title, text: body.text, question: body.question };
      dateKey = body.dateKey;
    } else {
      // If no body, this is likely a test or manual call - return error
      throw new Error('Reflection data required: title, text, question, dateKey');
    }

    const audioFileName = `${dateKey}-full-v4.mp3`;

    // Check if audio already exists
    const { data: existingAudio } = await supabase
      .from('stoic_reflection_audio')
      .select('audio_url')
      .eq('date_key', dateKey)
      .single();

    if (existingAudio?.audio_url?.includes('-full-v4')) {
      console.log(`Audio already exists for ${dateKey}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Audio already exists',
          audioUrl: existingAudio.audio_url 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare narration text - ONLY title and reflection text (no question)
    // Add natural pause at the end for 2 seconds of silence
    const fullText = `${reflection.title}. ${reflection.text}`;
    const cleanedText = fullText.trim().replace(/\s+/g, ' ');
    // Add ellipsis to create natural ending pause
    const textWithPause = cleanedText.endsWith('.') 
      ? cleanedText + " ... ... ..."
      : cleanedText + ". ... ... ...";

    console.log(`Generating daily stoic audio for ${dateKey}`);

    // Generate audio with ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textWithPause,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`Generated audio: ${audioBuffer.byteLength} bytes`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('stoic-audio')
      .upload(audioFileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('stoic-audio')
      .getPublicUrl(audioFileName);

    const audioUrl = publicUrlData.publicUrl;

    // Save to database (upsert)
    const { error: dbError } = await supabase
      .from('stoic_reflection_audio')
      .upsert({
        date_key: dateKey,
        audio_url: audioUrl,
        title: reflection.title
      }, {
        onConflict: 'date_key'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Non-fatal - audio is still in storage
    }

    console.log(`Successfully generated and stored audio for ${dateKey}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioUrl,
        message: `Audio generated for ${dateKey}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-daily-stoic-audio:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
