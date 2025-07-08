import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const DowntimeContext = createContext(null);

export const useDowntime = () => {
  const context = useContext(DowntimeContext);
  if (!context) {
    throw new Error("useDowntime must be used within DowntimeProvider");
  }
  return context;
};

export const DowntimeProvider = ({
  children,
  selectedCharacter,
  canEdit,
  initialFormData,
  initialRollAssignments,
  initialDicePool,
  onFormDataChange,
  onRollAssignmentsChange,
  onDicePoolChange,
  assignDice,
  unassignDice,
  getDiceUsage,
  getSortedDiceOptions,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [rollAssignments, setRollAssignments] = useState(
    initialRollAssignments
  );
  const [dicePool, setDicePool] = useState(initialDicePool);

  const updateFormData = useCallback(
    (newData) => {
      setFormData(newData);
      onFormDataChange?.(newData);
    },
    [onFormDataChange]
  );

  const updateRollAssignments = useCallback(
    (newData) => {
      setRollAssignments(newData);
      onRollAssignmentsChange?.(newData);
    },
    [onRollAssignmentsChange]
  );

  const updateDicePool = useCallback(
    (newData) => {
      setDicePool(newData);
      onDicePoolChange?.(newData);
    },
    [onDicePoolChange]
  );

  const updateActivity = useCallback(
    (index, field, value) => {
      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          activities: prevFormData.activities.map((activity, i) =>
            i === index ? { ...activity, [field]: value } : activity
          ),
        };
        onFormDataChange?.(newFormData);
        return newFormData;
      });
    },
    [onFormDataChange]
  );

  const updateActivitySuccess = useCallback(
    (index, successIndex) => {
      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          activities: prevFormData.activities.map((activity, i) =>
            i === index
              ? {
                  ...activity,
                  successes: activity.successes.map((s, si) =>
                    si === successIndex ? !s : s
                  ),
                }
              : activity
          ),
        };
        onFormDataChange?.(newFormData);
        return newFormData;
      });
    },
    [onFormDataChange]
  );

  const updateNPCEncounter = useCallback(
    (index, field, value) => {
      if (!canEdit()) return;
      setFormData((prevFormData) => {
        const currentNpcEncounters = prevFormData.npcEncounters || [
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
        ];

        const newFormData = {
          ...prevFormData,
          npcEncounters: currentNpcEncounters.map((npc, i) =>
            i === index ? { ...npc, [field]: value } : npc
          ),
        };
        onFormDataChange?.(newFormData);
        return newFormData;
      });
    },
    [onFormDataChange, canEdit]
  );

  const updateNPCSuccess = useCallback(
    (index, successIndex) => {
      setFormData((prevFormData) => {
        const currentNpcEncounters = prevFormData.npcEncounters || [
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
        ];

        const newFormData = {
          ...prevFormData,
          npcEncounters: currentNpcEncounters.map((npc, i) =>
            i === index
              ? {
                  ...npc,
                  successes: npc.successes.map((s, si) =>
                    si === successIndex ? !s : s
                  ),
                }
              : npc
          ),
        };
        onFormDataChange?.(newFormData);
        return newFormData;
      });
    },
    [onFormDataChange]
  );

  const updateRollAssignment = useCallback(
    (assignmentKey, field, value) => {
      if (!canEdit()) return;

      setRollAssignments((prevAssignments) => {
        const currentValue = prevAssignments[assignmentKey]?.[field];
        if (currentValue === value) return prevAssignments;

        const newAssignments = {
          ...prevAssignments,
          [assignmentKey]: {
            ...prevAssignments[assignmentKey],
            [field]: value,
          },
        };
        onRollAssignmentsChange?.(newAssignments);
        return newAssignments;
      });
    },
    [onRollAssignmentsChange, canEdit]
  );

  const value = useMemo(
    () => ({
      formData,
      rollAssignments,
      dicePool,
      selectedCharacter,
      setFormData: updateFormData,
      setRollAssignments: updateRollAssignments,
      setDicePool: updateDicePool,
      updateActivity,
      updateActivitySuccess,
      updateNPCEncounter,
      updateNPCSuccess,
      updateRollAssignment,
      assignDice,
      unassignDice,
      getDiceUsage,
      getSortedDiceOptions,
      canEdit,
    }),
    [rollAssignments, dicePool, selectedCharacter]
  );

  return (
    <DowntimeContext.Provider value={value}>
      {children}
    </DowntimeContext.Provider>
  );
};
