import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, MessageCircle, X } from "lucide-react";
import pdiLogo from "@/assets/logo_pdi.png";

interface PassoTresProps {
  onAdvance: () => void;
}

const tiktokMessages = [
  "Oi.",
  "Eu resolvi te ligar, porque essa parte é importante e eu quero impedir que tentem nos sabotar novamente.",
  "Não é sobre fazer mais coisas.",
  "É sobre o que você está tentando alcançar.",
  "Você escolhe um objetivo, a vida aperta, e você se sente fraco.",
  "Mas o problema não foi você.",
  "Foi o objetivo.",
  "vou te mostrar",
];

const comments = [
  { name: "Ana Silva", text: "Isso mudou minha vida! 🙌" },
  { name: "Carlos M.", text: "Finalmente clareza!" },
  { name: "Julia Costa", text: "Melhor método que já vi" },
  { name: "Pedro Alves", text: "Transformador demais 🔥" },
  { name: "Mariana L.", text: "PDI é incrível!" },
  { name: "Rafael Santos", text: "Recomendo muito" },
  { name: "Camila Dias", text: "Minha rotina mudou 100%" },
  { name: "Lucas Ferreira", text: "Simples e poderoso" },
  { name: "Fernanda B.", text: "Vida nova depois disso" },
  { name: "Thiago Rocha", text: "Finalmente entendi meus objetivos" },
  { name: "Patrícia M.", text: "Obrigada por isso! ❤️" },
  { name: "Bruno Costa", text: "Método sensacional" },
  { name: "Amanda Reis", text: "Todo mundo deveria conhecer" },
  { name: "Diego Lima", text: "Minha produtividade disparou" },
  { name: "Isabela F.", text: "Clareza total agora" },
  { name: "Mateus Oliveira", text: "Isso é ouro puro 💎" },
  { name: "Larissa Souza", text: "Melhor decisão do ano" },
  { name: "Gustavo P.", text: "PDI salvou minha carreira" },
  { name: "Beatriz Mendes", text: "Simplesmente funciona!" },
  { name: "Felipe Andrade", text: "Método revolucionário" },
  { name: "Carolina V.", text: "Muito obrigada! 🙏" },
  { name: "Ricardo Lopes", text: "Finalmente faz sentido" },
  { name: "Natália Cruz", text: "Minha vida mudou" },
  { name: "André Martins", text: "Recomendo de olhos fechados" },
  { name: "Renata Barbosa", text: "Simples e eficaz" },
  { name: "Vinícius S.", text: "Transformação real" },
  { name: "Juliana Almeida", text: "PDI é vida! ❤️" },
  { name: "Leonardo N.", text: "Melhor investimento" },
  { name: "Aline Ribeiro", text: "Mudou minha perspectiva" },
  { name: "Henrique Castro", text: "Incrível demais!" },
  { name: "Priscila Gomes", text: "Finalmente um método que funciona" },
  { name: "Eduardo Carvalho", text: "Muito prático" },
  { name: "Daniela Teixeira", text: "Amando cada passo 🚀" },
  { name: "Marcelo Freitas", text: "Clareza e foco" },
  { name: "Vanessa Lima", text: "Melhor do Brasil!" },
  { name: "Roberto Nunes", text: "Transformador" },
  { name: "Gabriela Moreira", text: "Minha vida mudou 180°" },
  { name: "Fábio Azevedo", text: "Recomendo muito!" },
  { name: "Tatiane Correia", text: "PDI é essencial" },
  { name: "Rodrigo Campos", text: "Finalmente entendi" },
  { name: "Simone Duarte", text: "Obrigada! 🙌" },
  { name: "Paulo Vieira", text: "Método incrível" },
  { name: "Adriana Pereira", text: "Mudou tudo pra mim" },
  { name: "Leandro Moura", text: "Simplesmente o melhor" },
  { name: "Cristiane Santos", text: "Vida transformada" },
  { name: "Marcos Cardoso", text: "PDI funciona mesmo!" },
  { name: "Luciana Farias", text: "Recomendo demais ❤️" },
  { name: "Wagner Pinto", text: "Clareza total" },
  { name: "Michele Araújo", text: "Melhor decisão" },
  { name: "Cláudio Monteiro", text: "Isso é transformador!" },
];

// Generate random avatar URLs using UI Avatars API
const getAvatarUrl = (name: string) => {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'F0E68C', '98D8C8', 'F7DC6F', 'BB8FCE'];
  const color = colors[Math.abs(name.charCodeAt(0)) % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=80&bold=true`;
};

export const PassoTres = ({ onAdvance }: PassoTresProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [likes, setLikes] = useState(324);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (messageIndex < tiktokMessages.length) {
      const timer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  const handleLike = () => {
    if (!liked) {
      setLikes((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setLiked(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* TikTok-style interface */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

      {/* Fake video background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
          <Play className="w-10 h-10 text-white/20 ml-1" />
        </div>
      </div>

      {/* TikTok side icons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        {/* Profile */}
        <div className="flex flex-col items-center gap-1">
          <img 
            src={pdiLogo} 
            alt="PDI" 
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <span className="text-white/60 text-xs">PDI</span>
        </div>
        
        {/* Like button */}
        <button 
          onClick={handleLike}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${liked ? 'bg-red-500/20' : 'bg-white/10'}`}>
            <Heart 
              className={`w-6 h-6 transition-all ${liked ? 'text-red-500 fill-red-500 scale-110' : 'text-white/70'}`}
            />
          </div>
          <span className={`text-xs ${liked ? 'text-red-400' : 'text-white/60'}`}>{likes}</span>
        </button>
        
        {/* Comment button */}
        <button 
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white/70" />
          </div>
          <span className="text-white/60 text-xs">50</span>
        </button>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-24">
        <div className="space-y-3 max-w-[85%]">
          <AnimatePresence mode="popLayout">
            {tiktokMessages.slice(0, messageIndex).map((msg, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-white leading-relaxed ${
                  index === messageIndex - 1 ? 'text-lg' : 'text-base opacity-60'
                }`}
              >
                {msg}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onAdvance}
            className="mt-8 w-full py-4 bg-white text-black font-semibold rounded-xl text-base transition-all active:scale-[0.98]"
          >
            Acessar protocolo
          </motion.button>
        )}
      </div>

      {/* Bottom nav bar (fake) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/90 flex items-center justify-around px-8 border-t border-white/10">
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">+</span>
        </div>
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-6 h-6 bg-white/20 rounded-full" />
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 h-[70%] bg-[#121212] rounded-t-3xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-medium">50 comentários</span>
              <button 
                onClick={() => setShowComments(false)}
                className="p-1"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex gap-3"
                >
                  <img
                    src={getAvatarUrl(comment.name)}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-sm font-medium">{comment.name}</p>
                    <p className="text-white text-sm mt-0.5">{comment.text}</p>
                  </div>
                  <Heart className="w-4 h-4 text-white/30 shrink-0 mt-2" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
