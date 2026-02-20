import JornadaFinal from "@/components/jornada/JornadaFinal";

export default function JornadaFinalPreview() {
  const mockSmartData = {
    especifica: "Exemplo de meta específica",
    mensuravel: "Exemplo mensurável",
    alcancavel: "Exemplo alcançável",
    relevante: "Exemplo relevante",
    temporal: "Exemplo temporal",
    aprender: "Exemplo aprender",
    sabotador: "Exemplo sabotador",
    antiSabotagem: "Exemplo anti-sabotagem",
    primeiraAcao: "Exemplo primeira ação",
    diaHora: "Segunda, 10h",
    smartEvaluation: "Avaliação de exemplo da IA sobre a meta.",
  };

  return (
    <JornadaFinal
      onBack={() => window.history.back()}
      smartActionData={mockSmartData}
      vvdAnswers={["Resposta VVD 1", "Resposta VVD 2", "Resposta VVD 3"]}
      vidaNaoQueroAnswers={["Resposta não quero 1", "Resposta não quero 2", "Resposta não quero 3"]}
      autoReflexaoData={{
        valores: ["Liberdade", "Família", "Crescimento"],
        rodaScores: { saude: 7, financas: 5 },
        crencas: ["Crença limitante exemplo"],
      }}
    />
  );
}
