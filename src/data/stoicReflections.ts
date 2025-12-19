// Stoic reflections for each day of the year
export interface StoicReflection {
  title: string;
  text: string;
  question: string;
}

// Map format: "MM-DD" -> reflection
export const stoicReflections: Record<string, StoicReflection> = {
  // Janeiro
  "01-01": {
    title: "Foque no que depende de você",
    text: "No estoicismo, Epicteto ensina que paz vem de direcionar energia apenas ao que está em nossas mãos: escolhas, esforço e postura. Tentar controlar tudo gera ansiedade e frustração. Quando você muda o foco do que não controla para o que controla, a mente se acalma e a ação fica mais clara.",
    question: "O que realmente depende de mim hoje?"
  },
  "01-02": {
    title: "Nem tudo é pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem conforme seus próprios limites e dificuldades, não para nos ferir. Levar tudo para o lado pessoal cria sofrimento desnecessário. Entender isso ajuda a lidar melhor com críticas, conflitos e rejeições.",
    question: "Estou levando algo para o lado pessoal sem precisar?"
  },
  "01-03": {
    title: "Progresso vale mais que perfeição",
    text: "Para Sêneca, esperar perfeição é uma forma elegante de adiar a ação. O progresso nasce de passos imperfeitos, mas constantes. Agir mesmo sem garantia traz aprendizado real.",
    question: "O que posso fazer hoje mesmo sem estar perfeito?"
  },
  "01-04": {
    title: "Disciplina vence motivação",
    text: "Marco Aurélio escrevia sobre agir corretamente mesmo sem vontade, pois a motivação varia. A disciplina cria estabilidade. Quem depende da motivação vive parando; quem cria hábitos segue avançando.",
    question: "Que ação preciso fazer hoje mesmo sem vontade?"
  },
  "01-05": {
    title: "Dificuldades fortalecem",
    text: "Sêneca dizia que a dificuldade é o treino do caráter. Sem desafios, não há crescimento. Cada problema traz uma chance de desenvolver força interior.",
    question: "O que este desafio está me ensinando?"
  },
  "01-06": {
    title: "Tempo é vida",
    text: "Para Sêneca, desperdiçar tempo é desperdiçar a própria vida. Estar ocupado não significa viver bem. Usar bem o tempo é uma escolha consciente.",
    question: "Onde estou desperdiçando meu tempo?"
  },
  "01-07": {
    title: "Reclamar não muda nada",
    text: "Marco Aurélio ensinava a aceitar os fatos e ajustar a atitude, em vez de reclamar. Reclamar só drena energia. Agir com lucidez traz mais resultados.",
    question: "O que posso ajustar em vez de reclamar?"
  },
  "01-08": {
    title: "Compare-se apenas consigo",
    text: "No estoicismo, Epicteto alertava que a comparação externa rouba a paz, pois cada pessoa vive realidades diferentes. O progresso verdadeiro é interno.",
    question: "Em que ponto evoluí em relação a mim mesmo?"
  },
  "01-09": {
    title: "O silêncio é força",
    text: "Epicteto valorizava o silêncio como sinal de autocontrole. Nem toda opinião precisa ser dita. Saber calar evita conflitos desnecessários.",
    question: "Preciso mesmo falar sobre isso agora?"
  },
  "01-10": {
    title: "Cansaço não é fracasso",
    text: "Sêneca reconhecia os limites do corpo e da mente. Cansaço é sinal, não falha. Descansar faz parte da disciplina.",
    question: "Preciso descansar ou me organizar melhor?"
  },
  "01-11": {
    title: "Seja firme, não rígido",
    text: "Marco Aurélio defendia firmeza com flexibilidade. Rigidez quebra, firmeza sustenta. Adaptar-se não é fraqueza.",
    question: "Onde posso ser mais flexível sem perder meus valores?"
  },
  "01-12": {
    title: "Poupe energia mental",
    text: "Para Epicteto, nem tudo merece nossa atenção. Pensar em excesso gera desgaste. Escolher onde focar é autocuidado.",
    question: "Isso merece minha energia mental?"
  },
  "01-13": {
    title: "Caráter aparece no silêncio",
    text: "Marco Aurélio refletia que agir corretamente sem plateia é virtude real. O caráter se mostra nas pequenas escolhas.",
    question: "Estou agindo corretamente mesmo quando ninguém vê?"
  },
  "01-14": {
    title: "Emoções não mandam em você",
    text: "Epicteto ensinava que sentir é natural, mas agir é escolha. Emoção não é comando. A razão pode guiar mesmo em momentos difíceis.",
    question: "Estou reagindo ou escolhendo como agir?"
  },
  "01-15": {
    title: "Planeje sem apego",
    text: "Sêneca aconselhava planejar, mas aceitar mudanças, pois a vida ajusta caminhos. Apego excessivo gera frustração.",
    question: "Estou preso demais a um plano?"
  },
  "01-16": {
    title: "Não adie o essencial",
    text: "Para Sêneca, viver bem exige agir no presente, não empurrar o importante para depois. O essencial pede prioridade.",
    question: "O que estou adiando que deveria fazer hoje?"
  },
  "01-17": {
    title: "O simples sustenta",
    text: "Marco Aurélio valorizava uma vida simples e alinhada ao essencial. O excesso confunde. Simplicidade traz clareza.",
    question: "O que posso simplificar hoje?"
  },
  "01-18": {
    title: "Use críticas como ajuste",
    text: "Epicteto ensinava a ouvir críticas sem se ferir, usando apenas o que ajuda. Nem toda crítica merece espaço.",
    question: "O que essa crítica pode me ensinar?"
  },
  "01-19": {
    title: "Não tente agradar todos",
    text: "Para Epicteto, buscar aprovação constante rouba a liberdade interior. Viver alinhado aos próprios valores traz paz.",
    question: "Estou sendo fiel aos meus valores?"
  },
  "01-20": {
    title: "A vida não promete conforto",
    text: "Sêneca lembrava que a vida oferece desafios, não garantias. Esperar conforto gera frustração. Aceitar isso fortalece a mente.",
    question: "Que oportunidade existe neste desafio?"
  },
  "01-21": {
    title: "Pequenos passos constroem",
    text: "Marco Aurélio acreditava na força da constância diária. Pequenos passos constroem grandes mudanças. O importante é continuar.",
    question: "Qual pequeno passo posso dar hoje?"
  },
  "01-22": {
    title: "Corte pensamentos inúteis",
    text: "Epicteto alertava que pensamentos não examinados dominam a mente. Nem tudo que surge merece atenção.",
    question: "Que pensamento posso soltar agora?"
  },
  "01-23": {
    title: "Gentileza é escolha consciente",
    text: "Marco Aurélio via a gentileza como expressão de força interior, não fraqueza. Ela começa dentro de você.",
    question: "Onde posso agir com mais gentileza hoje?"
  },
  "01-24": {
    title: "Seu valor não é o resultado",
    text: "Para Sêneca, o valor está no esforço correto, não apenas no resultado final. Resultados variam, caráter não.",
    question: "Dei meu melhor dentro do que estava ao meu alcance?"
  },
  "01-25": {
    title: "Crescer incomoda",
    text: "Sêneca dizia que evitar desconforto mantém a pessoa pequena. Crescer exige enfrentar. O desconforto ensina.",
    question: "Que desconforto vale a pena enfrentar?"
  },
  "01-26": {
    title: "Ação vale mais que discurso",
    text: "Epicteto defendia que a filosofia se mostra na prática, não no discurso. Agir constrói confiança.",
    question: "O que posso executar hoje?"
  },
  "01-27": {
    title: "Tudo leva tempo",
    text: "Marco Aurélio aceitava o ritmo natural das coisas. Pressa gera ansiedade. Paciência sustenta o processo.",
    question: "Estou respeitando meu ritmo?"
  },
  "01-28": {
    title: "Viva no presente",
    text: "Marco Aurélio escrevia que a vida acontece agora, não no passado ou no futuro. Estar presente traz clareza.",
    question: "Onde minha mente está neste momento?"
  },
  "01-29": {
    title: "Nem tudo é tragédia",
    text: "Epicteto alertava sobre exagerar problemas. Dar proporção correta traz calma. Nem tudo merece drama.",
    question: "Estou exagerando este problema?"
  },
  "01-30": {
    title: "Cuide da mente",
    text: "Para Sêneca, a mente molda a forma como vivemos. Pensamentos constantes criam hábitos. Cuidar da mente é cuidar da vida.",
    question: "Meus pensamentos estão me ajudando ou me sabotando?"
  },
  "01-31": {
    title: "Viva com intenção",
    text: "Marco Aurélio defendia viver com consciência, não no automático. Escolher como agir é liberdade interior.",
    question: "Como quero lembrar deste dia?"
  },
  // Fevereiro
  "02-01": {
    title: "Comece mesmo sem vontade",
    text: "No estoicismo, Epicteto ensina que não devemos esperar vontade para agir, pois a ação vem antes da motivação. Quem espera sentir vontade costuma ficar parado. Agir, mesmo sem ânimo, cria movimento e clareza.",
    question: "O que posso começar hoje mesmo sem vontade?"
  },
  "02-02": {
    title: "Nem tudo merece sua energia",
    text: "Marco Aurélio lembrava que nossa energia é limitada e deve ser bem direcionada. Gastá-la com discussões inúteis e problemas pequenos gera desgaste. Escolher batalhas é sinal de maturidade.",
    question: "Isso realmente merece minha energia?"
  },
  "02-03": {
    title: "Errar faz parte do caminho",
    text: "Para Sêneca, errar não é fracasso, é aprendizado. Quem age erra; quem não age, não aprende. O erro ensina quando você observa e ajusta.",
    question: "O que posso aprender com meu erro recente?"
  },
  "02-04": {
    title: "Controle o tom, não só as palavras",
    text: "Marco Aurélio valorizava a calma na comunicação, mesmo em situações difíceis. O tom fala tanto quanto as palavras. Falar com respeito evita conflitos desnecessários.",
    question: "Como estou me comunicando hoje?"
  },
  "02-05": {
    title: "Não julgue rápido",
    text: "No estoicismo, Marco Aurélio alertava que julgamos sem conhecer toda a história. Julgar rápido gera erro e injustiça. Observar mais amplia a compreensão.",
    question: "O que ainda não sei sobre essa situação?"
  },
  "02-06": {
    title: "Faça hoje, alivie amanhã",
    text: "Epicteto defendia a responsabilidade diária como forma de liberdade. Pequenas ações evitam grandes pesos depois. Adiar só acumula preocupação.",
    question: "O que posso resolver hoje?"
  },
  "02-07": {
    title: "O 'e se' cria medo",
    text: "Para Epicteto, o medo nasce de imaginar futuros que não existem. A mente sofre antes do fato. Focar no presente reduz ansiedade.",
    question: "Com o que estou me preocupando à toa?"
  },
  "02-08": {
    title: "Constância vence talento",
    text: "Sêneca ensinava que esforço contínuo supera habilidade sem disciplina. Talento sem constância se perde. O hábito constrói resultados reais.",
    question: "Que hábito preciso manter todos os dias?"
  },
  "02-09": {
    title: "Nem todos vão entender você",
    text: "Epicteto lembrava que buscar aprovação rouba a liberdade. Sempre haverá discordância. Ser coerente vale mais que ser aceito.",
    question: "Estou buscando aprovação demais?"
  },
  "02-10": {
    title: "Clareza antes da pressa",
    text: "Marco Aurélio priorizava clareza de ação, não velocidade. Correr sem direção cansa e confunde. Entender o que fazer vem antes de fazer rápido.",
    question: "Tenho clareza do que estou fazendo?"
  },
  "02-11": {
    title: "A pausa evita erros",
    text: "No estoicismo, agir impulsivamente é agir sem razão. A pausa permite escolher melhor. Respirar antes de responder evita arrependimentos.",
    question: "Preciso responder agora?"
  },
  "02-12": {
    title: "Pensamentos não são fatos",
    text: "Epicteto ensinava que pensamentos passam, mas nem todos são verdadeiros. Acreditar em tudo que pensa gera sofrimento. Observar a mente traz liberdade.",
    question: "Estou acreditando em pensamentos inúteis?"
  },
  "02-13": {
    title: "A crise revela caráter",
    text: "Para Sêneca, a dificuldade mostra quem realmente somos. É no aperto que valores aparecem. A crise revela força interior.",
    question: "Como estou agindo nas dificuldades?"
  },
  "02-14": {
    title: "Faça o bem sem troca",
    text: "Marco Aurélio defendia agir corretamente sem esperar retorno. Virtude não é negociação. Fazer o certo traz paz interior.",
    question: "Estou agindo certo mesmo sem retorno?"
  },
  "02-15": {
    title: "Não fuja de conversas difíceis",
    text: "No estoicismo, evitar o necessário gera mais dor no futuro. Conversas difíceis libertam. Coragem emocional resolve pendências.",
    question: "Que conversa estou evitando?"
  },
  "02-16": {
    title: "Simplifique decisões",
    text: "Epicteto buscava decisões simples e conscientes, pois complicar paralisa. Clareza reduz ansiedade.",
    question: "Posso decidir isso de forma mais simples?"
  },
  "02-17": {
    title: "Dizer 'não' protege você",
    text: "Sêneca ensinava que limites são sinal de sabedoria, não de egoísmo. Dizer 'não' preserva tempo e energia.",
    question: "Onde preciso dizer 'não'?"
  },
  "02-18": {
    title: "Saia do automático",
    text: "Marco Aurélio alertava sobre viver sem consciência. Agir no automático afasta do propósito. Viver com intenção transforma o dia.",
    question: "Onde estou agindo no automático?"
  },
  "02-19": {
    title: "Emoção não é comando",
    text: "Epicteto ensinava que sentir não obriga agir. Emoção informa, razão decide. Escolher a resposta é liberdade.",
    question: "Estou agindo por impulso?"
  },
  "02-20": {
    title: "Foque no que depende de você",
    text: "No centro do estoicismo, Epicteto reforçava essa ideia diariamente. Focar no controle interno traz paz. O resto deve ser aceito.",
    question: "O que está sob meu controle agora?"
  },
  "02-21": {
    title: "Resultados vêm da repetição",
    text: "Marco Aurélio confiava na prática diária, não em ações isoladas. Repetição constrói excelência.",
    question: "O que preciso repetir mais vezes?"
  },
  "02-22": {
    title: "Estar ocupado não é avançar",
    text: "Sêneca alertava que fazer muito não significa progredir. Intenção importa mais que volume. Avançar exige direção.",
    question: "Estou realmente progredindo?"
  },
  "02-23": {
    title: "Ajuste o caminho, não o propósito",
    text: "Sêneca defendia flexibilidade diante dos fatos, sem abandonar valores. O objetivo permanece, o caminho muda.",
    question: "O que posso ajustar hoje?"
  },
  "02-24": {
    title: "Pessoas difíceis também sofrem",
    text: "Marco Aurélio lembrava que todos carregam lutas internas. Isso não justifica, mas explica. Paciência evita desgaste.",
    question: "Posso reagir com mais calma?"
  },
  "02-25": {
    title: "Ação reduz medo",
    text: "Epicteto ensinava que enfrentar enfraquece o medo. Fugir o fortalece. Pequenos enfrentamentos constroem coragem.",
    question: "O que posso enfrentar hoje?"
  },
  "02-26": {
    title: "Pendências pesam na mente",
    text: "Para Sêneca, a mente sobrecarregada perde clareza. Pendências roubam energia. Resolver ou eliminar traz leveza.",
    question: "O que estou carregando sem necessidade?"
  },
  "02-27": {
    title: "Nem todo progresso é visível",
    text: "Marco Aurélio confiava no crescimento interno, mesmo sem aplausos. Algumas vitórias acontecem por dentro.",
    question: "Que avanço interno tive recentemente?"
  },
  "02-28": {
    title: "Viva com integridade",
    text: "Para Marco Aurélio, viver alinhado aos valores é a maior vitória. Integridade traz paz duradoura.",
    question: "Estou vivendo de acordo com meus valores?"
  },
  "02-29": {
    title: "Aproveite o dia extra",
    text: "Este dia especial nos lembra que o tempo é precioso. Use este dia bônus para refletir sobre suas conquistas e renovar seus compromissos.",
    question: "Como posso usar este dia extra de forma significativa?"
  },
  // Março
  "03-01": {
    title: "Aja mesmo com medo",
    text: "No estoicismo, Epicteto ensina que o medo nasce da imaginação, não dos fatos. Quando você espera o medo passar, acaba não agindo. Agir apesar do medo enfraquece o próprio medo.",
    question: "O que estou evitando por medo?"
  },
  "03-02": {
    title: "Não complique o simples",
    text: "Marco Aurélio alertava que a mente cria problemas maiores do que os fatos. Pensar demais confunde decisões simples. Simplicidade traz clareza e ação.",
    question: "O que pode ser resolvido de forma simples hoje?"
  },
  "03-03": {
    title: "Faça uma coisa de cada vez",
    text: "Para Sêneca, a dispersão rouba energia e foco. Fazer muitas coisas ao mesmo tempo gera cansaço e erros. Focar em uma tarefa traz avanço real.",
    question: "Em que tarefa devo focar agora?"
  },
  "03-04": {
    title: "Não viva para agradar",
    text: "Epicteto lembrava que buscar aprovação externa tira a liberdade interior. Você se perde tentando agradar todos. Viver alinhado aos próprios valores traz paz.",
    question: "Estou sendo fiel ao que acredito?"
  },
  "03-05": {
    title: "Ação ensina mais que pensamento",
    text: "Sêneca dizia que pensar sem agir não transforma nada. O aprendizado real nasce da prática. Ação gera experiência e clareza.",
    question: "Qual pequeno passo posso dar hoje?"
  },
  "03-06": {
    title: "Nem tudo precisa ser resolvido hoje",
    text: "Marco Aurélio aceitava que algumas coisas amadurecem com o tempo. Forçar soluções gera frustração. Saber esperar também é sabedoria.",
    question: "O que posso deixar amadurecer?"
  },
  "03-07": {
    title: "Pause antes de reagir",
    text: "No estoicismo, a pausa é vista como espaço para a razão agir. Reagir no impulso gera arrependimento. Respirar antes de responder protege você.",
    question: "Preciso reagir agora ou posso esperar?"
  },
  "03-08": {
    title: "Não espere condições perfeitas",
    text: "Sêneca alertava que esperar o ideal é perder tempo de vida. A ação começa com o que se tem. O progresso nasce da imperfeição.",
    question: "O que posso começar mesmo imperfeito?"
  },
  "03-09": {
    title: "Seja firme com hábitos, leve com erros",
    text: "Marco Aurélio defendia disciplina sem dureza consigo mesmo. Errar faz parte do processo. Constância com gentileza sustenta o caminho.",
    question: "Qual hábito preciso reforçar?"
  },
  "03-10": {
    title: "Você fortalece o que pratica",
    text: "Para Epicteto, a repetição molda caráter e mente. Pensamentos repetidos viram padrão. Escolha bem o que pratica.",
    question: "Que tipo de pensamento tenho repetido?"
  },
  "03-11": {
    title: "Proteja sua energia",
    text: "Marco Aurélio lembrava que energia é limitada. Nem toda discussão vale o esforço. Escolher onde gastar energia é sabedoria.",
    question: "Onde estou gastando energia à toa?"
  },
  "03-12": {
    title: "Responsabilidade liberta",
    text: "Epicteto ensinava que assumir responsabilidade traz controle interno. Culpa paralisa, responsabilidade move. Assumir liberta.",
    question: "O que posso assumir sem culpa?"
  },
  "03-13": {
    title: "Menos consumo, mais presença",
    text: "Marco Aurélio valorizava a presença consciente. O excesso distrai do essencial. Estar presente traz clareza.",
    question: "O que está roubando minha atenção?"
  },
  "03-14": {
    title: "O agora é suficiente",
    text: "Para Marco Aurélio, a vida acontece apenas no presente. Ansiedade vive no futuro. O agora pede atenção.",
    question: "Onde estou agora, de verdade?"
  },
  "03-15": {
    title: "Felicidade não é terceirizada",
    text: "Epicteto ensinava que a felicidade nasce da postura interna, não de fatores externos. Esperar do mundo gera frustração.",
    question: "O que depende só de mim hoje?"
  },
  "03-16": {
    title: "Ajuste expectativas",
    text: "Sêneca alertava que expectativas irreais geram sofrimento. Ajustar expectativas traz paz. Nem tudo sai como planejado.",
    question: "O que posso aceitar sem lutar?"
  },
  "03-17": {
    title: "Caráter aparece no silêncio",
    text: "Marco Aurélio refletia sobre agir bem sem reconhecimento. O caráter não precisa plateia. Coerência constrói dignidade.",
    question: "Estou sendo coerente comigo?"
  },
  "03-18": {
    title: "Faça o necessário",
    text: "Para Epicteto, evitar o necessário cria problemas maiores. A disciplina enfrenta o desconforto. Fazer o necessário liberta.",
    question: "O que estou evitando fazer?"
  },
  "03-19": {
    title: "Cansaço pede pausa, não desistência",
    text: "Sêneca reconhecia o valor do descanso consciente. Parar um pouco evita parar de vez. Ouça o corpo.",
    question: "Preciso descansar ou desistir?"
  },
  "03-20": {
    title: "Todo dia ensina",
    text: "Marco Aurélio via cada dia como oportunidade de aprendizado. Até os dias difíceis ensinam. Nada é desperdiçado quando há reflexão.",
    question: "O que aprendi hoje?"
  },
  "03-21": {
    title: "Simplicidade traz leveza",
    text: "Marco Aurélio valorizava o simples e o essencial. Menos peso, mais clareza. Simplicidade organiza a mente.",
    question: "O que posso simplificar?"
  },
  "03-22": {
    title: "Não leve tudo tão a sério",
    text: "Sêneca alertava contra o excesso de rigidez consigo mesmo. Leveza também é sabedoria. Nem tudo precisa ser tão pesado.",
    question: "Onde posso aliviar?"
  },
  "03-23": {
    title: "Imperfeito ainda é avanço",
    text: "Para Sêneca, esperar perfeição trava o progresso. Avançar imperfeito ainda é avanço. O movimento ensina.",
    question: "O que já está bom o suficiente?"
  },
  "03-24": {
    title: "Persistência vence resistência",
    text: "Marco Aurélio confiava na força da constância. Resistência cede com persistência. Continue.",
    question: "Onde preciso insistir mais um pouco?"
  },
  "03-25": {
    title: "Forçar gera frustração",
    text: "Sêneca alertava sobre lutar contra o tempo natural das coisas. Forçar cansa e frustra. Respeitar o ritmo traz equilíbrio.",
    question: "Estou forçando algo?"
  },
  "03-26": {
    title: "Nem toda vitória é visível",
    text: "Marco Aurélio reconhecia o crescimento interno silencioso. Nem tudo aparece. Algumas vitórias acontecem por dentro.",
    question: "Que progresso só eu percebo?"
  },
  "03-27": {
    title: "Execute mais, fale menos",
    text: "Epicteto defendia que a filosofia se prova na ação. Falar não constrói resultados. A prática revela quem você é.",
    question: "O que posso executar hoje?"
  },
  "03-28": {
    title: "Seja paciente com seu processo",
    text: "Marco Aurélio aceitava o próprio ritmo de evolução. Comparar atrapalha. Você está em construção.",
    question: "Estou sendo justo comigo?"
  },
  "03-29": {
    title: "O desconforto ensina",
    text: "Sêneca dizia que evitar desconforto impede o crescimento. O desconforto mostra onde evoluir. Aprender dói, mas fortalece.",
    question: "O que o desconforto está me ensinando?"
  },
  "03-30": {
    title: "O essencial é pequeno",
    text: "Marco Aurélio lembrava que o essencial quase sempre é simples. O excesso distrai. O pequeno sustenta.",
    question: "O que realmente importa hoje?"
  },
  "03-31": {
    title: "Termine melhor do que começou",
    text: "Marco Aurélio defendia o progresso diário, não a perfeição. Evoluir um pouco já é vitória.",
    question: "Em que evoluí neste mês?"
  },
  // Abril
  "04-01": {
    title: "Não acorde no automático",
    text: "No estoicismo, Marco Aurélio alertava sobre viver sem consciência, apenas reagindo aos acontecimentos. Viver no automático nos afasta do que realmente importa. Começar o dia com intenção muda toda a condução dele.",
    question: "Como quero conduzir este dia?"
  },
  "04-02": {
    title: "O que você pensa molda o dia",
    text: "Para Epicteto, não são os fatos que nos perturbam, mas a forma como pensamos sobre eles. Pensamentos moldam emoções e ações. Cuidar do pensamento é cuidar da vida.",
    question: "Que pensamento preciso ajustar hoje?"
  },
  "04-03": {
    title: "Não discuta para vencer",
    text: "Marco Aurélio ensinava que vencer uma discussão não significa estar certo. Discutir para vencer cria distância. Buscar entender aproxima e ensina.",
    question: "Quero vencer ou compreender?"
  },
  "04-04": {
    title: "Pausa também é ação",
    text: "Sêneca reconhecia o valor da pausa consciente. Parar no momento certo evita decisões ruins. Descansar é parte da disciplina.",
    question: "Preciso pausar ou insistir?"
  },
  "04-05": {
    title: "O excesso cansa",
    text: "Marco Aurélio valorizava o essencial e alertava contra o excesso. Excesso de tarefas, informações e preocupações esgota. Simplificar traz leveza.",
    question: "O que posso simplificar hoje?"
  },
  "04-06": {
    title: "Críticas não definem você",
    text: "No estoicismo, Epicteto ensinava a não se ferir com opiniões externas. Nem toda crítica merece espaço. Use o que ajuda e descarte o resto.",
    question: "O que posso aprender com essa crítica?"
  },
  "04-07": {
    title: "Seja confiável",
    text: "Marco Aurélio valorizava a coerência entre fala e ação. Fazer o que promete constrói caráter. Confiabilidade gera respeito.",
    question: "Estou cumprindo o que prometi?"
  },
  "04-08": {
    title: "Nem tudo é urgente",
    text: "Sêneca alertava que tratar tudo como urgente esgota. Diferenciar urgência de importância preserva energia. O essencial vem primeiro.",
    question: "O que pode esperar?"
  },
  "04-09": {
    title: "O passado não manda mais",
    text: "Marco Aurélio lembrava que o passado já cumpriu seu papel. Revivê-lo só prende a mente. Aprenda e siga.",
    question: "O que já posso soltar?"
  },
  "04-10": {
    title: "Respeite seus limites",
    text: "Sêneca reconhecia que ignorar limites cobra um preço alto. Forçar além do necessário gera desgaste. Limite também é sabedoria.",
    question: "Que limite estou ignorando?"
  },
  "04-11": {
    title: "Não acumule ressentimento",
    text: "Para Marco Aurélio, guardar ressentimento machuca mais quem guarda. Soltar liberta. Ressentimento pesa na alma.",
    question: "O que preciso soltar hoje?"
  },
  "04-12": {
    title: "Seja claro",
    text: "Epicteto defendia a clareza como forma de respeito. Comunicação confusa gera conflito. Ser claro evita problemas.",
    question: "Estou sendo claro ao me comunicar?"
  },
  "04-13": {
    title: "O que você repete vira hábito",
    text: "Marco Aurélio acreditava na força da repetição diária. Pequenas ações repetidas moldam a vida. Escolha bem o que repete.",
    question: "Que hábito estou reforçando?"
  },
  "04-14": {
    title: "Não busque atalhos",
    text: "Para Sêneca, atalhos cobram juros altos depois. O caminho correto pode ser mais lento, mas é seguro. Pular etapas gera problemas.",
    question: "Estou tentando pular alguma etapa?"
  },
  "04-15": {
    title: "Você não precisa provar nada",
    text: "Epicteto ensinava que a validação externa não define valor. Tentar provar algo cansa. Viver bem já é suficiente.",
    question: "Estou tentando impressionar alguém?"
  },
  "04-16": {
    title: "Ajuste o foco",
    text: "Marco Aurélio alertava que a distração rouba energia. Foco traz avanço real. Escolher foco é escolher progresso.",
    question: "Onde devo colocar meu foco agora?"
  },
  "04-17": {
    title: "Decida com calma",
    text: "Para Sêneca, decisões apressadas geram arrependimento. A calma permite ver melhor. Pressa é inimiga da razão.",
    question: "Posso decidir isso com mais calma?"
  },
  "04-18": {
    title: "A vida testa constância",
    text: "Marco Aurélio confiava na prática diária, não em ações isoladas. Constância constrói caráter. Continue mesmo quando parecer pouco.",
    question: "Estou sendo constante?"
  },
  "04-19": {
    title: "Não viva só reagindo",
    text: "Epicteto alertava sobre viver no modo reação. Reagir o tempo todo tira o controle. Conduzir o dia traz liberdade.",
    question: "Estou conduzindo ou apenas reagindo?"
  },
  "04-20": {
    title: "Observe mais, opine menos",
    text: "Marco Aurélio valorizava a observação silenciosa. Opinar em tudo cansa e pouco acrescenta. Observar ensina mais.",
    question: "Preciso mesmo opinar?"
  },
  "04-21": {
    title: "Seja útil onde estiver",
    text: "Para Marco Aurélio, ser útil já é propósito suficiente. Não é preciso grande palco. Contribuir dá sentido.",
    question: "Como posso ser útil hoje?"
  },
  "04-22": {
    title: "Não espere reconhecimento",
    text: "Sêneca ensinava que agir corretamente não depende de aplausos. Virtude não é troca. Faça o certo.",
    question: "Estou agindo por valores ou por reconhecimento?"
  },
  "04-23": {
    title: "Aceite pessoas como são",
    text: "Epicteto lembrava que tentar mudar os outros gera frustração. Aceitar não é concordar. Ou aceite, ou siga.",
    question: "O que preciso aceitar ou me afastar?"
  },
  "04-24": {
    title: "Sua atitude define o dia",
    text: "Marco Aurélio ensinava que a atitude vem antes do acontecimento. O dia segue sua postura. Escolha sua atitude.",
    question: "Que atitude escolho hoje?"
  },
  "04-25": {
    title: "Persistência é força silenciosa",
    text: "Para Marco Aurélio, a persistência vence a resistência. O progresso gosta de constância. Continue.",
    question: "Onde preciso persistir?"
  },
  "04-26": {
    title: "Não transforme tudo em problema",
    text: "Epicteto alertava contra exagerar dificuldades. Dar proporção correta traz calma. Nem tudo é problema.",
    question: "Estou exagerando algo?"
  },
  "04-27": {
    title: "O simples resolve muito",
    text: "Marco Aurélio valorizava soluções simples. Complicar trava. O simples sustenta.",
    question: "O que realmente importa hoje?"
  },
  "04-28": {
    title: "Gratidão traz equilíbrio",
    text: "Para Sêneca, reconhecer o que já se tem traz estabilidade emocional. Gratidão ajusta o olhar. Ela acalma a mente.",
    question: "Pelo que posso ser grato hoje?"
  },
  "04-29": {
    title: "Não negocie seus valores",
    text: "Epicteto defendia viver alinhado aos próprios valores. Negociar valores custa caro. Valores guiam decisões.",
    question: "Estou sendo fiel aos meus valores?"
  },
  "04-30": {
    title: "Viva com intenção",
    text: "Marco Aurélio defendia viver de forma consciente, não no automático. Encerrar o mês com intenção definida para o próximo mês traz clareza.",
    question: "Como quero que seja o próximo mês?"
  },
  // Maio
  "05-01": {
    title: "Comece pequeno",
    text: "No estoicismo, Marco Aurélio acreditava que grandes mudanças nascem de pequenas ações diárias. Esperar grandes movimentos gera paralisia. O pequeno, feito todos os dias, constrói resultados sólidos.",
    question: "Qual pequeno passo posso dar hoje?"
  },
  "05-02": {
    title: "Não lute contra o inevitável",
    text: "Para Epicteto, sofrer tentando mudar o que não depende de nós é desperdício de energia. Aceitar os fatos não é desistir. Aceitação libera força para agir onde é possível.",
    question: "O que preciso aceitar hoje?"
  },
  "05-03": {
    title: "Seja pontual com você",
    text: "Sêneca valorizava o respeito ao próprio tempo e limites. Atrasar-se consigo mesmo gera desgaste. Autocuidado é compromisso, não luxo.",
    question: "Estou respeitando meus próprios limites?"
  },
  "05-04": {
    title: "Culpa não resolve",
    text: "No estoicismo, Epicteto ensinava que a culpa paralisa, enquanto a responsabilidade liberta. Aprender com o erro é mais útil do que se punir.",
    question: "O que posso aprender com isso?"
  },
  "05-05": {
    title: "Faça menos, melhor",
    text: "Marco Aurélio alertava que fazer demais dispersa a mente. Qualidade vale mais que quantidade. Focar melhora o resultado e a paz.",
    question: "O que merece minha atenção hoje?"
  },
  "05-06": {
    title: "Nem tudo precisa de resposta",
    text: "Para Epicteto, o silêncio consciente é sinal de domínio interior. Responder tudo cansa. Escolher quando falar preserva energia.",
    question: "Preciso responder agora?"
  },
  "05-07": {
    title: "Retidão vale mais que conforto",
    text: "Sêneca ensinava que escolher o certo nem sempre é confortável, mas sempre fortalece o caráter. Conforto passa, integridade fica.",
    question: "Estou escolhendo o que é certo?"
  },
  "05-08": {
    title: "Calma é força",
    text: "Marco Aurélio via a calma como sinal de maturidade, não fraqueza. Responder com calma evita erros.",
    question: "Estou agindo com calma?"
  },
  "05-09": {
    title: "Responsabilidade liberta",
    text: "Para Epicteto, assumir responsabilidade traz controle interno. Culpar tira poder. Responsabilidade devolve direção.",
    question: "O que depende de mim hoje?"
  },
  "05-10": {
    title: "Coerência gera paz",
    text: "Marco Aurélio defendia alinhar discurso e prática. Dizer uma coisa e fazer outra cria conflito interno. Coerência acalma a mente.",
    question: "Estou sendo coerente comigo?"
  },
  "05-11": {
    title: "Comparação confunde",
    text: "Epicteto alertava que comparar-se com outros rouba a tranquilidade. Caminhos são diferentes. O progresso é interno.",
    question: "Com quem estou me comparando?"
  },
  "05-12": {
    title: "Pausa evita desgaste",
    text: "Sêneca reconhecia que o corpo pede descanso. Ignorar sinais cobra preço. Pausar é estratégia, não fraqueza.",
    question: "Preciso descansar?"
  },
  "05-13": {
    title: "O essencial é simples",
    text: "Marco Aurélio valorizava o simples e o suficiente. Excesso distrai do que importa. O simples sustenta a vida.",
    question: "O que posso simplificar hoje?"
  },
  "05-14": {
    title: "Não tente controlar tudo",
    text: "Para Epicteto, tentar controlar tudo gera ansiedade. Controle interno basta. Soltar o resto traz leveza.",
    question: "O que estou tentando controlar demais?"
  },
  "05-15": {
    title: "A vida responde à constância",
    text: "Marco Aurélio confiava na prática diária, não em esforços esporádicos. Constância constrói confiança.",
    question: "Onde preciso ser mais constante?"
  },
  "05-16": {
    title: "Honestidade começa dentro",
    text: "Sêneca ensinava que enganar a si mesmo é o maior erro. A verdade interna guia escolhas melhores. Seja sincero consigo.",
    question: "Estou sendo honesto comigo?"
  },
  "05-17": {
    title: "Pensamentos crescem se alimentados",
    text: "Para Epicteto, pensamentos não vigiados dominam a mente. Alimentar pensamentos ruins os fortalece. Escolha o que alimentar.",
    question: "Que pensamento devo cortar hoje?"
  },
  "05-18": {
    title: "Decida com consciência",
    text: "Marco Aurélio alertava contra agir por impulso. Consciência traz decisões melhores. Pensar antes de agir evita arrependimentos.",
    question: "Estou agindo por impulso?"
  },
  "05-19": {
    title: "Diferenças ensinam",
    text: "Sêneca via o diálogo com o diferente como aprendizado. Ouvir amplia visão. Respeitar opiniões diferentes amadurece.",
    question: "O que posso aprender com alguém diferente?"
  },
  "05-20": {
    title: "Gentileza e firmeza caminham juntas",
    text: "Marco Aurélio defendia firmeza sem agressividade. Gentileza não é fraqueza. Equilíbrio constrói respeito.",
    question: "Estou sendo firme e respeitoso?"
  },
  "05-21": {
    title: "Nem todo dia rende",
    text: "Para Sêneca, alguns dias pedem aceitação, não cobrança. Nem todo dia será produtivo. Aceitar evita frustração.",
    question: "Estou me cobrando demais?"
  },
  "05-22": {
    title: "Esforço não é sofrimento",
    text: "Epicteto ensinava que esforço consciente fortalece, enquanto sofrimento nasce da resistência mental. Ajustar o ritmo muda tudo.",
    question: "Estou me esforçando ou sofrendo?"
  },
  "05-23": {
    title: "Cuide do que controla",
    text: "No centro do estoicismo, Epicteto reforçava essa ideia diariamente. Focar no controle interno traz paz.",
    question: "O que está sob meu controle agora?"
  },
  "05-24": {
    title: "Resolva pendências",
    text: "Sêneca alertava que pendências roubam energia mental. Resolver libera espaço. Pendência pesa.",
    question: "O que preciso resolver hoje?"
  },
  "05-25": {
    title: "Aja com propósito",
    text: "Marco Aurélio defendia agir com intenção, não apenas reagir. Propósito orienta escolhas.",
    question: "Qual é minha intenção hoje?"
  },
  "05-26": {
    title: "Constância vence pressa",
    text: "Para Marco Aurélio, a pressa cria ansiedade, enquanto a constância constrói. Continue no ritmo certo.",
    question: "Estou sendo constante?"
  },
  "05-27": {
    title: "O tempo revela",
    text: "Sêneca confiava que o tempo esclarece o que a pressa confunde. Confie no processo.",
    question: "Posso confiar mais no processo?"
  },
  "05-28": {
    title: "Viva com simplicidade",
    text: "Marco Aurélio valorizava uma vida simples e alinhada. O excesso pesa. Simplicidade liberta.",
    question: "O que posso retirar da minha vida?"
  },
  "05-29": {
    title: "Faça o bem sem expectativa",
    text: "Para Marco Aurélio, agir corretamente não depende de retorno. Virtude basta.",
    question: "Estou esperando retorno?"
  },
  "05-30": {
    title: "Progresso é vitória",
    text: "Marco Aurélio defendia melhorar um pouco a cada dia. Pequenos avanços contam. Evoluir já é vencer.",
    question: "Em que evoluí este mês?"
  },
  "05-31": {
    title: "Paz vem da integridade",
    text: "Para Marco Aurélio, viver alinhado aos próprios valores gera paz duradoura. Integridade é liberdade interior.",
    question: "Estou vivendo de acordo com meus valores?"
  },
  // Junho
  "06-01": {
    title: "Comece o dia com intenção",
    text: "No estoicismo, Marco Aurélio defendia iniciar o dia lembrando como agir, antes que os acontecimentos tomem o controle. Quando você começa sem intenção, passa o dia reagindo. Escolher como agir logo cedo muda o restante do dia.",
    question: "Como quero me comportar hoje?"
  },
  "06-02": {
    title: "Nem tudo depende de você",
    text: "Para Epicteto, entender o que está sob nosso controle é o início da paz. Insistir no que não depende de você gera desgaste. Soltar o que não controla libera energia.",
    question: "O que preciso soltar hoje?"
  },
  "06-03": {
    title: "A pressa cria erros",
    text: "Sêneca alertava que agir rápido demais rouba clareza. Pressa confunde decisões simples. Calma melhora resultados.",
    question: "Onde posso agir com mais calma?"
  },
  "06-04": {
    title: "Não alimente irritação",
    text: "Marco Aurélio lembrava que a irritação começa dentro de nós, não no outro. Alimentá-la só piora. Escolher não alimentar é escolher paz.",
    question: "O que estou deixando me irritar sem necessidade?"
  },
  "06-05": {
    title: "Faça o que precisa ser feito",
    text: "Para Epicteto, evitar o necessário cria problemas maiores depois. A disciplina enfrenta o desconforto. Fazer o necessário traz alívio.",
    question: "O que estou evitando fazer?"
  },
  "06-06": {
    title: "A simplicidade organiza a mente",
    text: "Marco Aurélio valorizava uma vida simples e ordenada. O excesso bagunça a mente. Organizar simplifica.",
    question: "O que posso simplificar hoje?"
  },
  "06-07": {
    title: "Aceite pessoas imperfeitas",
    text: "No estoicismo, Marco Aurélio lembrava que todos erram, inclusive nós. Exigir perfeição gera frustração. Aceitar não é concordar, é compreender limites.",
    question: "Onde preciso exercitar mais aceitação?"
  },
  "06-08": {
    title: "Não discuta com o inevitável",
    text: "Para Epicteto, lutar contra os fatos é lutar contra a realidade. Aceitar não é desistir. Aceitar traz clareza para agir.",
    question: "O que estou resistindo sem necessidade?"
  },
  "06-09": {
    title: "Cansaço pede ajuste",
    text: "Sêneca reconhecia que o corpo fala antes da mente quebrar. Ignorar sinais cobra preço. Ajustar ritmo é sabedoria.",
    question: "O que preciso ajustar no meu ritmo?"
  },
  "06-10": {
    title: "Nem tudo precisa ser dito",
    text: "Epicteto valorizava o silêncio como forma de autocontrole. Falar demais gera conflitos. Escolher o silêncio preserva energia.",
    question: "Preciso mesmo falar sobre isso?"
  },
  "06-11": {
    title: "Valorize o progresso invisível",
    text: "Marco Aurélio confiava no crescimento interno, mesmo quando não há reconhecimento externo. Nem toda evolução aparece.",
    question: "Que progresso interno tive recentemente?"
  },
  "06-12": {
    title: "O passado já ensinou",
    text: "Para Marco Aurélio, revisitar o passado além do necessário prende a mente. Aprenda e siga. O presente pede atenção.",
    question: "O que já posso deixar no passado?"
  },
  "06-13": {
    title: "Faça menos, melhor",
    text: "Sêneca alertava que excesso de tarefas rouba qualidade. Focar melhora resultados. Menos pode ser mais.",
    question: "O que merece minha total atenção?"
  },
  "06-14": {
    title: "Não dependa da aprovação",
    text: "Epicteto ensinava que buscar aprovação externa tira liberdade. Sempre haverá quem discorde. Ser coerente vale mais.",
    question: "Estou buscando aprovação demais?"
  },
  "06-15": {
    title: "Disciplina protege",
    text: "Marco Aurélio via a disciplina como forma de cuidado consigo mesmo. Ela cria estabilidade. Disciplina não é rigidez.",
    question: "Que disciplina preciso reforçar?"
  },
  "06-16": {
    title: "Observe antes de reagir",
    text: "Para Epicteto, a observação cria espaço para a razão. Reagir no impulso gera arrependimento. A pausa protege.",
    question: "Estou reagindo ou observando?"
  },
  "06-17": {
    title: "Nem todo problema é grande",
    text: "Epicteto alertava que exagerar problemas aumenta o sofrimento. Proporção traz calma. Nem tudo merece peso.",
    question: "Estou exagerando este problema?"
  },
  "06-18": {
    title: "Faça o bem sem esperar retorno",
    text: "Marco Aurélio defendia agir corretamente por princípio, não por recompensa. Virtude basta.",
    question: "Estou esperando reconhecimento?"
  },
  "06-19": {
    title: "Ajuste expectativas",
    text: "Para Sêneca, expectativas irreais geram frustração. Ajustar evita sofrimento. Nem tudo sai como planejado.",
    question: "Que expectativa preciso ajustar?"
  },
  "06-20": {
    title: "Foque no essencial",
    text: "Marco Aurélio valorizava o que realmente importa, não o supérfluo. O essencial sustenta.",
    question: "O que é essencial hoje?"
  },
  "06-21": {
    title: "Constância constrói",
    text: "Para Marco Aurélio, pequenas ações repetidas constroem grandes resultados. Continue.",
    question: "Onde preciso ser mais constante?"
  },
  "06-22": {
    title: "Não leve tudo para o lado pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem a partir de suas próprias dores. Nem tudo é sobre você.",
    question: "Estou levando algo para o lado pessoal?"
  },
  "06-23": {
    title: "Organize para aliviar",
    text: "Sêneca ensinava que desordem externa gera confusão interna. Organizar traz leveza mental.",
    question: "O que posso organizar hoje?"
  },
  "06-24": {
    title: "Coragem é constância",
    text: "Para Sêneca, coragem não é explosão, é permanência. Continuar exige mais coragem que começar.",
    question: "Onde preciso continuar, não desistir?"
  },
  "06-25": {
    title: "Não alimente pensamentos inúteis",
    text: "Epicteto alertava que pensamentos não examinados dominam a mente. Escolher pensamentos é escolher paz.",
    question: "Que pensamento posso soltar agora?"
  },
  "06-26": {
    title: "Seja paciente com seu processo",
    text: "Marco Aurélio aceitava o próprio ritmo de evolução. Comparar atrasa. Você está em construção.",
    question: "Estou sendo paciente comigo?"
  },
  "06-27": {
    title: "A vida testa coerência",
    text: "Para Marco Aurélio, viver bem é viver coerente, mesmo quando é difícil. Coerência sustenta caráter.",
    question: "Estou sendo coerente nas escolhas?"
  },
  "06-28": {
    title: "Nem tudo precisa ser resolvido agora",
    text: "Sêneca reconhecia o valor do tempo. Algumas coisas se ajustam sozinhas. Forçar cansa.",
    question: "O que posso deixar amadurecer?"
  },
  "06-29": {
    title: "O desconforto ensina",
    text: "Para Sêneca, evitar desconforto impede crescimento. O desconforto mostra onde evoluir.",
    question: "O que o desconforto está me ensinando?"
  },
  "06-30": {
    title: "Termine melhor do que começou",
    text: "Marco Aurélio defendia o progresso diário, não a perfeição. Evoluir já é vitória.",
    question: "Em que evoluí neste mês?"
  },
  // Julho
  "07-01": {
    title: "Comece com clareza",
    text: "No estoicismo, Marco Aurélio defendia iniciar o dia com a mente clara, lembrando a si mesmo como agir diante das pessoas e dos problemas. Quando a clareza vem antes da ação, o dia flui melhor. Clareza evita decisões impulsivas.",
    question: "O que preciso deixar claro hoje?"
  },
  "07-02": {
    title: "Não confunda controle com preocupação",
    text: "Para Epicteto, preocupar-se não é o mesmo que controlar. Preocupação não resolve, só cansa. Controle está na atitude, não no resultado.",
    question: "Com o que estou me preocupando sem controle real?"
  },
  "07-03": {
    title: "Faça o básico bem feito",
    text: "Marco Aurélio valorizava a excelência no simples. Fazer o básico com atenção sustenta qualquer avanço. O simples bem feito cria estabilidade.",
    question: "O que é básico e precisa ser bem feito hoje?"
  },
  "07-04": {
    title: "Não reaja no impulso",
    text: "No estoicismo, Epicteto ensinava que o impulso é um convite, não uma ordem. Reagir rápido costuma gerar arrependimento. A pausa devolve o controle.",
    question: "Preciso reagir agora ou posso esperar?"
  },
  "07-05": {
    title: "Disciplina é cuidado",
    text: "Marco Aurélio via a disciplina como uma forma de cuidado consigo mesmo, não como punição. A disciplina protege você de si mesmo.",
    question: "Que disciplina estou evitando reforçar?"
  },
  "07-06": {
    title: "Aceite limites",
    text: "Sêneca reconhecia que todos têm limites. Ignorá-los gera esgotamento. Respeitar limites é sabedoria.",
    question: "Que limite preciso aceitar?"
  },
  "07-07": {
    title: "Não viva de expectativas",
    text: "Sêneca alertava que expectativas irreais criam frustração. Quanto maior a expectativa, maior a queda. Expectativa ajustada traz paz.",
    question: "Que expectativa preciso ajustar?"
  },
  "07-08": {
    title: "Nem toda opinião importa",
    text: "No estoicismo, Epicteto ensinava que dar peso a toda opinião rouba liberdade. Ouvir tudo não significa aceitar tudo.",
    question: "Que opinião posso deixar passar?"
  },
  "07-09": {
    title: "Construa constância",
    text: "Marco Aurélio confiava mais na repetição diária do que em grandes esforços isolados. Constância constrói caráter.",
    question: "Onde preciso ser mais constante?"
  },
  "07-10": {
    title: "Não se cobre perfeição",
    text: "Para Sêneca, a cobrança excessiva gera sofrimento desnecessário. Progresso vale mais. Crescer é ajustar, não se punir.",
    question: "Onde estou me cobrando demais?"
  },
  "07-11": {
    title: "Observe seus pensamentos",
    text: "Epicteto alertava que pensamentos não observados dominam ações. Observar a mente traz escolha.",
    question: "Que pensamento preciso observar melhor?"
  },
  "07-12": {
    title: "Escolha suas batalhas",
    text: "Marco Aurélio lembrava que energia é limitada. Nem toda luta vale o desgaste. Escolher batalhas preserva forças.",
    question: "Essa batalha vale minha energia?"
  },
  "07-13": {
    title: "Não confunda ocupação com progresso",
    text: "Para Sêneca, estar ocupado não é sinônimo de avançar. Intenção importa mais que movimento. Avançar exige direção.",
    question: "Estou realmente avançando?"
  },
  "07-14": {
    title: "Seja simples nas decisões",
    text: "Epicteto defendia decisões claras e simples, pois complicar paralisa. Simplicidade acelera.",
    question: "Posso decidir isso de forma mais simples?"
  },
  "07-15": {
    title: "Gentileza é força",
    text: "Marco Aurélio via a gentileza como expressão de força interior, não fraqueza. Ser gentil exige domínio próprio.",
    question: "Onde posso agir com mais gentileza?"
  },
  "07-16": {
    title: "Não adie o necessário",
    text: "Para Sêneca, adiar o essencial é adiar a vida. O necessário pede ação agora.",
    question: "O que estou adiando sem necessidade?"
  },
  "07-17": {
    title: "Faça o que é certo, não o que é fácil",
    text: "Marco Aurélio defendia escolher o correto, mesmo quando difícil. O fácil nem sempre é o melhor caminho.",
    question: "Estou escolhendo o certo ou o fácil?"
  },
  "07-18": {
    title: "Cansaço pede pausa",
    text: "Sêneca reconhecia o valor do descanso consciente. Pausar evita quebrar. Descansar também é disciplina.",
    question: "Preciso descansar ou reorganizar?"
  },
  "07-19": {
    title: "Não leve tudo para o lado pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem conforme seus próprios conflitos. Nem tudo é sobre você.",
    question: "Estou levando algo para o lado pessoal?"
  },
  "07-20": {
    title: "Controle interno basta",
    text: "No centro do estoicismo, Epicteto reforçava que o controle interno é suficiente para a paz. O resto deve ser aceito.",
    question: "O que está sob meu controle agora?"
  },
  "07-21": {
    title: "Pequenos passos contam",
    text: "Marco Aurélio confiava na força do progresso diário. Pequenos passos sustentam grandes mudanças.",
    question: "Qual pequeno passo posso dar hoje?"
  },
  "07-22": {
    title: "Não alimente ressentimento",
    text: "Para Marco Aurélio, ressentimento machuca mais quem guarda. Soltar alivia a mente.",
    question: "O que preciso soltar hoje?"
  },
  "07-23": {
    title: "Organize para clarear",
    text: "Sêneca ensinava que organização externa traz clareza interna. Organizar reduz ansiedade.",
    question: "O que posso organizar hoje?"
  },
  "07-24": {
    title: "Aja com intenção",
    text: "Marco Aurélio defendia agir com consciência, não por reação. Intenção orienta ações.",
    question: "Qual é minha intenção hoje?"
  },
  "07-25": {
    title: "Aceite o ritmo das coisas",
    text: "Para Sêneca, forçar o tempo gera frustração. Respeitar o ritmo traz equilíbrio.",
    question: "O que estou forçando?"
  },
  "07-26": {
    title: "Nem toda vitória é visível",
    text: "Marco Aurélio reconhecia o crescimento interno silencioso. Algumas vitórias acontecem por dentro.",
    question: "Que vitória interna tive recentemente?"
  },
  "07-27": {
    title: "Não discuta para provar",
    text: "Epicteto ensinava que discutir para provar algo rouba paz. A razão não precisa gritar.",
    question: "Estou discutindo para provar algo?"
  },
  "07-28": {
    title: "Faça o bem sem esperar retorno",
    text: "Marco Aurélio defendia agir corretamente por princípio. Virtude basta.",
    question: "Estou esperando retorno?"
  },
  "07-29": {
    title: "Seja paciente consigo",
    text: "Para Sêneca, a impaciência consigo mesmo gera sofrimento. Crescimento leva tempo.",
    question: "Estou sendo paciente comigo?"
  },
  "07-30": {
    title: "Viva com simplicidade",
    text: "Marco Aurélio valorizava uma vida simples e alinhada. O excesso pesa.",
    question: "O que posso retirar da minha vida?"
  },
  "07-31": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia revisar o dia como forma de evolução. Encerrar consciente prepara o próximo ciclo.",
    question: "O que este mês me ensinou?"
  },
  // Agosto
  "08-01": {
    title: "Comece pelo essencial",
    text: "No estoicismo, Marco Aurélio lembrava que a mente se perde quando abraça coisas demais. Quando tudo parece importante, nada recebe atenção real. Começar pelo essencial organiza o dia.",
    question: "O que é essencial hoje?"
  },
  "08-02": {
    title: "Não carregue o que não é seu",
    text: "Para Epicteto, sofrer pelo que não depende de nós é escolha inconsciente. Assumir problemas dos outros pesa a mente. Cada um carrega o que lhe cabe.",
    question: "O que estou carregando sem precisar?"
  },
  "08-03": {
    title: "Faça o básico com atenção",
    text: "Marco Aurélio valorizava o cuidado nas pequenas ações. O básico bem feito sustenta qualquer progresso. Atenção ao simples gera excelência.",
    question: "O que é básico e merece minha atenção?"
  },
  "08-04": {
    title: "A mente precisa de ordem",
    text: "Para Sêneca, desordem externa reflete confusão interna. Organização clareia decisões. Organizar é aliviar a mente.",
    question: "O que posso organizar hoje?"
  },
  "08-05": {
    title: "Não viva no piloto automático",
    text: "Marco Aurélio alertava sobre viver sem consciência, apenas reagindo. Viver atento devolve sentido ao dia.",
    question: "Onde estou vivendo no automático?"
  },
  "08-06": {
    title: "Controle interno é suficiente",
    text: "No centro do estoicismo, Epicteto ensinava que controlar a própria atitude basta para a paz. O resto deve ser aceito.",
    question: "O que está sob meu controle agora?"
  },
  "08-07": {
    title: "Não discuta por vaidade",
    text: "Para Epicteto, discutir para vencer rouba tranquilidade. Nem toda discussão vale o desgaste. Silenciar também é sabedoria.",
    question: "Preciso mesmo entrar nessa discussão?"
  },
  "08-08": {
    title: "Cansaço pede ajuste, não culpa",
    text: "Sêneca reconhecia que o corpo fala antes da mente quebrar. Ignorar sinais gera erro. Ajustar o ritmo evita colapsos.",
    question: "O que preciso ajustar no meu ritmo?"
  },
  "08-09": {
    title: "Seja firme sem ser duro",
    text: "Marco Aurélio defendia firmeza com gentileza. Dureza afasta, firmeza sustenta. Equilíbrio constrói respeito.",
    question: "Estou sendo firme ou duro?"
  },
  "08-10": {
    title: "Não alimente pensamentos inúteis",
    text: "Para Epicteto, pensamentos não examinados dominam ações. Escolher pensamentos é escolher como viver.",
    question: "Que pensamento posso soltar hoje?"
  },
  "08-11": {
    title: "A pressa rouba clareza",
    text: "Sêneca alertava que a pressa cria erros evitáveis. Calma permite ver melhor.",
    question: "Onde posso agir com mais calma?"
  },
  "08-12": {
    title: "Valorize o progresso silencioso",
    text: "Marco Aurélio confiava no crescimento interno, mesmo sem reconhecimento externo. Nem todo avanço é visível.",
    question: "Que progresso interno tive recentemente?"
  },
  "08-13": {
    title: "Não viva esperando reconhecimento",
    text: "Para Sêneca, agir corretamente não depende de aplausos. Virtude não é troca.",
    question: "Estou esperando reconhecimento?"
  },
  "08-14": {
    title: "Decida com simplicidade",
    text: "Epicteto defendia decisões claras e simples, pois complicar paralisa. Simplicidade traz ação.",
    question: "Posso decidir isso de forma mais simples?"
  },
  "08-15": {
    title: "Gentileza é força interior",
    text: "Marco Aurélio via a gentileza como expressão de domínio próprio. Ser gentil exige maturidade.",
    question: "Onde posso agir com mais gentileza?"
  },
  "08-16": {
    title: "Não adie o essencial",
    text: "Para Sêneca, adiar o importante é adiar a vida. O essencial pede ação agora.",
    question: "O que estou adiando sem necessidade?"
  },
  "08-17": {
    title: "Observe antes de reagir",
    text: "Epicteto ensinava que a pausa cria espaço para a razão. Reagir no impulso gera arrependimento.",
    question: "Estou reagindo ou escolhendo?"
  },
  "08-18": {
    title: "Nem tudo precisa ser resolvido hoje",
    text: "Marco Aurélio aceitava o ritmo natural das coisas. Forçar gera frustração.",
    question: "O que posso deixar amadurecer?"
  },
  "08-19": {
    title: "Faça o que depende de você",
    text: "No estoicismo, Epicteto reforçava agir apenas onde há controle. O resto deve ser aceito.",
    question: "O que depende de mim hoje?"
  },
  "08-20": {
    title: "Constância constrói caráter",
    text: "Marco Aurélio acreditava que caráter se forma na prática diária. Repetição molda quem você é.",
    question: "Onde preciso ser mais constante?"
  },
  "08-21": {
    title: "Não leve tudo para o lado pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem a partir de suas próprias dores. Nem tudo é sobre você.",
    question: "Estou levando algo para o lado pessoal?"
  },
  "08-22": {
    title: "Ajuste expectativas",
    text: "Para Sêneca, expectativas exageradas geram frustração. Ajustar expectativas traz equilíbrio.",
    question: "Que expectativa preciso ajustar?"
  },
  "08-23": {
    title: "Organize para aliviar",
    text: "Sêneca ensinava que organização externa alivia a mente. Organizar traz leveza.",
    question: "O que posso organizar hoje?"
  },
  "08-24": {
    title: "Coragem é constância",
    text: "Para Sêneca, coragem não é impulso, é permanência. Continuar exige mais coragem que começar.",
    question: "Onde preciso continuar?"
  },
  "08-25": {
    title: "Não alimente ressentimento",
    text: "Marco Aurélio alertava que ressentimento corrói quem guarda. Soltar é autocuidado.",
    question: "O que preciso soltar hoje?"
  },
  "08-26": {
    title: "Seja paciente com seu processo",
    text: "Marco Aurélio aceitava o próprio ritmo de evolução. Comparar atrasa.",
    question: "Estou sendo paciente comigo?"
  },
  "08-27": {
    title: "Nem todo esforço é visível",
    text: "Marco Aurélio reconhecia que nem todo progresso aparece. Confie no processo interno.",
    question: "Que esforço interno estou fazendo?"
  },
  "08-28": {
    title: "Aja com intenção",
    text: "Marco Aurélio defendia agir com consciência, não por reação. Intenção orienta escolhas.",
    question: "Qual é minha intenção hoje?"
  },
  "08-29": {
    title: "O desconforto ensina",
    text: "Para Sêneca, evitar desconforto impede crescimento. O desconforto mostra onde evoluir.",
    question: "O que o desconforto está me ensinando?"
  },
  "08-30": {
    title: "Viva com simplicidade",
    text: "Marco Aurélio valorizava uma vida simples e alinhada ao essencial. O excesso pesa.",
    question: "O que posso retirar da minha vida?"
  },
  "08-31": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia revisar o dia como prática de evolução. Encerrar consciente prepara o próximo ciclo.",
    question: "O que este mês me ensinou?"
  },
  // Setembro
  "09-01": {
    title: "Recomeçar também é avançar",
    text: "No estoicismo, Marco Aurélio lembrava que cada dia é uma nova chance de agir corretamente, mesmo depois de erros. Recomeçar não apaga o passado, mas ajusta o caminho. Recomeçar exige humildade e coragem.",
    question: "O que posso recomeçar hoje?"
  },
  "09-02": {
    title: "Não confunda controle com tensão",
    text: "Para Epicteto, controle está na atitude, não na rigidez. Tensão excessiva não melhora resultados. Agir com firmeza e calma traz mais clareza.",
    question: "Onde estou tenso sem necessidade?"
  },
  "09-03": {
    title: "Faça o que está à sua frente",
    text: "Marco Aurélio aconselhava focar na tarefa do momento, não em tudo de uma vez. Fazer o que está diante de você já é suficiente.",
    question: "Qual é a tarefa mais importante agora?"
  },
  "09-04": {
    title: "Não viva no passado",
    text: "Para Sêneca, viver preso ao passado rouba energia do presente. O passado ensina, mas não governa. Aprenda e siga.",
    question: "O que já posso deixar para trás?"
  },
  "09-05": {
    title: "Disciplina cria liberdade",
    text: "Epicteto ensinava que disciplina não aprisiona, liberta. Ela organiza a mente e o dia. Liberdade nasce da ordem interna.",
    question: "Que disciplina preciso reforçar?"
  },
  "09-06": {
    title: "Nem tudo é urgente",
    text: "Marco Aurélio alertava que tratar tudo como urgente gera confusão. Diferenciar urgência de importância traz paz.",
    question: "O que pode esperar?"
  },
  "09-07": {
    title: "Aceite o ritmo das pessoas",
    text: "Sêneca lembrava que cada pessoa tem seu próprio tempo. Forçar o ritmo alheio gera frustração. Paciência constrói relacionamentos.",
    question: "Estou respeitando o ritmo de alguém?"
  },
  "09-08": {
    title: "Não discuta para ter razão",
    text: "Epicteto ensinava que a razão não precisa ser provada em discussões. Buscar entender vale mais que vencer.",
    question: "Quero vencer ou compreender?"
  },
  "09-09": {
    title: "O simples sustenta",
    text: "Marco Aurélio valorizava o simples e o essencial. Complicar enfraquece. O simples mantém o equilíbrio.",
    question: "O que posso simplificar hoje?"
  },
  "09-10": {
    title: "Observe antes de reagir",
    text: "Para Epicteto, observar cria espaço para escolher. Reagir no impulso gera arrependimento. A pausa protege.",
    question: "Estou reagindo ou escolhendo?"
  },
  "09-11": {
    title: "Não se cobre perfeição",
    text: "Sêneca alertava que a cobrança excessiva gera sofrimento. Progresso vale mais que perfeição. Crescer é ajustar.",
    question: "Onde estou me cobrando demais?"
  },
  "09-12": {
    title: "A mente precisa de descanso",
    text: "Sêneca reconhecia que a mente também cansa, não apenas o corpo. Descansar é parte da produtividade.",
    question: "Preciso descansar a mente hoje?"
  },
  "09-13": {
    title: "Faça menos, com mais presença",
    text: "Marco Aurélio acreditava que presença melhora qualquer ação. Distração rouba qualidade.",
    question: "Onde posso estar mais presente?"
  },
  "09-14": {
    title: "Não alimente ressentimentos",
    text: "Para Marco Aurélio, ressentimento corrói quem guarda. Soltar é autocuidado.",
    question: "O que preciso soltar hoje?"
  },
  "09-15": {
    title: "Não viva esperando reconhecimento",
    text: "Sêneca ensinava que agir corretamente não depende de aplausos. Virtude não é troca.",
    question: "Estou esperando reconhecimento?"
  },
  "09-16": {
    title: "Decida com calma",
    text: "Para Sêneca, decisões apressadas geram arrependimento. Calma clareia escolhas.",
    question: "Posso decidir isso com mais calma?"
  },
  "09-17": {
    title: "Faça o que depende de você",
    text: "No centro do estoicismo, Epicteto reforçava agir apenas onde há controle. O resto deve ser aceito.",
    question: "O que depende de mim hoje?"
  },
  "09-18": {
    title: "Não dramatize dificuldades",
    text: "Epicteto alertava que exagerar problemas amplia o sofrimento. Proporção traz serenidade.",
    question: "Estou exagerando este problema?"
  },
  "09-19": {
    title: "Gentileza é força",
    text: "Marco Aurélio via a gentileza como expressão de domínio interior. Ser gentil exige maturidade.",
    question: "Onde posso agir com mais gentileza?"
  },
  "09-20": {
    title: "Constância vale mais que intensidade",
    text: "Marco Aurélio confiava na prática diária, não em picos de esforço. Constância constrói.",
    question: "Onde preciso ser mais constante?"
  },
  "09-21": {
    title: "Organize para clarear",
    text: "Sêneca ensinava que organização externa traz clareza interna. Organizar alivia a mente.",
    question: "O que posso organizar hoje?"
  },
  "09-22": {
    title: "Não leve tudo para o lado pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem conforme suas próprias lutas. Nem tudo é sobre você.",
    question: "Estou levando algo para o lado pessoal?"
  },
  "09-23": {
    title: "Aja com intenção",
    text: "Marco Aurélio defendia agir com consciência, não por reação. Intenção orienta escolhas.",
    question: "Qual é minha intenção hoje?"
  },
  "09-24": {
    title: "Aceite o que não pode mudar",
    text: "Para Epicteto, aceitar a realidade é o início da tranquilidade. Aceitação libera energia para agir.",
    question: "O que preciso aceitar hoje?"
  },
  "09-25": {
    title: "Não confunda esforço com sofrimento",
    text: "Sêneca diferenciava esforço consciente de sofrimento desnecessário. Esforço fortalece, sofrimento desgasta.",
    question: "Estou me esforçando ou sofrendo?"
  },
  "09-26": {
    title: "Seja paciente com seu processo",
    text: "Marco Aurélio aceitava o próprio ritmo de evolução. Comparar atrasa.",
    question: "Estou sendo paciente comigo?"
  },
  "09-27": {
    title: "Nem toda vitória é visível",
    text: "Marco Aurélio reconhecia o crescimento interno silencioso. Algumas vitórias acontecem por dentro.",
    question: "Que vitória interna tive recentemente?"
  },
  "09-28": {
    title: "Não alimente pensamentos inúteis",
    text: "Para Epicteto, pensamentos não examinados dominam a mente. Escolher pensamentos é escolher paz.",
    question: "Que pensamento posso soltar hoje?"
  },
  "09-29": {
    title: "Viva com simplicidade",
    text: "Marco Aurélio valorizava uma vida simples e alinhada ao essencial. O excesso pesa.",
    question: "O que posso retirar da minha vida?"
  },
  "09-30": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia revisar o dia e o mês como prática de evolução. Refletir prepara o próximo ciclo.",
    question: "O que este mês me ensinou?"
  },
  // Outubro
  "10-01": {
    title: "Comece com consciência",
    text: "No estoicismo, Marco Aurélio defendia iniciar o dia lembrando a si mesmo como agir, antes que as situações conduzam você. Consciência no início evita arrependimentos no fim.",
    question: "Como quero agir hoje?"
  },
  "10-02": {
    title: "Não confunda controle com rigidez",
    text: "Para Epicteto, controle está na atitude interna, não na rigidez externa. Rigidez gera tensão; firmeza gera equilíbrio.",
    question: "Onde estou sendo rígido demais?"
  },
  "10-03": {
    title: "Faça o que está sob seu alcance",
    text: "Marco Aurélio aconselhava focar apenas na tarefa do momento, sem carregar o peso de tudo. Fazer o que cabe hoje já é suficiente.",
    question: "O que está ao meu alcance agora?"
  },
  "10-04": {
    title: "Não viva preso ao passado",
    text: "Para Sêneca, viver no passado rouba energia do presente. O passado ensina, mas não governa. Aprenda e siga.",
    question: "O que já posso deixar no passado?"
  },
  "10-05": {
    title: "Disciplina traz liberdade",
    text: "Epicteto ensinava que a disciplina organiza a mente e o dia, criando liberdade interior. Ordem interna reduz ansiedade.",
    question: "Que disciplina preciso reforçar?"
  },
  "10-06": {
    title: "Nem tudo precisa de resposta",
    text: "Para Epicteto, o silêncio consciente é sinal de domínio próprio. Responder tudo cansa e gera conflito.",
    question: "Preciso responder agora?"
  },
  "10-07": {
    title: "O simples resolve",
    text: "Marco Aurélio valorizava soluções simples e diretas. Complicar paralisa, simplificar move.",
    question: "O que pode ser resolvido de forma simples?"
  },
  "10-08": {
    title: "Aceite seus limites",
    text: "Sêneca reconhecia que todos têm limites. Ignorá-los gera esgotamento. Respeitar limites é sabedoria.",
    question: "Que limite preciso respeitar hoje?"
  },
  "10-09": {
    title: "Não busque aprovação constante",
    text: "Epicteto lembrava que a busca por aprovação rouba liberdade. Viver alinhado aos próprios valores traz paz.",
    question: "Estou buscando aprovação demais?"
  },
  "10-10": {
    title: "Constância constrói resultados",
    text: "Marco Aurélio confiava na repetição diária, não em grandes gestos isolados. Continue.",
    question: "Onde preciso ser mais constante?"
  },
  "10-11": {
    title: "Observe antes de julgar",
    text: "Para Marco Aurélio, julgamentos rápidos geram erros. Observar mais amplia a compreensão.",
    question: "O que ainda não sei sobre essa situação?"
  },
  "10-12": {
    title: "Gratidão equilibra",
    text: "Sêneca ensinava que reconhecer o que já se tem traz estabilidade. Gratidão acalma a mente.",
    question: "Pelo que posso ser grato hoje?"
  },
  "10-13": {
    title: "Não adie o essencial",
    text: "Para Sêneca, adiar o importante é adiar a vida. O essencial pede ação agora.",
    question: "O que estou adiando sem necessidade?"
  },
  "10-14": {
    title: "Seja paciente com o processo",
    text: "Marco Aurélio aceitava o próprio ritmo de evolução. Pressa gera ansiedade.",
    question: "Estou sendo paciente comigo?"
  },
  "10-15": {
    title: "Faça o bem sem esperar retorno",
    text: "Marco Aurélio defendia agir corretamente por princípio. Virtude basta.",
    question: "Estou esperando algo em troca?"
  },
  "10-16": {
    title: "Organize para pensar melhor",
    text: "Sêneca ensinava que organização externa clareia a mente. Desordem confunde.",
    question: "O que posso organizar hoje?"
  },
  "10-17": {
    title: "Não alimente irritação",
    text: "Marco Aurélio lembrava que a irritação começa dentro de nós. Escolher não alimentá-la é escolher paz.",
    question: "O que está me irritando sem necessidade?"
  },
  "10-18": {
    title: "Aja com intenção",
    text: "Marco Aurélio defendia agir com consciência, não por reação. Intenção orienta escolhas.",
    question: "Qual é minha intenção hoje?"
  },
  "10-19": {
    title: "Nem tudo é urgente",
    text: "Sêneca alertava que tratar tudo como urgente esgota. O essencial vem primeiro.",
    question: "O que pode esperar?"
  },
  "10-20": {
    title: "Aceite pessoas como são",
    text: "Epicteto lembrava que tentar mudar os outros gera frustração. Aceitar não é concordar.",
    question: "O que preciso aceitar em alguém?"
  },
  "10-21": {
    title: "Pequenos passos constroem",
    text: "Marco Aurélio confiava na força do progresso diário. Pequenos passos sustentam grandes mudanças.",
    question: "Qual pequeno passo posso dar hoje?"
  },
  "10-22": {
    title: "Não leve tudo para o lado pessoal",
    text: "Marco Aurélio lembrava que as pessoas agem a partir de suas próprias dores. Nem tudo é sobre você.",
    question: "Estou levando algo para o lado pessoal?"
  },
  "10-23": {
    title: "Viva com simplicidade",
    text: "Marco Aurélio valorizava uma vida simples e alinhada ao essencial. O excesso pesa.",
    question: "O que posso simplificar?"
  },
  "10-24": {
    title: "O desconforto ensina",
    text: "Para Sêneca, evitar desconforto impede crescimento. O desconforto mostra onde evoluir.",
    question: "O que o desconforto está me ensinando?"
  },
  "10-25": {
    title: "Coragem é constância",
    text: "Sêneca ensinava que coragem não é impulso, é permanência. Continuar exige mais coragem que começar.",
    question: "Onde preciso continuar?"
  },
  "10-26": {
    title: "Nem toda vitória é visível",
    text: "Marco Aurélio reconhecia o crescimento interno silencioso. Algumas vitórias acontecem por dentro.",
    question: "Que vitória interna tive recentemente?"
  },
  "10-27": {
    title: "Não alimente ressentimento",
    text: "Para Marco Aurélio, ressentimento machuca mais quem guarda. Soltar é autocuidado.",
    question: "O que preciso soltar hoje?"
  },
  "10-28": {
    title: "Decida com calma",
    text: "Sêneca alertava que decisões apressadas geram arrependimento. Calma clareia escolhas.",
    question: "Posso decidir isso com mais calma?"
  },
  "10-29": {
    title: "Faça o que depende de você",
    text: "No centro do estoicismo, Epicteto reforçava agir apenas onde há controle. O resto deve ser aceito.",
    question: "O que depende de mim hoje?"
  },
  "10-30": {
    title: "Gentileza é força",
    text: "Marco Aurélio via a gentileza como expressão de domínio interior. Ser gentil exige maturidade.",
    question: "Onde posso agir com mais gentileza?"
  },
  "10-31": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia revisar o dia e o mês como prática de evolução. Refletir prepara o próximo ciclo.",
    question: "O que este mês me ensinou?"
  },
  // Novembro
  "11-01": {
    title: "Novo mês, nova intenção",
    text: "No estoicismo, Marco Aurélio defendia começar cada período com clareza de propósito. Um novo mês é oportunidade de ajustar o caminho.",
    question: "Qual é minha intenção para este mês?"
  },
  "11-02": {
    title: "Honre quem partiu",
    text: "Marco Aurélio refletia sobre a brevidade da vida. Lembrar de quem partiu nos conecta com o essencial.",
    question: "Como posso honrar a memória de quem amo?"
  },
  "11-03": {
    title: "Gratidão transforma perspectiva",
    text: "Sêneca ensinava que gratidão ajusta o olhar. Ver o que já se tem traz equilíbrio.",
    question: "Pelo que sou grato hoje?"
  },
  "11-04": {
    title: "Foque no que controla",
    text: "Epicteto reforçava: paz vem de direcionar energia ao que está em suas mãos.",
    question: "O que está sob meu controle agora?"
  },
  "11-05": {
    title: "Não adie conversas importantes",
    text: "Sêneca alertava que evitar o necessário cria mais dor no futuro. Coragem emocional resolve pendências.",
    question: "Que conversa estou evitando?"
  },
  "11-06": {
    title: "Simplicidade organiza",
    text: "Marco Aurélio valorizava o simples. O excesso confunde, a simplicidade clareia.",
    question: "O que posso simplificar hoje?"
  },
  "11-07": {
    title: "Constância vence talento",
    text: "Sêneca ensinava que esforço contínuo supera habilidade sem disciplina.",
    question: "Onde preciso ser mais constante?"
  },
  "11-08": {
    title: "Aceite o ritmo das coisas",
    text: "Marco Aurélio aceitava que algumas coisas levam tempo. Forçar gera frustração.",
    question: "O que posso deixar amadurecer?"
  },
  "11-09": {
    title: "Não julgue rápido",
    text: "Para Marco Aurélio, julgamos sem conhecer toda a história. Observar amplia compreensão.",
    question: "O que ainda não sei sobre essa situação?"
  },
  "11-10": {
    title: "Seja útil onde estiver",
    text: "Marco Aurélio via que ser útil já é propósito suficiente. Contribuir dá sentido.",
    question: "Como posso ser útil hoje?"
  },
  "11-11": {
    title: "Pausa também é ação",
    text: "Sêneca reconhecia o valor do descanso consciente. Parar no momento certo evita decisões ruins.",
    question: "Preciso pausar ou insistir?"
  },
  "11-12": {
    title: "Não alimente pensamentos negativos",
    text: "Epicteto alertava que pensamentos alimentados crescem. Escolha o que alimentar.",
    question: "Que pensamento posso soltar?"
  },
  "11-13": {
    title: "O básico bem feito sustenta",
    text: "Marco Aurélio valorizava o cuidado nas pequenas ações. Excelência está no simples.",
    question: "O que é básico e merece minha atenção?"
  },
  "11-14": {
    title: "Não espere condições perfeitas",
    text: "Sêneca alertava que esperar o ideal é perder tempo de vida. Comece com o que tem.",
    question: "O que posso começar mesmo imperfeito?"
  },
  "11-15": {
    title: "Calma é força",
    text: "Marco Aurélio via a calma como sinal de maturidade. Responder com calma evita erros.",
    question: "Estou agindo com calma?"
  },
  "11-16": {
    title: "Proteja sua energia",
    text: "Marco Aurélio lembrava que energia é limitada. Escolher onde gastar é sabedoria.",
    question: "Onde estou gastando energia à toa?"
  },
  "11-17": {
    title: "Aja com intenção",
    text: "Marco Aurélio defendia agir com consciência. Intenção orienta escolhas.",
    question: "Qual é minha intenção hoje?"
  },
  "11-18": {
    title: "Não leve tudo tão a sério",
    text: "Sêneca alertava contra o excesso de rigidez. Leveza também é sabedoria.",
    question: "Onde posso aliviar?"
  },
  "11-19": {
    title: "Pequenos progressos contam",
    text: "Marco Aurélio confiava na força do progresso diário. Evoluir um pouco já é vitória.",
    question: "Em que evoluí recentemente?"
  },
  "11-20": {
    title: "Seja paciente com seu processo",
    text: "Marco Aurélio aceitava o próprio ritmo. Você está em construção.",
    question: "Estou sendo paciente comigo?"
  },
  "11-21": {
    title: "O desconforto ensina",
    text: "Sêneca dizia que evitar desconforto impede crescimento. Aprender dói, mas fortalece.",
    question: "O que o desconforto está me ensinando?"
  },
  "11-22": {
    title: "Não acumule ressentimento",
    text: "Marco Aurélio alertava que ressentimento machuca quem guarda. Soltar liberta.",
    question: "O que preciso soltar hoje?"
  },
  "11-23": {
    title: "Agradeça as dificuldades",
    text: "Sêneca via as dificuldades como treino do caráter. Cada problema é chance de crescer.",
    question: "Que lição esta dificuldade me trouxe?"
  },
  "11-24": {
    title: "Constância constrói caráter",
    text: "Marco Aurélio acreditava que caráter se forma na prática diária. Continue.",
    question: "Onde preciso ser mais constante?"
  },
  "11-25": {
    title: "Organize para pensar melhor",
    text: "Sêneca ensinava que organização externa clareia a mente.",
    question: "O que posso organizar hoje?"
  },
  "11-26": {
    title: "Aceite o que não pode mudar",
    text: "Epicteto ensinava que aceitar a realidade é o início da tranquilidade.",
    question: "O que preciso aceitar hoje?"
  },
  "11-27": {
    title: "Viva com integridade",
    text: "Marco Aurélio defendia viver alinhado aos valores. Integridade traz paz duradoura.",
    question: "Estou vivendo de acordo com meus valores?"
  },
  "11-28": {
    title: "Nem toda vitória é visível",
    text: "Marco Aurélio reconhecia o crescimento interno silencioso. Algumas vitórias são internas.",
    question: "Que vitória interna tive recentemente?"
  },
  "11-29": {
    title: "Gentileza é força interior",
    text: "Marco Aurélio via a gentileza como expressão de domínio próprio.",
    question: "Onde posso agir com mais gentileza?"
  },
  "11-30": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia revisar o mês como prática de evolução.",
    question: "O que este mês me ensinou?"
  },
  // Dezembro
  "12-01": {
    title: "Último mês, nova chance",
    text: "No estoicismo, Marco Aurélio via cada fim como oportunidade de reflexão e recomeço. O ano termina, mas a jornada continua.",
    question: "O que quero realizar antes do ano terminar?"
  },
  "12-02": {
    title: "Reflita sobre o ano",
    text: "Sêneca valorizava a reflexão como ferramenta de crescimento. Olhar para trás ensina sobre o caminho à frente.",
    question: "O que aprendi de mais valioso este ano?"
  },
  "12-03": {
    title: "Gratidão pelo caminho",
    text: "Marco Aurélio ensinava que reconhecer o caminho percorrido traz paz. Cada passo conta.",
    question: "Pelo que sou grato neste ano?"
  },
  "12-04": {
    title: "Solte o que ficou para trás",
    text: "Epicteto lembrava que carregar o passado pesa. Soltar liberta energia para o novo.",
    question: "O que preciso deixar neste ano?"
  },
  "12-05": {
    title: "Simplifique os dias finais",
    text: "Marco Aurélio valorizava a simplicidade. O fim do ano pede leveza, não mais peso.",
    question: "O que posso simplificar neste período?"
  },
  "12-06": {
    title: "Seja presente com quem ama",
    text: "Sêneca alertava sobre o tempo desperdiçado longe do essencial. Presença é o melhor presente.",
    question: "Como posso estar mais presente hoje?"
  },
  "12-07": {
    title: "Não espere o ano novo para mudar",
    text: "Marco Aurélio defendia agir agora, não esperar datas especiais. Mudança começa hoje.",
    question: "Que mudança posso iniciar agora?"
  },
  "12-08": {
    title: "Aceite o que foi",
    text: "Epicteto ensinava que aceitar o passado liberta. O que foi, já ensinou sua lição.",
    question: "O que preciso aceitar sobre este ano?"
  },
  "12-09": {
    title: "Cuide de quem está perto",
    text: "Marco Aurélio valorizava os relacionamentos genuínos. Conexão humana é riqueza verdadeira.",
    question: "Quem merece minha atenção hoje?"
  },
  "12-10": {
    title: "Descanse sem culpa",
    text: "Sêneca reconhecia o valor do descanso. Fim de ano pede pausa consciente.",
    question: "Estou permitindo-me descansar?"
  },
  "12-11": {
    title: "Celebre pequenas vitórias",
    text: "Marco Aurélio via valor no progresso diário. Cada pequena vitória merece reconhecimento.",
    question: "Que pequenas vitórias tive este ano?"
  },
  "12-12": {
    title: "Não adie conversas importantes",
    text: "Sêneca alertava que evitar pendências cria peso. Resolva antes do ano terminar.",
    question: "Que conversa preciso ter ainda este ano?"
  },
  "12-13": {
    title: "Organize para clarear",
    text: "Marco Aurélio valorizava a ordem. Organizar o espaço organiza a mente.",
    question: "O que posso organizar antes do fim do ano?"
  },
  "12-14": {
    title: "Gentileza no final do ano",
    text: "Marco Aurélio via a gentileza como força. Este período pede mais gentileza.",
    question: "Onde posso ser mais gentil?"
  },
  "12-15": {
    title: "Reflita sobre seus valores",
    text: "Epicteto defendia viver alinhado aos valores. Revisar valores fortalece o próximo ano.",
    question: "Vivi de acordo com meus valores este ano?"
  },
  "12-16": {
    title: "Agradeça quem ajudou",
    text: "Sêneca valorizava a gratidão expressa. Agradecer fortalece conexões.",
    question: "Quem preciso agradecer?"
  },
  "12-17": {
    title: "Solte expectativas excessivas",
    text: "Marco Aurélio alertava contra expectativas irreais. Ajustar expectativas traz paz.",
    question: "Que expectativa preciso ajustar para as festas?"
  },
  "12-18": {
    title: "Esteja presente nas celebrações",
    text: "Sêneca lembrava que a presença vale mais que presentes. Esteja inteiro onde estiver.",
    question: "Como posso estar mais presente nas celebrações?"
  },
  "12-19": {
    title: "Não se compare nas festas",
    text: "Epicteto alertava que comparação rouba paz. Cada pessoa tem sua jornada.",
    question: "Estou me comparando com outros?"
  },
  "12-20": {
    title: "Cuide da sua paz",
    text: "Marco Aurélio defendia proteger a tranquilidade interior. Não deixe que o caos externo invada.",
    question: "O que está ameaçando minha paz?"
  },
  "12-21": {
    title: "O dia mais longo ou curto",
    text: "Este solstício marca uma virada. Assim como a natureza muda, nós também evoluímos.",
    question: "Que virada interna estou vivendo?"
  },
  "12-22": {
    title: "Simplifique as festas",
    text: "Marco Aurélio valorizava o simples. Menos pode ser mais nas celebrações.",
    question: "O que posso simplificar neste período festivo?"
  },
  "12-23": {
    title: "Prepare-se para celebrar",
    text: "Sêneca via valor na preparação consciente. Celebrar com intenção transforma a experiência.",
    question: "Como posso me preparar para celebrar com presença?"
  },
  "12-24": {
    title: "Noite de reflexão",
    text: "Marco Aurélio defendia a reflexão como prática de sabedoria. Esta noite pede contemplação.",
    question: "O que este ano me ensinou sobre mim mesmo?"
  },
  "12-25": {
    title: "O presente da presença",
    text: "Sêneca lembrava que tempo com quem amamos é o maior presente. Esteja inteiro hoje.",
    question: "Como posso estar plenamente presente hoje?"
  },
  "12-26": {
    title: "Descanse e integre",
    text: "Marco Aurélio reconhecia o valor do descanso após celebrações. Integrar é processar.",
    question: "O que preciso integrar das celebrações?"
  },
  "12-27": {
    title: "Olhe para o ano que passou",
    text: "Sêneca valorizava a revisão consciente. Ver o todo ajuda a entender cada parte.",
    question: "Qual foi o momento mais significativo do ano?"
  },
  "12-28": {
    title: "Solte arrependimentos",
    text: "Epicteto ensinava que carregar arrependimento pesa. O que passou já ensinou sua lição.",
    question: "Que arrependimento posso soltar?"
  },
  "12-29": {
    title: "Prepare intenções",
    text: "Marco Aurélio defendia clareza de propósito. Intenções claras guiam o caminho.",
    question: "Quais são minhas intenções para o próximo ano?"
  },
  "12-30": {
    title: "Agradeça pelo ano completo",
    text: "Sêneca ensinava que gratidão transforma perspectiva. Agradeça tudo: alegrias e lições.",
    question: "Por tudo que vivi este ano, pelo que sou grato?"
  },
  "12-31": {
    title: "Encerre com consciência",
    text: "Marco Aurélio defendia encerrar ciclos com clareza. Este dia marca fim e início. Celebre a jornada e prepare-se para continuar.",
    question: "Como quero lembrar deste ano? E como quero começar o próximo?"
  }
};

// Helper function to get today's reflection
export function getTodayReflection(): { date: Date; reflection: StoicReflection } {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;
  
  const reflection = stoicReflections[key];
  
  // Fallback if no reflection for this date
  if (!reflection) {
    return {
      date: today,
      reflection: {
        title: "Viva o momento presente",
        text: "Marco Aurélio ensinava que a vida acontece agora. O presente é tudo que realmente temos.",
        question: "Como posso estar mais presente hoje?"
      }
    };
  }
  
  return { date: today, reflection };
}
