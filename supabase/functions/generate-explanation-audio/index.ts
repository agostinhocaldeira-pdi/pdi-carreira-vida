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
  objetivo: {
    filename: "objetivo-explanation-audio.mp3",
    text: `Como definir seu objetivo.

Um Objetivo é simplesmente aquilo que você deseja alcançar ou conquistar de forma ampla, como aprender uma nova língua ou ser mais saudável, mas ele não deve ser escolhido ao acaso.

Ele precisa funcionar como um degrau que te leva para a sua Visão de Vida Desejada, ou VVD. Aquele roteiro onde você descreveu o estilo de vida dos seus sonhos.

Portanto, definir um objetivo é escolher uma conquista que sirva de ponte direta para a realidade do seu VVD.

Isso garante que você gaste sua energia construindo exatamente a vida que desenhou, e não caminhando para o lado oposto.

Lembre-se: cada objetivo que você define deve estar alinhado com a visão de vida que você criou. Se não estiver conectado ao seu VVD, talvez não seja o objetivo certo para este momento.

Pense no objetivo como um passo estratégico. Não é qualquer conquista. É a conquista certa, no momento certo, para te aproximar da vida que você realmente quer viver.`,
  },
  habilidades: {
    filename: "habilidades-explanation-audio.mp3",
    text: `Como descobrir habilidades que precisam ser desenvolvidas.

Uma habilidade a desenvolver é uma competência que você ainda não domina, mas que é essencial para alcançar seus objetivos e viver a vida que você projetou na sua VVD.

Identificar essas habilidades é um passo fundamental no seu PDI porque mostra exatamente onde você precisa crescer para chegar onde quer.

Existem duas formas principais de descobrir quais habilidades você precisa desenvolver:

Primeiro, a Autoavaliação combinada com feedback 360 graus. Neste exercício, você avalia suas próprias competências e pede para pessoas de confiança avaliarem você também. A diferença entre como você se vê e como os outros te veem revela pontos cegos importantes.

Segundo, você pode explorar as outras ferramentas disponíveis no sistema, como a análise SWOT pessoal, que ajuda a identificar suas fraquezas e ameaças que podem exigir novas habilidades.

Lembre-se: não é sobre ter todas as habilidades do mundo. É sobre identificar aquelas que são estratégicas para os seus objetivos específicos.

Foque nas habilidades que vão te ajudar a dar o próximo passo na direção da vida que você quer construir.`,
  },
  meta: {
    filename: "meta-explanation-audio.mp3",
    text: `Uma Meta deve estar conectada ao objetivo e ao VVD. Se a meta não tiver nada a ver com o objetivo e o VVD, não é uma meta forte.

A meta é o desdobramento prático do seu objetivo. Ela transforma algo amplo em algo específico e mensurável.

Pense assim: o objetivo é o destino, a meta é o caminho concreto que você vai percorrer para chegar lá.

Uma meta forte tem três características essenciais: ela está diretamente ligada a um objetivo do seu Plano de Vida, ela faz sentido dentro da sua Visão de Vida Desejada, e ela é clara o suficiente para que você saiba exatamente quando a alcançou.

Se a sua meta não se conecta ao objetivo nem ao VVD, ela pode ser uma boa ideia, mas não é prioridade agora. Foque no que realmente te aproxima da vida que você quer construir.`,
  },
  acao: {
    filename: "acao-explanation-audio.mp3",
    text: `Uma ação é um degrau para alcançar a meta.

Se a meta é o destino intermediário, a ação é o movimento que você faz para chegar até ela.

Cada ação deve ser algo que você consegue executar na prática. Não adianta criar ações vagas ou genéricas. Uma boa ação é concreta, tem periodicidade definida e está diretamente conectada à meta que você quer alcançar.

Pense na ação como um compromisso com você mesmo. É aquilo que você vai fazer de forma consistente para transformar a meta em realidade.

Quanto mais claras e específicas forem suas ações, mais fácil será manter a disciplina e medir o progresso.

Lembre-se: grandes conquistas são resultado de pequenas ações executadas com consistência.`,
  },
  passo: {
    filename: "passo-explanation-audio.mp3",
    text: `O passo é uma pequena atividade diária que, se executada de forma consistente, gera a ação e, por consequência, a conquista da meta.

Pense no passo como o menor movimento possível na direção certa. É aquela atividade simples que você pode fazer todos os dias, sem desculpas, sem precisar de condições perfeitas.

A lógica é simples: passos consistentes geram ações completas. Ações completas conquistam metas. Metas alcançadas realizam objetivos. E objetivos realizados constroem a vida que você desenhou no seu VVD.

O segredo está na consistência, não na intensidade. Um passo pequeno feito todos os dias vale mais do que um grande esforço feito de vez em quando.

Defina passos que sejam realistas para a sua rotina atual. O importante é que eles sejam sustentáveis e que você consiga mantê-los ao longo do tempo.`,
  },
  diario: {
    filename: "diario-explanation-audio.mp3",
    text: `O que é um Diário Digital Inteligente no PDI.

No PDI, o Diário não é apenas um espaço livre de anotações. Ele convida o usuário a registrar, de forma simples e objetiva: seu humor no dia, pensamentos relevantes, conquistas ou avanços, mesmo que pequenos, e uma gratidão diária. Essa estrutura orientada transforma o ato de escrever em um processo consciente de organização interna.

Registrar o humor aumenta a consciência emocional. A prática de identificar e registrar o humor diário é amplamente utilizada em abordagens terapêuticas baseadas em evidências. Ao nomear emoções, a pessoa desenvolve maior consciência sobre seus estados internos, identifica padrões emocionais ao longo do tempo e reduz a sensação de confusão ou sobrecarga difusa. Esse processo favorece a autorregulação emocional, permitindo decisões mais alinhadas com objetivos pessoais e profissionais.

Escrever pensamentos organiza a mente e reduz carga emocional. A escrita reflexiva, também conhecida como expressive writing, é um recurso estudado há décadas. Registrar pensamentos ajuda a externalizar preocupações, organiza experiências internas e reduz ruminação mental. Ao colocar ideias no papel ou na tela, o cérebro deixa de gastar energia apenas segurando informações e passa a processá-las de forma mais clara e estruturada.

Registrar conquistas fortalece a autoconfiança e a motivação. Um dos maiores bloqueios no desenvolvimento de carreira e vida é a sensação de estagnação, muitas vezes causada por não perceber o próprio progresso. Ao registrar conquistas diárias, mesmo pequenas, a percepção de avanço se torna mais concreta, a autoconfiança é reforçada e a motivação tende a se sustentar no longo prazo. Esse princípio está diretamente relacionado ao conceito de autoeficácia, que descreve a crença na própria capacidade de agir e evoluir.

Praticar gratidão melhora bem-estar e perspectiva. A gratidão não elimina desafios, mas altera a forma como eles são percebidos. Estudos mostram que o registro regular de gratidão está associado a maior bem-estar subjetivo, mais emoções positivas no cotidiano e melhor equilíbrio emocional diante de dificuldades. No contexto do PDI, a gratidão ajuda o usuário a manter uma visão mais ampla da própria trajetória, sem negar problemas, mas sem ser dominado por eles.

O diferencial está na combinação estruturada. O verdadeiro valor do Diário Digital Inteligente não está em um único elemento isolado, mas na integração consciente de todos eles: Humor gera consciência emocional. Pensamentos geram clareza cognitiva. Conquistas geram reforço de progresso. Gratidão gera equilíbrio emocional. Essa combinação cria um ciclo diário de organização interna, alinhado ao propósito maior do PDI: ajudar a pessoa a sair do modo reativo e assumir uma postura mais estratégica sobre a própria vida e carreira.

O Diário do PDI não promete soluções instantâneas nem resultados mágicos. Seu valor está na prática contínua. Com o uso regular, o usuário tende a desenvolver mais clareza sobre si mesmo, maior senso de direção, melhor relação com suas metas e decisões e mais consciência do próprio processo de evolução.

Registrar o dia não é apenas escrever sobre o que aconteceu. É construir, aos poucos, uma visão mais clara de quem você é, onde está e para onde quer ir.`,
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
