import { useState, useCallback } from "react";
import { FORM_SECTIONS } from "../constants/formSections";

export const useFormSections = (initialLocks = {}, mode = "create") => {
  const getInitialLocks = useCallback(() => {
    const locks = {};
    FORM_SECTIONS.forEach((section) => {
      if (mode === "create") {
        locks[section.id] = false;
      } else {
        locks[section.id] = initialLocks[section.id] ?? section.lockable;
      }
    });
    return locks;
  }, [initialLocks, mode]);

  const [sectionLocks, setSectionLocks] = useState(getInitialLocks);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSectionLock = useCallback(
    (sectionId) => {
      if (mode === "create") return;

      setSectionLocks((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    },
    [mode]
  );

  const lockAllSections = useCallback(() => {
    if (mode === "create") return;

    const allLocked = {};
    FORM_SECTIONS.forEach((section) => {
      if (section.lockable) {
        allLocked[section.id] = true;
      }
    });
    setSectionLocks(allLocked);
  }, [mode]);

  const unlockAllSections = useCallback(() => {
    const allUnlocked = {};
    FORM_SECTIONS.forEach((section) => {
      allUnlocked[section.id] = false;
    });
    setSectionLocks(allUnlocked);
  }, []);

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
    sectionLocks,
    expandedSections,
    toggleSectionLock,
    lockAllSections,
    unlockAllSections,
    toggleSectionExpansion,
    getSectionConfig,
    sections: FORM_SECTIONS,
    canLock: mode !== "create",
  };
};
