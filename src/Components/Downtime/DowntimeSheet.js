import { useState } from "react";
import * as XLSX from "xlsx";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";

const DowntimeSheet = () => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  const availableActivities = [
    "",
    "Gain a Job - Roll Persuasion or an appropriate skill check (e.g., Magical Creatures at the Magical Menagerie)",
    "Promotion - If already employed, students can attempt a promotion with Persuasion or an appropriate skill check.",
    "Work Job - Roll to determine earnings based on job difficulty.",
    "Shopping - Purchase items from the shopping list. No haggling.",
    "Selling - Sell items at half their original price. No haggling.",
    "Allowance - Roll based on family wealth to determine allowance received.",
    "Explore the Castle - Roll Investigation to uncover new locations and secrets.",
    "Explore the Forbidden Forest -  Requires Stealth and Investigation rolls.",
    "Restricted Section - Requires Stealth and Investigation rolls.",
    "Search for Magical Creatures - Roll Magical Creatures.",
    "Search for Plants - Roll Herbology.",
    "Stealing - Roll Sleight of Hand and Investigation.",
    "Spread Rumors - Roll Deception, Intimidation, Performance, or Persuasion.",
    "Dig for Dirt - Roll Investigation, Insight, Intimidation, or Persuasion.",
    "Prank Other Students - Players can attempt mischievous acts.",
    "Increase an Ability Score - Must succeed on three separate checks using separate downtime slots.",
    "Gain Proficiency or Expertise - Must succeed on three separate checks using separate downtime slots.",
    "Increase Wand Stat - Roll against a DC based on the current Wand Stat.",
    "Research Spells - Roll History of Magic to research a spell.",
    "Attempt a Spell - Practice casting any spell previously researched or attempted.",
    "Create a Spell - Must succeed on three separate checks using separate downtime slots.",
    "Studying - Improve performance in classes through focused study.",
    "Research a Topic - Roll Investigation to gather information.",
    "Craft Items - Roll with the appropriate tool proficiency.",
    "Brew a Potion - Requires Proficiency with a Potioneer's Kit and a Potion Making check.",
    "Invent a Potion - Must succeed on three separate checks using separate downtime slots.",
    "Cooking - Roll Survival to prepare meals.",
    "Learn a Recipe - Roll Survival to memorize a recipe.",
    "Create a New Recipe - Must succeed on three separate checks using separate downtime slots.",
    "Engineer Plants - Must succeed on three separate checks using separate downtime slots.",
    "Hire a Tutor - Seek out private instruction.",
    "Teacher Tutor - Receive guidance from a professor.",
    "Animagus Form (RP) - Engage in roleplay to explore an Animagus transformation.",
  ];

  const [formData, setFormData] = useState({
    name: "",
    years: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    },
    semesters: {
      1: false,
      2: false,
    },
    subjects: {
      Transfiguration: "",
      DADA: "",
      Charms: "",
      "History of Magic": "",
      Herbology: "",
      "Magical Theory": "",
      Potions: "",
      Astronomy: "",
      "Field Studies": "",
      Divinations: "",
      Arithmancy: "",
      "Ancient Studies": "",
      "Ancient Runes": "",
      "Magical Creatures": "",
      "Muggle Studies": "",
      Alchemy: "",
      Xylomancy: "",
      "Ghoul Studies": "",
    },
    activities: [
      { activity: "", npc: "", successes: [false, false, false, false, false] },
      { activity: "", npc: "", successes: [false, false, false, false, false] },
      { activity: "", npc: "", successes: [false, false, false, false, false] },
    ],
    extraActivity: {
      activity: "",
      npc: "",
      successes: [false, false, false, false, false],
    },
    magicSchoolChoices: {
      Transfiguration: false,
      Charms: false,
      DADA: false,
      Potions: false,
      Herbology: false,
    },
  });

  const updateYearCheck = (year) => {
    setFormData((prev) => ({
      ...prev,
      years: { ...prev.years, [year]: !prev.years[year] },
    }));
  };

  const updateSemesterCheck = (semester) => {
    setFormData((prev) => ({
      ...prev,
      semesters: { ...prev.semesters, [semester]: !prev.semesters[semester] },
    }));
  };

  const updateSubjectGrade = (subject, grade) => {
    setFormData((prev) => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: grade },
    }));
  };

  const updateActivity = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity, i) =>
        i === index ? { ...activity, [field]: value } : activity
      ),
    }));
  };

  const updateActivitySuccess = (index, successIndex) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity, i) =>
        i === index
          ? {
              ...activity,
              successes: activity.successes.map((success, si) =>
                si === successIndex ? !success : success
              ),
            }
          : activity
      ),
    }));
  };

  const updateExtraActivity = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      extraActivity: { ...prev.extraActivity, [field]: value },
    }));
  };

  const updateExtraSuccess = (successIndex) => {
    setFormData((prev) => ({
      ...prev,
      extraActivity: {
        ...prev.extraActivity,
        successes: prev.extraActivity.successes.map((success, si) =>
          si === successIndex ? !success : success
        ),
      },
    }));
  };

  const updateMagicSchoolChoice = (school) => {
    setFormData((prev) => ({
      ...prev,
      magicSchoolChoices: {
        ...prev.magicSchoolChoices,
        [school]: !prev.magicSchoolChoices[school],
      },
    }));
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsData = [
      [
        "Name: " + formData.name,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Grades",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],

      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],

      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Transfiguration",
        formData.subjects["Transfiguration"],
        "",
        "",
        "",
        "",
        "Potions",
        formData.subjects["Potions"],
        "",
        "",
        "",
        "",
        "Ancient Runes",
        formData.subjects["Ancient Runes"],
        "",
        "",
        "",
        "",
      ],

      [
        "Year:",
        "",
        "",
        formData.years[1] ? "1" : "",
        formData.years[2] ? "2" : "",
        formData.years[3] ? "3" : "",
        formData.years[4] ? "4" : "",
        formData.years[5] ? "5" : "",
        formData.years[6] ? "6" : "",
        formData.years[7] ? "7" : "",
        "",
        "",
        "DADA",
        formData.subjects["DADA"],
        "",
        "",
        "",
        "",
        "Astronomy",
        formData.subjects["Astronomy"],
        "",
        "",
        "",
        "",
        "Magical Creatures",
        formData.subjects["Magical Creatures"],
        "",
        "",
        "",
        "",
      ],

      [
        "",
        "",
        "",
        formData.years[1] ? "X" : "",
        formData.years[2] ? "X" : "",
        formData.years[3] ? "X" : "",
        formData.years[4] ? "X" : "",
        formData.years[5] ? "X" : "",
        formData.years[6] ? "X" : "",
        formData.years[7] ? "X" : "",
        "",
        "",
        "Charms",
        formData.subjects["Charms"],
        "",
        "",
        "",
        "",
        "Field Studies",
        formData.subjects["Field Studies"],
        "",
        "",
        "",
        "",
        "Muggle Studies",
        formData.subjects["Muggle Studies"],
        "",
        "",
        "",
        "",
      ],

      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "History of Magic",
        formData.subjects["History of Magic"],
        "",
        "",
        "",
        "",
        "Divinations",
        formData.subjects["Divinations"],
        "",
        "",
        "",
        "",
        "Alchemy",
        formData.subjects["Alchemy"],
        "",
        "",
        "",
        "",
      ],
      [
        "Semester:",
        "",
        "",
        "",
        "",
        formData.semesters[1] ? "1" : "",
        formData.semesters[2] ? "2" : "",
        "",
        "",
        "",
        "",
        "",
        "Herbology",
        formData.subjects["Herbology"],
        "",
        "",
        "",
        "",
        "Arithmancy",
        formData.subjects["Arithmancy"],
        "",
        "",
        "",
        "",
        "Xylomancy",
        formData.subjects["Xylomancy"],
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        formData.semesters[1] ? "X" : "",
        formData.semesters[2] ? "X" : "",
        "",
        "",
        "",
        "",
        "",
        "Magical Theory",
        formData.subjects["Magical Theory"],
        "",
        "",
        "",
        "",
        "Ancient Studies",
        formData.subjects["Ancient Studies"],
        "",
        "",
        "",
        "",
        "Ghoul Studies",
        formData.subjects["Ghoul Studies"],
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Downtime Activities",
        "",
        "Activity: " + (formData.activities[0]?.activity || ""),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Relationship Activities",
        "",
        "NPC: " + (formData.activities[0]?.npc || ""),
        "",
        "",
        "",
        "",
        "Successes:",
        "",
        "",
        formData.activities[0]?.successes[0] ? "X" : "",
        formData.activities[0]?.successes[1] ? "X" : "",
        formData.activities[0]?.successes[2] ? "X" : "",
        formData.activities[0]?.successes[3] ? "X" : "",
        formData.activities[0]?.successes[4] ? "X" : "",
      ],
    ];

    for (let i = 1; i < formData.activities.length; i++) {
      const activity = formData.activities[i];
      wsData.push([
        "",
        "",
        "Activity: " + (activity.activity || ""),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "NPC: " + (activity.npc || ""),
        "",
        "",
        "",
        "",
        "Successes:",
        "",
        "",
        activity.successes[0] ? "X" : "",
        activity.successes[1] ? "X" : "",
        activity.successes[2] ? "X" : "",
        activity.successes[3] ? "X" : "",
        activity.successes[4] ? "X" : "",
      ]);
    }
    wsData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    wsData.push([
      "Extra Downtime",
      "",
      "Activity: " + (formData.extraActivity.activity || ""),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Extra Relationship",
      "",
      "NPC: " + (formData.extraActivity.npc || ""),
      "",
      "",
      "",
      "",
      "Successes:",
      "",
      "",
      formData.extraActivity.successes[0] ? "X" : "",
      formData.extraActivity.successes[1] ? "X" : "",
      formData.extraActivity.successes[2] ? "X" : "",
      formData.extraActivity.successes[3] ? "X" : "",
      formData.extraActivity.successes[4] ? "X" : "",
    ]);

    wsData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    wsData.push([
      "Magic School Increase",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    wsData.push([
      "Transfiguration",
      "",
      "Charms",
      "",
      "DADA",
      "",
      "Potions",
      "",
      "Herbology",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    wsData.push([
      formData.magicSchoolChoices.Transfiguration ? "X" : "",
      "",
      formData.magicSchoolChoices.Charms ? "X" : "",
      "",
      formData.magicSchoolChoices.DADA ? "X" : "",
      "",
      formData.magicSchoolChoices.Potions ? "X" : "",
      "",
      formData.magicSchoolChoices.Herbology ? "X" : "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = [
      { wch: 1.5 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 2.75 },
      { wch: 1.5 },
    ];

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${
      formData.name || "Character"
    }_Downtime_${timestamp}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, "Downtime Sheet");

    XLSX.writeFile(wb, filename);
  };

  const subjects = [
    [
      "Transfiguration",
      "DADA",
      "Charms",
      "History of Magic",
      "Herbology",
      "Magical Theory",
    ],
    [
      "Potions",
      "Astronomy",
      "Field Studies",
      "Divinations",
      "Arithmancy",
      "Ancient Studies",
    ],
    [
      "Ancient Runes",
      "Magical Creatures",
      "Muggle Studies",
      "Alchemy",
      "Xylomancy",
      "Ghoul Studies",
    ],
  ];

  return (
    <div style={styles.container}>
      <button onClick={exportToExcel} style={styles.exportButton}>
        📥 Download Excel File
      </button>

      <div style={styles.sheet}>
        <div style={styles.headerSection}>
          <div style={styles.nameSection}>
            <label>
              <strong>Name: </strong>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                style={{ ...styles.input, marginLeft: "8px" }}
                placeholder="Character Name"
              />
            </label>
          </div>
          <div style={styles.typeSection}>
            <div style={styles.checkboxRow}>
              <strong>Year:</strong>
              {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                <label
                  key={year}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span>{year}</span>
                  <input
                    type="checkbox"
                    checked={formData.years[year]}
                    onChange={() => updateYearCheck(year)}
                    style={styles.checkbox}
                  />
                </label>
              ))}
            </div>
            <div style={{ ...styles.checkboxRow, marginTop: "8px" }}>
              <strong>Semester:</strong>
              {[1, 2].map((semester) => (
                <label
                  key={semester}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span>{semester}</span>
                  <input
                    type="checkbox"
                    checked={formData.semesters[semester]}
                    onChange={() => updateSemesterCheck(semester)}
                    style={styles.checkbox}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.gradesSection}>Grades</div>

        <div style={styles.subjectsGrid}>
          {subjects.map((column, columnIndex) => (
            <div
              key={columnIndex}
              style={
                columnIndex < 2
                  ? { borderRight: `2px solid ${theme.border}` }
                  : {}
              }
            >
              {column.map((subject) => (
                <div key={subject} style={styles.subjectItem}>
                  <span>{subject}</span>
                  <input
                    type="text"
                    value={formData.subjects[subject]}
                    onChange={(e) =>
                      updateSubjectGrade(subject, e.target.value)
                    }
                    style={styles.gradeInput}
                    placeholder="Grade"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <strong>Downtime Activities</strong>
          </div>

          {formData.activities.map((activity, index) => (
            <div key={index} style={styles.activityRow}>
              <strong>Activity {index + 1}:</strong>
              <select
                value={activity.activity}
                onChange={(e) =>
                  updateActivity(index, "activity", e.target.value)
                }
                style={styles.select}
              >
                {availableActivities.map((activityOption) => (
                  <option key={activityOption} value={activityOption}>
                    {activityOption || "Select an activity..."}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <strong>Relationship Activities</strong>
          </div>

          {formData.activities.map((activity, index) => (
            <div key={index} style={styles.relationshipRow}>
              <strong>NPC {index + 1}:</strong>
              <input
                type="text"
                value={activity.npc}
                onChange={(e) => updateActivity(index, "npc", e.target.value)}
                style={styles.relationshipInput}
                placeholder="NPC name"
              />
              <strong>Successes:</strong>
              <div style={styles.successCheckboxes}>
                {activity.successes.map((success, successIndex) => (
                  <input
                    key={successIndex}
                    type="checkbox"
                    checked={success}
                    onChange={() => updateActivitySuccess(index, successIndex)}
                    style={styles.checkbox}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <strong>Extra Downtime</strong>
          </div>

          <div style={styles.activityRow}>
            <strong>Extra Activity:</strong>
            <select
              value={formData.extraActivity.activity}
              onChange={(e) => updateExtraActivity("activity", e.target.value)}
              style={styles.select}
            >
              {availableActivities.map((activityOption) => (
                <option key={activityOption} value={activityOption}>
                  {activityOption || "Select an activity..."}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <strong>Extra Relationship</strong>
          </div>

          <div style={styles.relationshipRow}>
            <strong>Extra NPC:</strong>
            <input
              type="text"
              value={formData.extraActivity.npc}
              onChange={(e) => updateExtraActivity("npc", e.target.value)}
              style={styles.input}
              placeholder="NPC name"
            />
            <strong>Successes:</strong>
            <div style={styles.successCheckboxes}>
              {formData.extraActivity.successes.map((success, successIndex) => (
                <input
                  key={successIndex}
                  type="checkbox"
                  checked={success}
                  onChange={() => updateExtraSuccess(successIndex)}
                  style={styles.checkbox}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={styles.magicSchoolSection}>
          <div style={styles.sectionTitle}>Magic School Increase</div>
          <div style={styles.radioGroup}>
            {["Transfiguration", "Charms", "DADA", "Potions", "Herbology"].map(
              (school) => (
                <div key={school} style={styles.magicSchoolItem}>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: theme.text,
                    }}
                  >
                    {school}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.magicSchoolChoices[school]}
                    onChange={() => updateMagicSchoolChoice(school)}
                    style={styles.checkbox}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DowntimeSheet;
