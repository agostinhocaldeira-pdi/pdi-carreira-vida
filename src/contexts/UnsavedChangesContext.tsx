import React, { createContext, useContext, useState, useCallback } from "react";

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  markAsChanged: () => void;
  markAsSaved: () => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return (
    <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges, markAsChanged, markAsSaved }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return context;
};
