import { spellsData } from "../../../SharedData/spells";
import { getSpellModifier } from "../../SpellBook/utils";

export const calculateResearchDC = (
  playerYear,
  spellYear,
  spellName,
  selectedCharacter
) => {
  let baseDC = 8 + 2 * spellYear;

  if (spellYear > playerYear) {
    baseDC += (spellYear - playerYear) * 2;
  }

  const difficultSpells = [
    "Abscondi",
    "Pellucidi Pellis",
    "Sagittario",
    "Confringo",
    "Devicto",
    "Stupefy",
    "Petrificus Totalus",
    "Protego",
    "Protego Maxima",
    "Finite Incantatem",
    "Confundo",
    "Bombarda",
    "Episkey",
    "Expelliarmus",
    "Incarcerous",
  ];

  if (difficultSpells.includes(spellName)) {
    baseDC += 3;
  }

  return Math.max(5, baseDC);
};

export const getSpellData = (spellName) => {
  if (!spellName) return null;

  for (const [subject, subjectData] of Object.entries(spellsData)) {
    if (subjectData.levels) {
      for (const [, levelSpells] of Object.entries(subjectData.levels)) {
        const spell = levelSpells.find((s) => s.name === spellName);
        if (spell) {
          return {
            ...spell,
            subject: subject,
          };
        }
      }
    }
  }
  return null;
};

export const updateSpellProgressSummary = async (
  spellName,
  isSuccess,
  isNaturalTwenty = false,
  isResearch = false,
  selectedCharacter,
  user,
  supabase
) => {
  if (!selectedCharacter || !user?.user_metadata?.provider_id) return;

  const characterOwnerDiscordId = user.user_metadata.provider_id;

  try {
    const { data: existingProgress, error: fetchError } = await supabase
      .from("spell_progress_summary")
      .select("*")
      .eq("character_id", selectedCharacter.id)
      .eq("discord_user_id", characterOwnerDiscordId)
      .eq("spell_name", spellName)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching spell progress:", fetchError);
      return;
    }

    if (existingProgress) {
      const currentAttempts = existingProgress.successful_attempts || 0;

      let newAttempts = currentAttempts;
      if (!isResearch) {
        newAttempts = isNaturalTwenty
          ? 2
          : Math.min(currentAttempts + (isSuccess ? 1 : 0), 2);
      }

      const updateData = {
        successful_attempts: newAttempts,
        has_natural_twenty:
          existingProgress.has_natural_twenty ||
          (isNaturalTwenty && !isResearch),
        has_failed_attempt:
          existingProgress.has_failed_attempt || (!isSuccess && !isResearch),
        researched: existingProgress.researched || (isResearch && isSuccess),
      };

      const { error: updateError } = await supabase
        .from("spell_progress_summary")
        .update(updateData)
        .eq("id", existingProgress.id);

      if (updateError) {
        console.error("Error updating spell progress:", updateError);
      }
    } else {
      const insertData = {
        character_id: selectedCharacter.id,
        discord_user_id: characterOwnerDiscordId,
        spell_name: spellName,

        successful_attempts:
          !isResearch && isSuccess ? (isNaturalTwenty ? 2 : 1) : 0,
        has_natural_twenty: isNaturalTwenty && !isResearch,
        has_failed_attempt: !isSuccess && !isResearch,
        researched: isResearch && isSuccess,
      };

      const { error: insertError } = await supabase
        .from("spell_progress_summary")
        .insert([insertData]);

      if (insertError) {
        console.error("Error inserting spell progress:", insertError);
      }
    }
  } catch (error) {
    console.error("Error updating spell progress summary:", error);
  }
};

