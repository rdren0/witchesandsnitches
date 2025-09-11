import { useState, useCallback } from "react";
import { FORM_SECTIONS } from "../constants/formSections";

export const useFormSections = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSectionExpansion = useCallback((sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const getSectionConfig = useCallback((sectionId) => {
    return FORM_SECTIONS.find((section) => section.id === sectionId);
  }, []);

  return {
    expandedSections,
    toggleSectionExpansion,
    getSectionConfig,
    sections: FORM_SECTIONS,
  };
};
