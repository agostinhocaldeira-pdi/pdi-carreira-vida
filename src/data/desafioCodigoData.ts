export interface DayExercise {
  day: number;
  title: string;
  week: number;
  weekTitle: string;
  problem: string;
  movie: string;
  cost: string[];
  insight: string;
  insightSource: string;
  exercises: {
    title: string;
    description?: string;
    inputs?: { label: string; placeholder: string; type: 'textarea' | 'input' }[];
  }[];
  closing: string;
}

export const desafioData: DayExercise[] = [
  {
    day: 1,
    title: "QUANDO TUDO PARECE IMPORTANTE AO MESMO TEMPO",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Quando muitas coisas pedem atenção ao mesmo tempo, a mente tenta abraçar o mundo. O resultado? O foco se divide e o avanço fica pequeno. O dia termina cheio, mas a sensação de progresso fica vazia.",
    movie: "O dia mal começa, o celular vibra, mensagens chegam, tarefas brotam do chão. Uma pendência puxa a outra. O tempo voa. Quando você percebe, já é noite, o cansaço bate e sobra aquele sentimento incômodo de que o essencial ficou para amanhã.",
    cost: ["Sua energia se espalha. 🔋", "Sua mente fica sobrecarregada. 🧠", "O esforço é alto, mas o resultado demora. 🏃"],
    insight: "Antes de sair fazendo, o segredo é escolher. Existe um princípio poderoso que diz: \"Resultados extraordinários surgem quando damos atenção extraordinária a uma única coisa.\"",
    insightSource: "A Única Coisa, de Gary Keller e Jay Papasan.",
    exercises: [
      {
        title: "🔍 Investigação rápida",
        inputs: [
          { label: "O que tem roubado a maior parte do meu tempo?", placeholder: "Escreva aqui suas reflexões...", type: "textarea" },
          { label: "Dessas coisas, quais realmente constroem a vida que eu quero?", placeholder: "Reflita e escreva...", type: "textarea" }
        ]
      },
      {
        title: "🎯 A Pergunta de Ouro",
        inputs: [
          { label: "\"Se eu pudesse avançar em apenas UMA área da minha vida nos próximos 30 dias, qual traria mais impacto positivo?\"", placeholder: "Qual é a sua única coisa?", type: "textarea" }
        ]
      },
      {
        title: "⬇️ O Compromisso",
        inputs: [
          { label: "Complete: \"Nos próximos 30 dias, vou direcionar meu melhor tempo e energia para:\"", placeholder: "Seu compromisso principal...", type: "input" }
        ]
      }
    ],
    closing: "Hoje você não precisou fazer mil coisas. Você só precisou fazer a escolha certa."
  },
  {
    day: 2,
    title: "O PERIGO DE SER O \"SIMPÁTICO\" QUE NÃO SAI DO LUGAR",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Você já percebeu como é fácil dizer \"sim\"? Alguém pede um favor e a palavra sai da sua boca antes de pensar. O problema é que cada \"sim\" para os outros é um \"não\" para o seu objetivo.",
    movie: "Você está focado na meta. Chega uma mensagem: \"Pode me ajudar rapidinho?\". Você aceita para não ser chato. Resultado? Sua agenda lota com as prioridades dos outros, e a sua prioridade fica espremida no canto.",
    cost: ["Sobrecarga: Você carrega pesos que não são seus.", "Ressentimento: Você faz as coisas com raiva por ter aceitado.", "Mediocridade: Quem tenta agradar a todos não se dedica a nada."],
    insight: "No livro Essencialismo, aprendemos a regra: \"Se não for um SIM óbvio, então é um NÃO óbvio.\" Dizer não é a única forma de proteger o que importa.",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "🔍 O Detector de Ruído",
        inputs: [
          { label: "Identifique um compromisso na sua agenda (futura ou atual) que você só aceitou por educação.", placeholder: "Qual compromisso você vai cancelar ou renegociar?", type: "textarea" }
        ]
      },
      {
        title: "✂️ O Corte Cirúrgico",
        description: "A missão hoje é cancelar ou renegociar esse compromisso. Use educação, mas seja firme."
      },
      {
        title: "⚓ A Frase de Proteção",
        inputs: [
          { label: "Escreva para lembrar:", placeholder: "\"Dizer NÃO para o pedido é dizer SIM para o meu propósito.\"", type: "input" }
        ]
      }
    ],
    closing: "Ao eliminar o que é apenas \"bom\", você abre espaço para o que é \"ótimo\"."
  },
  {
    day: 3,
    title: "O AMBIENTE INVISÍVEL QUE TE CONTROLA",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Você tenta focar, mas o celular pisca, a mesa está bagunçada, a TV está ligada. Você acha que tem falta de força de vontade, mas na verdade, você está lutando contra o seu cenário.",
    movie: "Você senta para trabalhar. 5 minutos depois, o celular está na sua mão. Você nem sabe como ele foi parar lá. É o piloto automático reagindo ao que está fácil de alcançar.",
    cost: ["Cada vez que seu ambiente te distrai, você gasta energia mental para voltar ao foco.", "É como tentar correr na areia fofa: esforço dobrado, velocidade reduzida."],
    insight: "No livro Hábitos Atômicos, aprendemos que \"O ambiente é a mão invisível que molda o comportamento\". Não dependa da força de vontade; desenhe o seu ambiente para o sucesso.",
    insightSource: "Hábitos Atômicos, de James Clear.",
    exercises: [
      {
        title: "🔍 O Espião",
        inputs: [
          { label: "Olhe ao redor agora. O que na sua mesa ou quarto está gritando por atenção (celular, controle remoto, bagunça)?", placeholder: "Liste os distraidores...", type: "textarea" }
        ]
      },
      {
        title: "🚧 A Regra dos 20 Segundos",
        description: "Afaste as distrações para que levem mais de 20 segundos para alcançar. Coloque o celular em outro cômodo."
      },
      {
        title: "🧹 O Limpa-Trilho",
        inputs: [
          { label: "O que você vai deixar na sua frente para a tarefa de agora?", placeholder: "Apenas o essencial...", type: "input" }
        ]
      }
    ],
    closing: "Você não precisa ser mais forte que a distração. Você só precisa ser mais esperto que ela."
  },
  {
    day: 4,
    title: "A REGRA 80/20 DA VIDA",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Você faz uma lista de 10 coisas e sente que precisa fazer todas com a mesma perfeição. Spoiler: você não precisa.",
    movie: "Você passa horas escolhendo a fonte perfeita do slide ou organizando a gaveta de meias, mas o projeto importante que vai te dar dinheiro ou nota... ficou para depois.",
    cost: ["Estar ocupado é fácil. Ser produtivo é difícil.", "Gastar tempo em coisas pequenas te dá a falsa sensação de dever cumprido, enquanto o \"monstro\" real continua lá."],
    insight: "O Princípio de Pareto, citado em Trabalhe 4 Horas por Semana, diz que 80% dos resultados vêm de 20% das ações. A maioria do que fazemos é espuma; pouca coisa é café.",
    insightSource: "Trabalhe 4 Horas por Semana, de Tim Ferriss.",
    exercises: [
      {
        title: "📝 A Lista",
        inputs: [
          { label: "Escreva 5 coisas que você \"tem\" que fazer hoje:", placeholder: "Liste suas 5 tarefas...", type: "textarea" }
        ]
      },
      {
        title: "🔍 O Filtro",
        inputs: [
          { label: "Se você só pudesse fazer UMA, qual delas traria 80% do resultado do seu dia?", placeholder: "A tarefa mais impactante...", type: "input" }
        ]
      },
      {
        title: "⭕ O Círculo",
        description: "Circule essa tarefa e faça ela PRIMEIRO. Antes de tudo."
      }
    ],
    closing: "Não seja um \"fazedor de tarefas\". Seja um \"gerador de resultados\"."
  },
  {
    day: 5,
    title: "QUEM VOCÊ PENSA QUE É?",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Você tenta mudar um hábito na força do ódio: \"Eu tenho que acordar cedo\". Mas no fundo, você não acredita que consegue.",
    movie: "Você começa a academia segunda-feira. Na quarta, chove. Você pensa: \"Ah, eu sou preguiçoso mesmo\". E desiste. O problema não foi a chuva, foi o rótulo que você se deu.",
    cost: ["Quando sua meta briga com quem você acha que é, a identidade sempre ganha.", "Você se autossabota para continuar sendo a \"versão antiga\" de si mesmo."],
    insight: "A mudança real não é de resultado, é de identidade (Hábitos Atômicos). Pare de dizer \"Eu quero ler\" e comece a dizer \"Eu sou um leitor\".",
    insightSource: "Hábitos Atômicos, de James Clear.",
    exercises: [
      {
        title: "🏷️ O Rótulo Velho",
        inputs: [
          { label: "Qual rótulo negativo você se dá? (Ex: \"Sou desorganizado\", \"Sou procrastinador\")", placeholder: "O rótulo que você carrega...", type: "input" }
        ]
      },
      {
        title: "👑 A Nova Identidade",
        inputs: [
          { label: "Quem você quer ser? (Ex: \"Eu sou o tipo de pessoa que não falha compromissos\")", placeholder: "Sua nova identidade...", type: "input" }
        ]
      },
      {
        title: "✅ A Prova Real",
        inputs: [
          { label: "Faça uma pequena ação hoje que prove essa nova identidade. (Ex: Arrumar a cama = Sou organizado)", placeholder: "Qual ação vai provar quem você é?", type: "input" }
        ]
      }
    ],
    closing: "Cada ação é um voto para a pessoa que você está se tornando."
  },
  {
    day: 6,
    title: "MERGULHO PROFUNDO (SEM OXIGÊNIO DE NOTIFICAÇÃO)",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Você trabalha \"picadinho\". 10 minutos aqui, uma olhada no Instagram ali. Isso não é trabalho, é \"snack\" de atenção.",
    movie: "Você está escrevendo um e-mail. Pling! Notificação. Você olha. Volta pro e-mail. Pling! Grupo da família. No fim, o e-mail levou 1 hora pra ser escrito.",
    cost: ["A ciência mostra que leva cerca de 23 minutos para retomar o foco total após uma interrupção.", "Se você é interrompido a cada 10, você nunca está em foco total."],
    insight: "Cal Newport, em Trabalho Focado, explica que as grandes conquistas exigem Deep Work: foco total e sem distração por um período. É um superpoder raro.",
    insightSource: "Trabalho Focado (Deep Work), de Cal Newport.",
    exercises: [
      {
        title: "🎯 O Desafio",
        description: "Hoje, você vai fazer um bloco de 45 a 60 minutos de \"Mergulho Profundo\"."
      },
      {
        title: "🕳️ Modo Caverna",
        inputs: [
          { label: "Celular em modo avião (ou longe), abas fechadas. Avise quem precisar: \"Estou focado agora\".", placeholder: "A que horas você vai fazer o mergulho?", type: "input" }
        ]
      },
      {
        title: "🚀 A Execução",
        inputs: [
          { label: "Escolha uma tarefa difícil e mergulhe nela até o tempo acabar. Qual será?", placeholder: "A tarefa do seu mergulho profundo...", type: "input" }
        ]
      }
    ],
    closing: "A profundidade é onde o ouro está enterrado. A superfície é só barulho."
  },
  {
    day: 7,
    title: "A FAXINA MENTAL (GTD)",
    week: 1,
    weekTitle: "Alicerces",
    problem: "Sua cabeça parece um navegador com 50 abas abertas. Você fica tentando lembrar de comprar leite, mandar o relatório e ligar pra mãe, tudo ao mesmo tempo.",
    movie: "Você está tentando relaxar no domingo, mas seu cérebro grita: \"NÃO ESQUECE O BOLETO AMANHÃ!\". A ansiedade não te deixa em paz.",
    cost: ["Seu cérebro serve para ter ideias, não para guardar ideias.", "Tentar memorizar tudo gera estresse e consome a bateria mental."],
    insight: "David Allen, em A Arte de Fazer Acontecer (GTD), ensina: \"Sua mente precisa estar livre como a água\". O segredo é tirar tudo da cabeça e colocar num sistema confiável.",
    insightSource: "A Arte de Fazer Acontecer (GTD), de David Allen.",
    exercises: [
      {
        title: "📥 O Despejo",
        description: "Pegue um papel e caneta agora."
      },
      {
        title: "⬇️ Download",
        inputs: [
          { label: "Escreva TUDO que está pendente na sua cabeça. Do projeto grande até \"comprar pasta de dente\". TUDO.", placeholder: "Despeje tudo aqui...", type: "textarea" }
        ]
      },
      {
        title: "😌 Alívio",
        description: "Não faça nada agora. Só tire da cabeça. Sinta o peso saindo dos ombros."
      }
    ],
    closing: "Papel não esquece. Sua cabeça, sim. Deixe o papel segurar a bronca."
  },
  {
    day: 8,
    title: "ENGOLINDO O SAPO",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Você começa o dia pelas tarefas fáceis. Responde e-mail, arruma a mesa... e deixa aquela tarefa chata e difícil para o final da tarde.",
    movie: "Chega às 17h, você está exausto, olha para a tarefa difícil e diz: \"Amanhã eu faço\". O ciclo da procrastinação se renova.",
    cost: ["A tarefa difícil fica na sua cabeça o dia todo, gerando ansiedade de fundo.", "É um fantasma te assombrando enquanto você finge que trabalha."],
    insight: "Brian Tracy, em Eat That Frog!, diz: \"Se você tem que engolir um sapo, faça isso logo de manhã\". O sapo é a sua tarefa mais importante e difícil.",
    insightSource: "Eat That Frog!, de Brian Tracy.",
    exercises: [
      {
        title: "🐸 Identifique o Sapo",
        inputs: [
          { label: "Qual é a tarefa que você está evitando, mas que traria mais resultado?", placeholder: "Seu sapo de amanhã...", type: "input" }
        ]
      },
      {
        title: "🤝 O Pacto",
        description: "Amanhã, ela será a primeira coisa a ser feita. Antes do café, antes do Instagram."
      },
      {
        title: "🌙 Preparo",
        inputs: [
          { label: "O que você vai deixar pronto hoje à noite para começar engolindo o sapo amanhã?", placeholder: "Prepare o terreno...", type: "input" }
        ]
      }
    ],
    closing: "Mate o monstro enquanto ele é pequeno (de manhã). À tarde, ele vira um Godzilla."
  },
  {
    day: 9,
    title: "A ARTE DE COMEÇAR \"ESTÚPIDO\"",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Você quer ler 50 livros por ano ou correr uma maratona. A meta é tão grande que você trava só de olhar para ela.",
    movie: "\"Hoje vou malhar 1 hora!\". Você olha pro tênis, sente preguiça, pensa no suor... e senta no sofá. A meta grande te paralisou.",
    cost: ["A motivação é volátil. Confiar nela é pedir para falhar.", "Quando a meta é assustadora, o cérebro resiste e foge."],
    insight: "No livro Mini Hábitos, a estratégia é: crie uma meta \"estúpida\" de tão pequena. Quer ler mais? Meta: ler 1 página. Quer malhar? Meta: 1 flexão.",
    insightSource: "Mini Hábitos, de Stephen Guise.",
    exercises: [
      {
        title: "🤏 A Escolha",
        inputs: [
          { label: "Pegue um hábito que você quer criar e está difícil:", placeholder: "Qual hábito você quer?", type: "input" }
        ]
      },
      {
        title: "📉 A Redução",
        inputs: [
          { label: "Diminua a meta até que seja impossível dizer não. (Ex: Meditar por 30 segundos)", placeholder: "Sua meta \"estúpida\"...", type: "input" }
        ]
      },
      {
        title: "▶️ A Ação",
        description: "Faça essa meta mínima AGORA. Só começar."
      }
    ],
    closing: "O melhor treino é aquele que acontece. E o que acontece é o que é fácil de começar."
  },
  {
    day: 10,
    title: "GERENCIANDO BATERIA, NÃO RELÓGIO",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Você acha que produtividade é preencher cada minuto. Trabalha cansado, arrastado, achando que \"horas na cadeira\" é igual a sucesso.",
    movie: "Você está na frente do computador há 4 horas seguidas. Seus olhos ardem, você lê a mesma frase 3 vezes. Você continua, mas não produz nada de útil.",
    cost: ["Tempo sem energia é desperdício.", "Uma hora de trabalho focado e energizado vale por quatro horas de trabalho zumbi."],
    insight: "No livro O Poder do Engajamento Total, aprendemos que a moeda da alta performance é a energia, não o tempo. Somos baterias, precisamos de ciclos de gasto e recarga.",
    insightSource: "O Poder do Engajamento Total, de Jim Loehr & Tony Schwartz.",
    exercises: [
      {
        title: "🔋 Diagnóstico",
        inputs: [
          { label: "Em qual momento do dia você sente sua energia cair? (Geralmente pós-almoço ou fim da tarde)", placeholder: "Quando sua bateria acaba?", type: "input" }
        ]
      },
      {
        title: "🔌 Recarga Ativa",
        inputs: [
          { label: "Planeje uma pausa de 10 minutos hoje. Não é celular. É beber água, esticar o corpo, respirar.", placeholder: "A que horas será sua pausa?", type: "input" }
        ]
      },
      {
        title: "🍅 O Teste",
        description: "Experimente trabalhar em blocos de 50 minutos + 10 de pausa. Sinta a diferença."
      }
    ],
    closing: "Não gerencie seu relógio. Gerencie sua vitalidade."
  },
  {
    day: 11,
    title: "O PODER DO CHECKLIST",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Você confia demais na sua memória. Acha que sabe os passos de cabeça, até que esquece um detalhe bobo que atrasa tudo.",
    movie: "Você sai de casa, anda dois quarteirões e... \"Esqueci a máscara/chave/carteira\". Volta, perde tempo, se estressa.",
    cost: ["Erros bobos custam caro. Eles consomem tempo de refação e minam sua autoconfiança.", "Profissionais amadores confiam na mente; a elite usa checklists."],
    insight: "Atul Gawande, em Checklist, mostra que até cirurgiões e pilotos usam listas simples para salvar vidas. Libere sua mente para pensar, deixe o checklist lembrar.",
    insightSource: "Checklist: Como fazer as coisas bem feitas, de Atul Gawande.",
    exercises: [
      {
        title: "🔄 A Escolha",
        inputs: [
          { label: "Pense em uma tarefa repetitiva que você faz (fazer a mala, relatório semanal, rotina da manhã):", placeholder: "Qual tarefa repetitiva?", type: "input" }
        ]
      },
      {
        title: "📝 A Criação",
        inputs: [
          { label: "Escreva um passo a passo simples (checklist) para ela:", placeholder: "1. ... 2. ... 3. ...", type: "textarea" }
        ]
      },
      {
        title: "✅ O Uso",
        description: "Use esse checklist da próxima vez que fizer essa tarefa."
      }
    ],
    closing: "A genialidade precisa de estrutura para brilhar."
  },
  {
    day: 12,
    title: "A VOZ NA SUA CABEÇA",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Diante de um desafio ou erro, você pensa: \"Eu não sou bom nisso\", \"Isso não é pra mim\". Você vê o talento como algo que nasce pronto.",
    movie: "Você recebe um feedback duro. Em vez de pensar \"onde posso melhorar?\", você pensa \"ele não gosta de mim\" ou \"sou uma fraude\". E desiste.",
    cost: ["Mindset Fixo te faz fugir de desafios para não provar que é \"incapaz\".", "Você estagna por medo de errar."],
    insight: "Carol Dweck, em Mindset, ensina a usar a palavra mágica: \"AINDA\". \"Eu não sou bom nisso... AINDA\". O cérebro aprende. Erro não é fracasso, é dado para melhoria.",
    insightSource: "Mindset: A Nova Psicologia do Sucesso, de Carol Dweck.",
    exercises: [
      {
        title: "🚨 O Flagra",
        inputs: [
          { label: "Hoje, monitore seus pensamentos. Pegue-se pensando \"não consigo\":", placeholder: "Qual pensamento negativo você flagrou?", type: "input" }
        ]
      },
      {
        title: "🔄 A Troca",
        inputs: [
          { label: "Mude a frase imediatamente para: \"O que eu preciso aprender para conseguir isso?\"", placeholder: "Sua nova pergunta...", type: "input" }
        ]
      },
      {
        title: "👶 A Lição",
        description: "Encare um pequeno erro hoje como uma lição, não como uma sentença."
      }
    ],
    closing: "Talento é o ponto de partida. Esforço é o que te leva à linha de chegada."
  },
  {
    day: 13,
    title: "QUANDO O BURACO FICA FUNDO",
    week: 2,
    weekTitle: "Estratégia",
    problem: "A empolgação do começo passou. Agora ficou difícil, chato e trabalhoso. A vontade é largar tudo e começar algo novo.",
    movie: "O \"Projeto Verão\" dura 2 semanas. O curso de inglês dura 1 mês. Quando a novidade acaba e vira rotina, você para.",
    cost: ["Quem pula de galho em galho nunca constrói nada sólido.", "O sucesso está escondido logo depois do momento em que a maioria desiste."],
    insight: "Em Garra, Angela Duckworth prova que a paixão e a perseverança valem mais que o talento. O segredo é se apaixonar pelo tédio da consistência.",
    insightSource: "Garra (Grit), de Angela Duckworth.",
    exercises: [
      {
        title: "🚧 O Ponto de Desistência",
        inputs: [
          { label: "Onde você está pensando em parar só porque ficou difícil ou chato?", placeholder: "O que você está querendo abandonar?", type: "input" }
        ]
      },
      {
        title: "🧠 O Reenquadramento",
        description: "Entenda que o tédio é um bom sinal: significa que você está fazendo o trabalho necessário."
      },
      {
        title: "🤝 A Promessa",
        inputs: [
          { label: "Diga a si mesmo:", placeholder: "\"Eu não desisto num dia ruim. Só paro quando terminar.\"", type: "input" }
        ]
      }
    ],
    closing: "Vencedores são apenas perdedores que tentaram mais uma vez."
  },
  {
    day: 14,
    title: "FAXINA DIGITAL",
    week: 2,
    weekTitle: "Estratégia",
    problem: "Seu celular é um cassino. Cada notificação é um caça-níquel roubando sua atenção. Você vive reagindo aos \"bips\".",
    movie: "Você vai checar a hora no celular. Vê um ícone colorido. Clica. 20 minutos depois, você está vendo vídeo aleatório e nem sabe que horas são.",
    cost: ["As redes sociais são desenhadas para viciar.", "Se você não controlar as entradas, será escravo do algoritmo e do tempo dos outros."],
    insight: "Nir Eyal, em Indistraível, ensina a dominar os gatilhos externos. Você não precisa sair da internet, só precisa retomar o controle.",
    insightSource: "Indistraível, de Nir Eyal.",
    exercises: [
      {
        title: "🔕 Silencie",
        description: "Desative TODAS as notificações que não são de humanos reais (apps de comida, notícias, jogos, likes)."
      },
      {
        title: "📱 Limpe",
        description: "Tire os apps viciantes da tela inicial. Esconda-os em pastas longe da vista."
      },
      {
        title: "🧪 Teste",
        inputs: [
          { label: "Quantos minutos você passou no celular hoje em coisas inúteis?", placeholder: "Seja honesto...", type: "input" }
        ]
      }
    ],
    closing: "Você não precisa deletar as redes. Só precisa ser dono do seu tempo."
  },
  {
    day: 15,
    title: "A MANHÃ VENCE O DIA",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você acorda e a primeira coisa que faz é pegar o celular na cama. O mundo externo invade sua mente antes de você dar \"bom dia\" pra si mesmo.",
    movie: "Você abre os olhos, pega o celular e vê más notícias ou vidas perfeitas no Instagram. Sua ansiedade dispara antes de escovar os dentes. Você já começou o dia perdendo.",
    cost: ["Começar o dia reativo (respondendo aos outros) mata sua capacidade de ser proativo (criar o seu futuro)."],
    insight: "Livros como O Milagre da Manhã e O Clube das 5 da Manhã ensinam: a primeira hora é o leme do dia. Se você vence a manhã, você vence o dia.",
    insightSource: "O Milagre da Manhã, de Hal Elrod.",
    exercises: [
      {
        title: "🚫 A Proibição",
        description: "Amanhã, não toque no celular nos primeiros 30 minutos. Nada."
      },
      {
        title: "🌅 O Ritual",
        inputs: [
          { label: "Use esse tempo para você: beba água, alongue, leia uma página, ou apenas fique em silêncio. O que você vai fazer?", placeholder: "Seu ritual matinal...", type: "input" }
        ]
      },
      {
        title: "📝 A Intenção",
        inputs: [
          { label: "Qual é a sua intenção para amanhã?", placeholder: "Defina uma intenção clara...", type: "input" }
        ]
      }
    ],
    closing: "Domine sua manhã, domine sua vida."
  },
  {
    day: 16,
    title: "PAUSA NÃO É CRIME",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você se culpa por parar. Sente que se não estiver produzindo, está atrasado. Acha que descansar é preguiça.",
    movie: "Você corre com o tanque vazio. Vai uma hora, vai duas, até que quebra. A ansiedade invade e você só para por colapso, não por escolha.",
    cost: ["Quem não descansa com intenção, trabalha com mediocridade.", "Foco cansado é foco burro. Você perde a visão e a precisão."],
    insight: "Se o foco é uma flecha, o descanso é o arco sendo puxado para trás. Você precisa recuar para avançar com força. Descanso não é parar, é recarregar.",
    insightSource: "O Poder do Engajamento Total, de Jim Loehr & Tony Schwartz.",
    exercises: [
      {
        title: "🧪 O Teste",
        inputs: [
          { label: "Responda: Quando foi a última vez que você parou sem sentir culpa?", placeholder: "Seja honesto...", type: "input" }
        ]
      },
      {
        title: "🧘 A Prática",
        description: "Hoje, separe 15 minutos de \"nada\". Sem celular, sem estímulo. Apenas respire."
      },
      {
        title: "🎯 A Meta",
        description: "Descansar por escolha estratégica, e não por exaustão física."
      }
    ],
    closing: "Pausa não é perda de tempo. É manutenção de performance."
  },
  {
    day: 17,
    title: "BOMBEIRO DE SI MESMO",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você passa o dia apagando incêndio. Tudo parece ser \"pra ontem\". Você vive em modo de sobrevivência.",
    movie: "Você resolve 20 problemas pequenos e urgentes, mas o projeto importante da sua vida ficou intocado. Você correu, suou, mas não saiu do lugar.",
    cost: ["A urgência é contagiosa.", "Se você não define sua prioridade, a demanda dos outros define por você. O essencial vira \"depois\", e o depois vira \"nunca\"."],
    insight: "\"Se você não define suas prioridades, alguém vai definir por você\". Aprenda a diferenciar o que é urgente (grita) do que é importante (constrói).",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "🎯 Defina",
        inputs: [
          { label: "Qual é a ÚNICA coisa importante de hoje? Aquela que constrói seu futuro?", placeholder: "O que realmente importa hoje?", type: "input" }
        ]
      },
      {
        title: "🛡️ Proteja",
        description: "Faça essa coisa antes de abrir o e-mail ou WhatsApp e entrar no modo reativo."
      },
      {
        title: "❓ Questione",
        inputs: [
          { label: "\"Estou correndo por propósito ou apenas por pressão?\"", placeholder: "Sua reflexão...", type: "textarea" }
        ]
      }
    ],
    closing: "Pare de trabalhar no susto. Comece a trabalhar na meta."
  },
  {
    day: 18,
    title: "O MITO DO POLVO (MULTITAREFA)",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você acha que fazer duas coisas ao mesmo tempo é ser eficiente. Responde mensagem enquanto ouve a reunião.",
    movie: "Você fez 10 coisas, mas nenhuma ficou excelente. O cérebro só troca de tarefa rápido, e cada troca custa energia. No fim, você sente que trabalhou muito, mas produziu pouco.",
    cost: ["Multitarefa te deixa mediano em tudo.", "Você está presente de corpo, mas ausente de mente. Quem faz tudo, não faz nada."],
    insight: "Fazer muitas coisas ao mesmo tempo é a melhor forma de não fazer nenhuma bem feita. Qualidade exige presença total.",
    insightSource: "A Única Coisa, de Gary Keller.",
    exercises: [
      {
        title: "🎯 A Escolha",
        inputs: [
          { label: "Escolha uma tarefa para agora. Só uma.", placeholder: "Qual tarefa?", type: "input" }
        ]
      },
      {
        title: "🚫 A Eliminação",
        description: "Feche todas as outras abas, apps, distrações. Foco total."
      },
      {
        title: "💎 A Execução",
        description: "Faça do início ao fim com 100% de presença. Veja a diferença na qualidade e no tempo."
      }
    ],
    closing: "Quem tenta caçar dois coelhos não pega nenhum."
  },
  {
    day: 19,
    title: "ESCUTE ANTES QUE GRITE",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você ignora os sinais do corpo. Dorzinha nas costas? Remédio. Sono ruim? Café. Irritação? Engole o choro e continua.",
    movie: "Você diz \"só mais um pouco\", até que vira uma gripe forte, uma crise de coluna ou um burnout. O corpo te para à força, e aí não tem negociação.",
    cost: ["Se a mente não para, o corpo uma hora cobra. E ele cobra com juros altos.", "Excesso de estímulo mina sua energia sem você ver."],
    insight: "Não espere o colapso. Monitore sua bateria. Irritação, falta de paciência e sono ruim são luzes vermelhas no painel.",
    insightSource: "O Poder do Engajamento Total, de Jim Loehr & Tony Schwartz.",
    exercises: [
      {
        title: "🔋 Check-in",
        inputs: [
          { label: "De 0 a 10, como está sua energia e paciência hoje? Seja honesto.", placeholder: "Sua nota de 0 a 10...", type: "input" }
        ]
      },
      {
        title: "🧐 Análise",
        inputs: [
          { label: "O que está drenando você? (Pessoas, tarefas, falta de sono, alimentação ruim)", placeholder: "O que está te drenando?", type: "textarea" }
        ]
      },
      {
        title: "🛌 Ação",
        description: "Faça uma coisa HOJE para cuidar da sua energia (dormir mais cedo, caminhar, beber água)."
      }
    ],
    closing: "Alta performance exige um veículo (seu corpo) em dia. Cuide da máquina."
  },
  {
    day: 20,
    title: "APERTANDO O FREIO",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você tem medo de parar e parecer improdutivo. Acha que a vida não dá pausa, então você também não pode dar.",
    movie: "Você dirige a 150km/h sem saber para onde está indo. Parece rápido, mas pode estar indo direto para o abismo.",
    cost: ["Quem não freia para ajustar a rota, se perde com velocidade.", "Parar por conta própria é sinal de inteligência, não de fraqueza."],
    insight: "Às vezes, parar é o único jeito de recomeçar no lugar certo. É no silêncio do freio que a direção reaparece. \"Você precisa parar antes que o mundo te obrigue\".",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "🛑 O Desafio",
        description: "Tire 20 minutos no meio do dia para NÃO fazer nada \"produtivo\". Apenas exista."
      },
      {
        title: "👀 Observe",
        inputs: [
          { label: "A culpa vem? A ansiedade bate? Observe o que você sente quando para.", placeholder: "O que você sentiu?", type: "textarea" }
        ]
      },
      {
        title: "🧭 Entenda",
        description: "A pausa não é o oposto do progresso. É parte dele."
      }
    ],
    closing: "Aperte o freio para garantir que ainda está na estrada certa."
  },
  {
    day: 21,
    title: "AÇÃO GERA MOTIVAÇÃO",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você está esperando a \"vontade\" chegar para começar o projeto, o treino ou o estudo.",
    movie: "Você fica no sofá esperando a inspiração divina. Ela não vem. O dia acaba. Você se frustra e promete que \"amanhã vai\".",
    cost: ["A motivação não é um raio que cai do céu. Ela é filha do movimento.", "Esperar sentir vontade é a armadilha dos amadores."],
    insight: "Você não precisa estar motivado para começar; precisa começar para se motivar. A energia vem depois do play, não antes.",
    insightSource: "Hábitos Atômicos, de James Clear.",
    exercises: [
      {
        title: "⏱️ Regra dos 5 Minutos",
        description: "Prometa fazer a tarefa chata por apenas 5 minutos. Diga: \"Só 5 minutos\"."
      },
      {
        title: "▶️ Comece",
        inputs: [
          { label: "Sem pensar. Só comece. Levante, abra o arquivo, calce o tênis. Qual tarefa você vai começar AGORA?", placeholder: "O que você vai começar?", type: "input" }
        ]
      },
      {
        title: "✨ Mágica",
        description: "Perceba como, depois de começar, a vontade de continuar aparece sozinha."
      }
    ],
    closing: "Seja herói de si mesmo: faça o que precisa ser feito, mesmo sem querer."
  },
  {
    day: 22,
    title: "A ROTINA PERFEITA NÃO EXISTE",
    week: 3,
    weekTitle: "Mentalidade",
    problem: "Você criou um cronograma lindo, colorido e... impossível. Falhou no dia 2 e jogou tudo pro alto.",
    movie: "\"Ou eu faço tudo perfeito, ou não faço nada\". Resultado: não faz nada. Você desiste porque a vida real (filhos, trânsito) atrapalhou o plano ideal.",
    cost: ["O perfeccionismo é a mãe da procrastinação.", "Uma rotina ideal que não acontece vale menos que uma rotina \"feia\" que acontece de verdade."],
    insight: "Feito é melhor que perfeito. A rotina ideal é a que cabe na sua realidade caótica. Ela precisa ser possível, não bonita.",
    insightSource: "Mini Hábitos, de Stephen Guise.",
    exercises: [
      {
        title: "✂️ Simplifique",
        inputs: [
          { label: "Pegue aquele hábito que você quer e reduza ele pela metade:", placeholder: "Sua versão simplificada...", type: "input" }
        ]
      },
      {
        title: "📉 Consistência",
        inputs: [
          { label: "O que vale mais: treinar 2h uma vez por mês ou 20min todo dia? Aposte na frequência.", placeholder: "Sua meta de frequência...", type: "input" }
        ]
      },
      {
        title: "🔧 Ajuste",
        description: "Adapte sua meta para o seu \"dia ruim\", não para o seu \"dia ideal\"."
      }
    ],
    closing: "Constância adaptável vence disciplina robótica."
  },
  {
    day: 23,
    title: "OCUPADO NÃO É PRODUTIVO",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você enche a agenda para se sentir importante. \"Não tenho tempo pra nada\" virou seu troféu de honra.",
    movie: "Você corre o dia todo igual uma barata tonta. Resolve mil coisas. No fim do dia, se pergunta: \"O que eu fiz mesmo que valeu a pena?\".",
    cost: ["Movimento não é progresso. Você pode estar girando em círculos em alta velocidade.", "Estar ocupado muitas vezes é uma forma de preguiça: preguiça de priorizar."],
    insight: "Não preencha o tempo, ocupe o tempo com o que te move. A pergunta não é \"estou ocupado?\", mas \"estou ocupado com o quê?\".",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "🔍 Auditoria",
        inputs: [
          { label: "Olhe sua agenda. O que lá gera resultado real e o que é só ruído?", placeholder: "O que é ruído?", type: "textarea" }
        ]
      },
      {
        title: "❓ A Pergunta",
        inputs: [
          { label: "\"Isso aqui vai me transformar no melhor do mundo no que eu faço?\"", placeholder: "Sua reflexão...", type: "textarea" }
        ]
      },
      {
        title: "🚪 O Filtro",
        description: "Elimine ou delegue uma coisa da sua agenda que não contribui para sua evolução."
      }
    ],
    closing: "Agenda cheia de irrelevância é vida vazia de significado."
  },
  {
    day: 24,
    title: "ACORDAR CEDO NÃO SALVA NINGUÉM",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você acorda às 5h da manhã só porque disseram que é bom, mas passa o dia arrastado e vai dormir tarde fazendo nada.",
    movie: "Você levanta no automático, sem direção. Acordar cedo vira só mais uma hora para se ocupar, não para crescer. Você cumpre o ritual, mas a alma está exausta.",
    cost: ["Acordar cedo sem intenção é tortura.", "Se você não tem clareza do que fazer com esse tempo extra, ele vira tempo perdido."],
    insight: "Você não melhora a vida só acordando mais cedo; melhora quando descobre por que acorda. O motivo muda tudo.",
    insightSource: "O Clube das 5 da Manhã, de Robin Sharma.",
    exercises: [
      {
        title: "🤔 Reflexão",
        inputs: [
          { label: "Você tem acordado para viver ou só para cumprir horário?", placeholder: "Sua reflexão honesta...", type: "textarea" }
        ]
      },
      {
        title: "🎯 Intenção",
        inputs: [
          { label: "Amanhã, acorde com um objetivo claro para a primeira hora (ler, treinar, pensar):", placeholder: "Seu objetivo para a manhã...", type: "input" }
        ]
      },
      {
        title: "😴 Descanso",
        description: "Garanta que você está dormindo o suficiente. Acordar cedo sem descanso é autossabotagem."
      }
    ],
    closing: "Não importa a hora que você levanta, mas sim como você levanta."
  },
  {
    day: 25,
    title: "ENERGIA NÃO SE ACHA, SE CRIA",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você espera \"ter energia\" para fazer as coisas. Acha que energia é sorte ou genética.",
    movie: "Você acorda cansado, come mal, não se mexe e reclama que está sem pique. O corpo está gritando por combustível bom, e você dá \"groselha emocional\".",
    cost: ["Energia é disciplina disfarçada.", "Se você tolera maus hábitos, sua energia some. Se você protege sua fonte, a energia sobra."],
    insight: "Você não acorda com energia; você acorda e cria energia. É a soma de sono, comida, movimento e propósito.",
    insightSource: "O Poder do Engajamento Total, de Jim Loehr & Tony Schwartz.",
    exercises: [
      {
        title: "🔋 O Abastecimento",
        inputs: [
          { label: "Faça algo AGORA que recarrega: um copo d'água, 10 polichinelos, uma música boa. O que você vai fazer?", placeholder: "Sua ação de recarga...", type: "input" }
        ]
      },
      {
        title: "🚫 O Corte",
        inputs: [
          { label: "O que está drenando você? Corte uma fonte de \"groselha\" hoje (notícia ruim, fofoca):", placeholder: "O que você vai cortar?", type: "input" }
        ]
      },
      {
        title: "🥗 A Decisão",
        description: "Você constrói sua energia com base naquilo que não tolera mais."
      }
    ],
    closing: "Energia não é mágica, é compromisso com você mesmo."
  },
  {
    day: 26,
    title: "O LEME DO BARCO",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você deixa o acaso decidir como seu dia começa. A primeira coisa que entra na sua mente é problema ou vida dos outros.",
    movie: "Você começa o dia acelerado ou distraído. O resto do dia segue o mesmo ritmo: atropelado. A primeira hora dita o tom de todo o resto.",
    cost: ["O que entra primeiro comanda seu foco.", "Se for lixo, seu foco será lixo. Se for clareza, seu dia terá direção."],
    insight: "\"A primeira hora do dia é o leme do barco\". Proteja seu início. Decida quem você é antes de o mundo decidir por você.",
    insightSource: "O Milagre da Manhã, de Hal Elrod.",
    exercises: [
      {
        title: "🛡️ O Guardião",
        description: "Proteja os primeiros 20 minutos do seu dia amanhã."
      },
      {
        title: "🧠 O Filtro",
        inputs: [
          { label: "O que você vai deixar entrar? (Silêncio, gratidão, estudo). O que vai barrar? (Redes sociais, notícias).", placeholder: "Entrar: ... | Barrar: ...", type: "input" }
        ]
      },
      {
        title: "👑 O Trono",
        description: "Não deixe qualquer coisa ocupar o trono da sua atenção logo cedo."
      }
    ],
    closing: "Quem vence a primeira hora, tem grande chance de vencer o dia."
  },
  {
    day: 27,
    title: "DIZER NÃO AGORA É DIZER SIM LÁ NA FRENTE",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você quer abraçar o mundo. Tem medo de perder oportunidades e diz sim para tudo, invertendo a ordem das coisas.",
    movie: "Você diz sim para o trabalho extra e não para o jantar com a família. Diz sim para o favor do amigo e não para o seu treino.",
    cost: ["Se você diz sim para tudo, está dizendo não para o que precisa permanecer.", "Você vira refém das escolhas dos outros."],
    insight: "Dizer não agora também é foco. É maturidade emocional. Você não precisa matar a ideia, só precisa adiar com critério.",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "📂 A Gaveta",
        inputs: [
          { label: "Escolha uma coisa na sua lista que é boa, mas não é para agora. Adie.", placeholder: "O que você vai adiar?", type: "input" }
        ]
      },
      {
        title: "🚫 O Não",
        description: "Treine dizer não para algo pequeno hoje. Sinta que o mundo não vai acabar."
      },
      {
        title: "💎 A Prioridade",
        description: "Lembre: Saúde, família, trabalho. Não inverta a ordem."
      }
    ],
    closing: "Foco é saber o que não fazer para manter o que importa vivo."
  },
  {
    day: 28,
    title: "ORGANIZAÇÃO É LIBERDADE",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você acha que se organizar vai te prender, tirar sua criatividade e espontaneidade.",
    movie: "Você perde 20 minutos procurando um arquivo ou a chave do carro. Vive no improviso, apagando incêndio. Isso não é liberdade, é caos.",
    cost: ["A desordem te prende no atraso e no esquecimento.", "Organização não é rigidez, é a forma de ganhar tempo para criar."],
    insight: "\"Quando tudo está em seu lugar, você tem espaço para criar\". Organização te dá fôlego e paz mental.",
    insightSource: "A Arte de Fazer Acontecer (GTD), de David Allen.",
    exercises: [
      {
        title: "🔍 O Caos",
        inputs: [
          { label: "Qual espaço (físico ou digital) está te causando estresse por bagunça?", placeholder: "O que está caótico?", type: "input" }
        ]
      },
      {
        title: "🧹 A Ordem",
        description: "Tire 15 minutos para organizar isso agora. Devolva a leveza para esse espaço."
      },
      {
        title: "🕊️ A Liberdade",
        description: "Sinta como organização te liberta para pensar no que importa."
      }
    ],
    closing: "Quem vive sem plano vive ocupado. Quem vive com intenção vive livre."
  },
  {
    day: 29,
    title: "EM CIMA DO MURO CUSTA CARO",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você adia decisões difíceis por medo de errar. Fica empurrando com a barriga.",
    movie: "Você sabe que precisa decidir (terminar, começar, demitir, mudar), mas finge que não vê. O problema cresce e a vida decide por você (do jeito pior).",
    cost: ["Não escolher também é uma escolha — e geralmente é a mais cara.", "A omissão cobra juros de ansiedade e tempo perdido."],
    insight: "\"O que você não decide, alguém decide por você\". Foco é escolher com clareza, mesmo sem ter certeza absoluta.",
    insightSource: "Essencialismo, de Greg McKeown.",
    exercises: [
      {
        title: "🦁 O Medo",
        inputs: [
          { label: "Qual decisão você está adiando por medo?", placeholder: "Sua decisão adiada...", type: "input" }
        ]
      },
      {
        title: "💰 O Custo",
        inputs: [
          { label: "Quanto está te custando não decidir? (Energia, tempo, paz)", placeholder: "O preço da indecisão...", type: "textarea" }
        ]
      },
      {
        title: "🔨 O Martelo",
        description: "Tome uma pequena decisão sobre isso hoje. Saia da inércia."
      }
    ],
    closing: "A dúvida custa energia. A decisão entrega clareza."
  },
  {
    day: 30,
    title: "O FIM É SÓ O COMEÇO",
    week: 4,
    weekTitle: "Domínio",
    problem: "Você chegou ao fim, e o perigo agora é voltar para o modo automático. Achar que \"já aprendeu\" e parar de praticar.",
    movie: "Você termina o livro ou curso empolgado. Uma semana depois, a rotina engole tudo e você volta a ser quem era antes.",
    cost: ["Conhecimento sem prática vira obesidade mental.", "Você não precisa de mais teoria, precisa de execução contínua."],
    insight: "\"Saber o que fazer nunca foi o problema. O desafio é fazer todos os dias\". A transformação não está no livro, está no seu próximo movimento.",
    insightSource: "Hábitos Atômicos, de James Clear.",
    exercises: [
      {
        title: "🚀 O Próximo Passo",
        description: "Não busque mais um livro agora. Aplique o que aprendeu."
      },
      {
        title: "🔄 A Retomada",
        inputs: [
          { label: "Qual exercício desses 30 dias você precisa repetir amanhã?", placeholder: "Qual dia você vai revisitar?", type: "input" }
        ]
      },
      {
        title: "🌟 A Pergunta Final",
        inputs: [
          { label: "Se você aplicar isso de verdade, onde você vai estar daqui a 30 dias?", placeholder: "Sua visão do futuro...", type: "textarea" }
        ]
      }
    ],
    closing: "Você não precisa acertar tudo. Só precisa continuar. O essencial está te esperando. Agora vai."
  }
];