export const updateSpellProgressOnSubmission = async (
  formData,
  rollAssignments,
  selectedSpells,
  dicePool,
  selectedCharacter,
  user,
  supabase
) => {
  try {
    for (let i = 0; i < formData.activities.length; i++) {
      const activity = formData.activities[i];
      const activityKey = `activity${i + 1}`;
      const assignment = rollAssignments[activityKey];
      const spellSelections = selectedSpells[activityKey];

      if (
        !spellSelections ||
        (!spellSelections.first && !spellSelections.second)
      ) {
        continue;
      }

      const isAttemptActivity = activity.activity
        ?.toLowerCase()
        .includes("attempt spells");
      const isResearchActivity = activity.activity
        ?.toLowerCase()
        .includes("research spells");

      if (!isAttemptActivity && !isResearchActivity) {
        continue;
      }

      for (const spellSlot of ["first", "second"]) {
        const spellName = spellSelections[spellSlot];
        if (!spellName) continue;

        const diceField =
          spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";
        const diceIndex = assignment[diceField];

        if (diceIndex === null || diceIndex === undefined) continue;

        const diceValue = dicePool[diceIndex];
        if (!diceValue) continue;

        const spellData = getSpellData(spellName);
        if (!spellData) continue;

        const modifier = getSpellModifier(
          spellName,
          spellData.subject,
          selectedCharacter
        );
        const total = diceValue + modifier;

        let dc, isSuccess;
        if (isResearchActivity) {
          const playerYear = selectedCharacter.year || 1;
          const spellYear = spellData.year || 1;
          dc = calculateResearchDC(
            playerYear,
            spellYear,
            spellName,
            selectedCharacter
          );
          isSuccess = total >= dc;
        } else {
          const playerYear = selectedCharacter.year || 1;
          const spellYear = spellData.year || 1;
          dc = 8 + 2 * spellYear;
          if (spellYear > playerYear) {
            dc += (spellYear - playerYear) * 2;
          }
          dc = Math.max(5, dc);
          isSuccess = total >= dc;
        }

        const isNaturalTwenty = diceValue === 20;

        await updateSpellProgressSummary(
          spellName,
          isSuccess,
          isNaturalTwenty,
          isResearchActivity,
          selectedCharacter,
          user,
          supabase
        );
      }
    }
  } catch (error) {
    console.error("Error updating spell progress on submission:", error);
  }
};

export const loadSpellProgress = async (selectedCharacter, user, supabase) => {
  try {
    const { data, error } = await supabase
      .from("spell_progress_summary")
      .select("spell_name, successful_attempts, researched, has_failed_attempt")
      .eq("character_id", selectedCharacter.id)
      .eq("discord_user_id", user.user_metadata.provider_id);

    if (error) {
      console.error("Error loading spell progress:", error);
      return { attempts: {}, researched: {}, failed: {} };
    }

    const attempts = {};
    const researched = {};
    const failed = {};
    data.forEach((progress) => {
      attempts[progress.spell_name] = progress.successful_attempts || 0;
      researched[progress.spell_name] = progress.researched || false;
      failed[progress.spell_name] = progress.has_failed_attempt || 0;
    });

    return { attempts, researched, failed };
  } catch (error) {
    console.error("Error loading spell progress:", error);
    return { attempts: {}, researched: {}, failed: {} };
  }
};

export const updateMakeSpellProgress = async (
  activity,
  isSuccess,
  isNaturalTwenty = false
) => {
  const currentProgress = activity.currentSuccesses || 0;

  if (isSuccess) {
    const newProgress = Math.min(currentProgress + 1, 3);

    const updatedActivity = {
      ...activity,
      currentSuccesses: newProgress,
      lastCheckType: [
        "Magical Theory",
        "Wand Modifier",
        "Spellcasting Ability",
      ][currentProgress],
      lastCheckResult: {
        success: true,
        isNaturalTwenty,
        timestamp: new Date().toISOString(),
      },
    };

    if (newProgress >= 3) {
      updatedActivity.completed = true;
      updatedActivity.completedAt = new Date().toISOString();
    }

    return updatedActivity;
  } else {
    const updatedActivity = {
      ...activity,
      lastCheckType: [
        "Magical Theory",
        "Wand Modifier",
        "Spellcasting Ability",
      ][currentProgress],
      lastCheckResult: {
        success: false,
        isNaturalTwenty,
        timestamp: new Date().toISOString(),
      },
    };

    return updatedActivity;
  }
};
