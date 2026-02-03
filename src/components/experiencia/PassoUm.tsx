import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatButton } from "./ChatButton";
import { VillainInterruption } from "./VillainInterruption";
import { PasswordGate } from "./PasswordGate";

interface PassoUmProps {
  onAdvance: () => void;
}

type Stage = 
  | "intro" 
  | "question" 
  | "villain1" 
  | "recovery1" 
  | "vidaAtual" 
  | "vidaDesejada" 
  | "comparacao" 
  | "revelacao" 
  | "ancora" 
  | "encerramento" 
  | "portaSecreta" 
  | "senhaInput";

const vidaAtualOptions = [
  "Vida confortável, mas sem emoção",
  "Vida sempre no modo esforço",
  "Vida lotada e confusa",
  "Vida focada em vencer",
  "Vida com direção",
];

const vidaDesejadaOptions = [
  "Vida com leveza e presença",
  "Vida com clareza de prioridades",
  "Vida com esforço que faz sentido",
  "Vida alinhada com quem eu sou hoje",
  "Vida com direção consciente",
];

export const PassoUm = ({ onAdvance }: PassoUmProps) => {
  const [stage, setStage] = useState<Stage>("intro");
  const [messages, setMessages] = useState<string[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [vidaAtualChoice, setVidaAtualChoice] = useState("");
  const [vidaDesejadaChoice, setVidaDesejadaChoice] = useState("");
  const [showButton, setShowButton] = useState(false);

  const introMessages = [
    "tentei te ligar agora, mas você não pode me atender...",
    "vou fazer a pergunta por aqui mesmo...",
  ];

  const questionMessages = [
    "vou te fazer uma pergunta estranha",
    "não é sobre produtividade",
    "nem sobre metas",
    "é sobre a vida que vc tá vivendo agora",
  ];

  const recovery1Messages = [
    "Ops... isso não fazia parte da conversa.",
    "alguém tentou te tirar daqui.",
    "acho que não querem que você preste atenção aqui.",
    "alguma semelhança com a vida real?",
    "Desculpe por isso... Vamos continuar",
    "o tema é sobre a vida que vc tá vivendo agora",
  ];

  const revelacaoMessages = [
    "Essa distância entre vida real e vida desejada, não aconteceu por acaso.",
    "ALGUÉM ESTÁ DECIDINDO SUA VIDA POR VOCÊ.",
    "E não é uma pessoa.",
    "É um modo de viver.",
    "continua aqui, que eu vou te explicar",
  ];

  const ancoraMessages = [
    "Antes de tudo, é importante você entender",
    "Tudo o que vou te mostrar, segue uma lógica. Nada inventado, nada de frases ou treinamentos motivacionais. Não foi criado por Gurus da internet.",
    "É algo profundo, mas surpreendentemente simples",
  ];

  const encerramentoMessages = [
    "A partir de agora, você vai começar a perceber esse modo de viver no seu dia a dia.",
  ];

  const portaSecretaMessages = [
    "É um conteúdo que não divulgo para todo mundo.",
    "Anote essa senha para acessar o conteúdo.",
    "Por favor, não compartilhe com ninguém.",
    "a senha é 624798",
  ];

  const addMessage = useCallback((msg: string) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    let currentMessages: string[] = [];
    let delay = 1000;

    switch (stage) {
      case "intro":
        currentMessages = introMessages;
        break;
      case "question":
        currentMessages = questionMessages;
        break;
      case "recovery1":
        currentMessages = recovery1Messages;
        break;
      case "revelacao":
        currentMessages = revelacaoMessages;
        break;
      case "ancora":
        currentMessages = ancoraMessages;
        break;
      case "encerramento":
        currentMessages = encerramentoMessages;
        break;
      case "portaSecreta":
        currentMessages = portaSecretaMessages;
        break;
      default:
        return;
    }

    if (messageIndex < currentMessages.length) {
      const timer = setTimeout(() => {
        addMessage(currentMessages[messageIndex]);
        setMessageIndex((prev) => prev + 1);
      }, 400 + messageIndex * 500);
      return () => clearTimeout(timer);
    } else {
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 300);
      return () => clearTimeout(buttonTimer);
    }
  }, [stage, messageIndex, addMessage]);

  const handleNextStage = (nextStage: Stage) => {
    setMessages([]);
    setMessageIndex(0);
    setShowButton(false);
    setStage(nextStage);
  };

  const handleVidaAtualChoice = (choice: string) => {
    setVidaAtualChoice(choice);
    handleNextStage("vidaDesejada");
  };

  const handleVidaDesejadaChoice = (choice: string) => {
    setVidaDesejadaChoice(choice);
    handleNextStage("comparacao");
  };

  if (stage === "villain1") {
    return (
      <VillainInterruption
        text="isso é só curiosidade&#10;não vai mudar nada"
        isVisible={true}
      />
    );
  }

  if (stage === "senhaInput") {
    return (
      <div className="min-h-screen bg-[#0b141a] flex items-center justify-center">
        <PasswordGate
          password="624798"
          onSuccess={onAdvance}
          buttonText="Acessar sistema"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b141a] flex flex-col">
      {/* Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
          <span className="text-sm font-bold text-white">PDI</span>
        </div>
        <div>
          <p className="text-white font-medium text-[15px]">PDI</p>
          <p className="text-white/50 text-xs">online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <ChatMessage key={`${stage}-${index}`} text={msg} delay={0} />
          ))}
        </AnimatePresence>

        {/* Comparação */}
        {stage === "comparacao" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#202c33] rounded-xl p-4 my-4 space-y-4"
          >
            <div className="text-center space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-wider">Sua vida atual</p>
              <p className="text-white text-base">{vidaAtualChoice}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div className="text-center space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-wider">Vida que deseja</p>
              <p className="text-[#25D366] text-base">{vidaDesejadaChoice}</p>
            </div>
            <div className="h-px bg-white/10" />
            <p className="text-white/70 text-center text-sm pt-2">Percebe a distância?</p>
          </motion.div>
        )}

        {/* Bot Buttons - Inside Chat */}
        <AnimatePresence mode="wait">
          {stage === "intro" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="self-start"
            >
              <ChatButton
                text="ok"
                onClick={() => handleNextStage("question")}
              />
            </motion.div>
          )}

          {stage === "question" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="self-start"
            >
              <ChatButton
                text="ok"
                onClick={() => {
                  setStage("villain1");
                  setTimeout(() => handleNextStage("recovery1"), 2000);
                }}
              />
            </motion.div>
          )}

          {stage === "recovery1" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="self-start"
            >
              <ChatButton
                text="Continuar"
                onClick={() => handleNextStage("vidaAtual")}
              />
            </motion.div>
          )}

          {stage === "vidaAtual" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 w-full"
            >
              <p className="text-white text-lg font-bold mb-3">Qual dessas descreve sua vida atual?</p>
              {vidaAtualOptions.map((option) => (
                <ChatButton
                  key={option}
                  text={option}
                  variant="secondary"
                  onClick={() => handleVidaAtualChoice(option)}
                />
              ))}
            </motion.div>
          )}

          {stage === "vidaDesejada" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 w-full"
            >
              <p className="text-white/60 text-sm mb-3">E qual vida você deseja viver?</p>
              {vidaDesejadaOptions.map((option) => (
                <ChatButton
                  key={option}
                  text={option}
                  variant="secondary"
                  onClick={() => handleVidaDesejadaChoice(option)}
                />
              ))}
            </motion.div>
          )}

          {stage === "comparacao" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="self-start"
            >
              <ChatButton
                text="Continuar"
                onClick={() => handleNextStage("revelacao")}
              />
            </motion.div>
          )}

          {stage === "revelacao" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start"
            >
              <ChatButton
                text="Entendi"
                onClick={() => handleNextStage("ancora")}
              />
            </motion.div>
          )}

          {stage === "ancora" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start"
            >
              <ChatButton
                text="Continuar"
                onClick={() => handleNextStage("encerramento")}
              />
            </motion.div>
          )}

          {stage === "encerramento" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start"
            >
              <ChatButton
                text="Próximo"
                onClick={() => handleNextStage("portaSecreta")}
              />
            </motion.div>
          )}

          {stage === "portaSecreta" && showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start"
            >
              <ChatButton
                text="Abrir conteúdo secreto"
                onClick={() => handleNextStage("senhaInput")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
