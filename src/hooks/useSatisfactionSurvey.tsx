import { useState, useEffect } from "react";

interface CompletedSection {
  firstCompletedDate: string;
  lastSurveyDate?: string;
  completionCount: number;
}

export const useSatisfactionSurvey = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [completedSection, setCompletedSection] = useState("");

  const checkSurveyEligibility = (sectionName: string): boolean => {
    const completedSections = JSON.parse(
      localStorage.getItem("completed_sections") || "{}"
    ) as Record<string, CompletedSection>;

    const sectionData = completedSections[sectionName];

    // Primeira vez completando esta seção
    if (!sectionData) {
      return true;
    }

    // Se já fez pesquisa, verifica se passou 30+ dias
    if (sectionData.lastSurveyDate) {
      const lastSurveyDate = new Date(sectionData.lastSurveyDate);
      const daysSinceLastSurvey = Math.floor(
        (Date.now() - lastSurveyDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceLastSurvey > 30;
    }

    return false;
  };

  const markSectionCompleted = (sectionName: string) => {
    const completedSections = JSON.parse(
      localStorage.getItem("completed_sections") || "{}"
    ) as Record<string, CompletedSection>;

    const shouldShowSurvey = checkSurveyEligibility(sectionName);

    // Atualiza dados da seção
    completedSections[sectionName] = {
      firstCompletedDate:
        completedSections[sectionName]?.firstCompletedDate || new Date().toISOString(),
      lastSurveyDate: completedSections[sectionName]?.lastSurveyDate,
      completionCount: (completedSections[sectionName]?.completionCount || 0) + 1,
    };

    localStorage.setItem("completed_sections", JSON.stringify(completedSections));

    if (shouldShowSurvey) {
      setCompletedSection(sectionName);
      setShowSurvey(true);
    }
  };

  return {
    showSurvey,
    setShowSurvey,
    completedSection,
    markSectionCompleted,
  };
};