import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice ID do usuário
const DEFAULT_VOICE_ID = "o8m5cSPHyC9ngHsxGRCs";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;

    // Clean and prepare text - add trailing silence marker to prevent truncation
    // Remove extra spaces and add a pause at the end
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    // Add a period and ellipsis at the end to create natural pause and prevent cutoff
    const textWithPause = cleanedText.endsWith('.') || cleanedText.endsWith('?') || cleanedText.endsWith('!')
      ? cleanedText + " ..."
      : cleanedText + ". ...";

    console.log(`Generating TTS for text: "${textWithPause.substring(0, 50)}..." with voice: ${selectedVoiceId}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
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
            stability: 0.7,  // Increased for more consistent ending
            similarity_boost: 0.75,
            style: 0.3,      // Reduced to minimize artifacts
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log('ElevenLabs API unavailable (possibly no credits):', response.status);
      // Return empty response with unavailable flag instead of error
      return new Response(
        JSON.stringify({ unavailable: true, message: 'Audio service temporarily unavailable' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    console.log(`Successfully generated audio: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: unknown) {
    console.error('Error in elevenlabs-tts:', error);
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
