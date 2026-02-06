import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice ID
const DEFAULT_VOICE_ID = "o8m5cSPHyC9ngHsxGRCs";
const STORAGE_BUCKET = "stoic-audio";

// Explanation audio types and their content
const EXPLANATION_AUDIOS: Record<string, { filename: string; text: string }> = {
  vvd: {
    filename: "vvd-explanation-audio.mp3",
    text: `A importância de saber claramente o que você quer para sua vida.

Por que este exercício é essencial:
A maioria das pessoas vive resolvendo urgências, cumprindo tarefas e reagindo às circunstâncias, sem nunca ter parado para definir com clareza que vida deseja construir.
Sem essa definição, qualquer objetivo parece confuso, qualquer meta perde força e qualquer esforço corre o risco de não levar ao lugar certo.
A VVD – Visão de Vida Desejada existe para romper esse ciclo.
Este exercício não é sobre sonhar de forma vaga ou criar fantasias irreais. Ele é sobre clareza estratégica.

O que a VVD faz por você:
Ao construir sua Visão de Vida Desejada, você define como quer viver, não apenas o que quer conquistar.
Você dá sentido às decisões de carreira, dinheiro, rotina, relacionamentos e crescimento pessoal.
Cria um norte claro para todas as metas e ações futuras.
Reduz conflitos internos, indecisão e sensação de estar perdido.
Passa a avaliar escolhas com base em alinhamento, não apenas em oportunidade.
Sem uma visão clara, metas viram obrigações. Com uma visão clara, metas passam a ser meios.

Por que a VVD vem antes de metas e ações:
No sistema PDI, nada começa por tarefas ou listas de objetivos isolados.
A lógica é simples: Ações corretas só existem quando a direção está clara.
A VVD é a base sobre a qual todo o seu PDI será construído. Ela orienta quais objetivos fazem sentido para você, quais metas devem ser priorizadas, quais esforços valem a pena e o que deve ser evitado, mesmo que pareça uma boa oportunidade.
Sem a VVD, você pode até avançar, mas corre o risco de avançar na direção errada.

Como encarar este exercício:
Faça a VVD com calma, honestidade e profundidade.
Não escreva o que fica bonito, nem o que os outros esperam de você. Escreva o que realmente representa a vida que você quer viver, na prática, no dia a dia.
Este não é um exercício para agradar ninguém. É um exercício para alinhar sua vida com quem você é e com o que você quer construir.

Lembre-se:
A VVD não engessa sua vida. Ela organiza.
Ela não tira liberdade. Ela aumenta sua consciência sobre as escolhas que você faz.
Tudo o que você construir daqui para frente no PDI parte daqui. Quanto mais clara for sua Visão de Vida Desejada, mais consistente, leve e eficaz será sua jornada.`,
  },
  valores: {
    filename: "valores-explanation-audio.mp3",
    text: `A importância de conhecer seus valores.

Por que valores são essenciais:
Valores são os princípios que guiam nossas decisões, comportamentos e prioridades. Eles definem o que é verdadeiramente importante para você e funcionam como uma bússola interna que orienta suas escolhas de vida.

Quando você conhece seus valores:
Você toma decisões mais alinhadas com quem você realmente é.
Você consegue dizer não para o que não importa e sim para o que importa.
Você reduz a ansiedade e a indecisão porque tem clareza sobre suas prioridades.
Você constrói relacionamentos mais autênticos baseados no que valoriza.
Você sente mais satisfação e propósito no dia a dia.

Como os valores impactam sua vida:
Na carreira, valores ajudam a escolher o tipo de trabalho, ambiente e cultura organizacional que fazem sentido para você.
Nos relacionamentos, valores claros permitem estabelecer limites saudáveis e atrair pessoas alinhadas.
Nas finanças, valores orientam como você gasta, investe e prioriza recursos.
Na saúde, valores influenciam hábitos e a importância que você dá ao autocuidado.

A conexão entre valores e metas:
Metas sem valores são tarefas vazias. Quando suas metas estão conectadas aos seus valores, elas ganham significado e motivação genuína.
Por isso, no sistema PDI, o exercício de valores vem antes de qualquer planejamento de metas ou ações.

Lembre-se:
Não existe valor certo ou errado. O importante é identificar o que é verdadeiro para você, não o que a sociedade ou outras pessoas esperam.
Seus valores podem evoluir ao longo da vida, e está tudo bem revisitá-los periodicamente.`,
  },
  roda_vida: {
    filename: "roda-vida-explanation-audio.mp3",
    text: `A importância de conhecer suas áreas da vida.

Como fazer o exercício:
Avalie cada área com uma nota de 0 a 10. Zero representa total insatisfação e 10 representa plena realização.

O que é a Roda da Vida:
A Roda da Vida é um modelo que divide a vida em áreas essenciais, como carreira, finanças, saúde, relacionamentos, desenvolvimento pessoal, lazer e espiritualidade.
Você avalia seu nível de satisfação em cada área e cria um mapa visual da sua vida naquele momento.
Ela responde, de forma prática, à pergunta: Onde estou agora e o que realmente precisa de atenção?

Por que usar a Roda da Vida:
Primeiro, ela traz clareza e consciência realista. Muitas pessoas vivem no modo automático. A Roda da Vida revela desequilíbrios invisíveis no dia a dia, mostra áreas negligenciadas que impactam o todo e diferencia sensação momentânea de realidade consistente.
Ver a roda torta costuma gerar mais impacto do que apenas refletir mentalmente.

Segundo, ela ajuda na priorização mais inteligente. Nem tudo precisa ser resolvido ao mesmo tempo. A ferramenta ajuda a identificar quais áreas têm maior impacto na qualidade de vida, escolher onde investir energia primeiro e evitar dispersão e sobrecarga.

Terceiro, ela cria conexão direta com valores pessoais. A Roda da Vida ganha profundidade quando conectada aos valores. Ela ajuda a responder: Por que essa área baixa me incomoda tanto? Essa área está baixa porque não é um valor para mim ou porque estou vivendo contra meus valores?

Por que a Roda da Vida funciona tão bem:
É visual e rápida. Traduz aspectos subjetivos em algo concreto. Facilita conversas profundas e mostra evolução ao longo do tempo.

Em resumo:
A Roda da Vida mostra como a vida está. Os valores explicam por que isso importa.
Juntas, essas duas coisas ajudam a pessoa a sair do automático e construir uma vida mais consciente, equilibrada e alinhada.`,
  },
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
      console.log('ELEVENLABS_API_KEY not configured - skipping audio generation');
      return new Response(
        JSON.stringify({ success: false, unavailable: true, message: 'API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const audioType = body.type || 'all'; // 'vvd', 'valores', 'roda_vida', or 'all'
    const forceRegenerate = body.force || false;

    const typesToGenerate = audioType === 'all' 
      ? Object.keys(EXPLANATION_AUDIOS) 
      : [audioType];

    const results: Record<string, any> = {};

    for (const type of typesToGenerate) {
      const audioConfig = EXPLANATION_AUDIOS[type];
      if (!audioConfig) {
        results[type] = { success: false, error: 'Unknown audio type' };
        continue;
      }

      const { filename, text } = audioConfig;

      // Check if audio already exists
      if (!forceRegenerate) {
        const { data: existingData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filename);

        try {
          const checkResponse = await fetch(existingData.publicUrl, { method: 'HEAD' });
          if (checkResponse.ok) {
            console.log(`Audio already exists for ${type}: ${filename}`);
            results[type] = { 
              success: true, 
              cached: true, 
              audioUrl: existingData.publicUrl 
            };
            continue;
          }
        } catch {
          // File doesn't exist, will generate
        }
      }

      console.log(`Generating explanation audio for ${type}...`);

      // Clean text and add natural pause
      const cleanedText = text.trim().replace(/\s+/g, ' ');
      const textWithPause = cleanedText.endsWith('.') 
        ? cleanedText + " ... ... ..."
        : cleanedText + ". ... ... ...";

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
        console.log(`ElevenLabs API error for ${type}:`, response.status);
        results[type] = { 
          success: false, 
          unavailable: true, 
          message: 'Audio generation service unavailable' 
        };
        continue;
      }

      const audioBuffer = await response.arrayBuffer();
      console.log(`Generated audio for ${type}: ${audioBuffer.byteLength} bytes`);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.error(`Upload error for ${type}:`, uploadError);
        results[type] = { success: false, error: uploadError.message };
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filename);

      console.log(`Successfully generated and stored audio for ${type}`);
      results[type] = { 
        success: true, 
        generated: true, 
        audioUrl: publicUrlData.publicUrl 
      };
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-explanation-audio:', error);
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
