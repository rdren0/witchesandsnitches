import { useState } from "react";
import * as XLSX from "xlsx";

const DowntimeSheet = () => {
  // State for form data
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
    magicSchoolChoice: "",
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

  // Add this function to handle extra activity successes
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

  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet data array matching the original structure
    const wsData = [
      // Row 0: Name and Grades header
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

      // Row 1: Empty
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

      // Row 2: Subject headers with grades
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

      // Row 3: Year and more subjects with grades
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

      // Row 4: Year checkboxes and more grades
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

      // Row 5: More subjects with grades
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

      // Row 6: Semester with more grades
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

      // Row 7: Semester checkboxes with final grades
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

      // Row 8: Empty
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

      // Row 9: Activities header
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

    // Add additional activity rows
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

    // Add extra downtime section
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

    // Add magic school section
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
      "Choose one: " + (formData.magicSchoolChoice || ""),
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

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add some basic styling/column widths
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

    // Generate filename with character name and timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${
      formData.name || "Character"
    }_Downtime_${timestamp}.xlsx`;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Downtime Sheet");

    // Write and download the file
    XLSX.writeFile(wb, filename);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      backgroundColor: "#f8f9fa",
    },
    sheet: {
      backgroundColor: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      overflow: "hidden",
    },
    headerSection: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      borderBottom: "2px solid #333",
    },
    nameSection: {
      padding: "12px",
      borderRight: "2px solid #333",
    },
    gradesSection: {
      padding: "12px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "14px",
      backgroundColor: "#e9ecef",
    },
    yearSemesterSection: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      borderBottom: "2px solid #333",
    },
    yearSection: {
      padding: "12px",
      borderRight: "2px solid #333",
    },
    semesterSection: {
      padding: "12px",
    },
    subjectsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      borderBottom: "2px solid #333",
    },
    subjectColumn: {
      borderRight: "2px solid #333",
      "&:last-child": {
        borderRight: "none",
      },
    },
    subjectItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 12px",
      borderBottom: "1px solid #dee2e6",
    },
    activitiesSection: {
      borderBottom: "2px solid #333",
    },
    activityRow: {
      display: "grid",
      gridTemplateColumns: "200px 1fr 150px 1fr 120px 200px",
      alignItems: "center",
      padding: "12px",
      borderBottom: "1px solid #dee2e6",
      gap: "12px",
    },
    activityHeader: {
      backgroundColor: "#e9ecef",
      fontWeight: "bold",
      padding: "12px",
      borderBottom: "2px solid #333",
    },
    input: {
      border: "1px solid #ced4da",
      borderRadius: "4px",
      padding: "4px 8px",
      fontSize: "12px",
      width: "100%",
    },
    gradeInput: {
      border: "1px solid #ced4da",
      borderRadius: "4px",
      padding: "2px 6px",
      fontSize: "11px",
      width: "40px",
      textAlign: "center",
    },
    checkbox: {
      margin: "0 4px",
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap",
    },
    successCheckboxes: {
      display: "flex",
      gap: "4px",
    },
    magicSchoolSection: {
      padding: "16px",
      backgroundColor: "#f8f9fa",
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "8px",
    },
    radioGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    exportButton: {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      marginBottom: "16px",
      transition: "background-color 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    exportButtonHover: {
      backgroundColor: "#218838",
    },
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
      <button
        onClick={exportToExcel}
        style={styles.exportButton}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
      >
        📥 Download Excel File
      </button>

      <div style={styles.sheet}>
        {/* Header Section */}
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
          <div style={styles.gradesSection}>Grades</div>
        </div>

        {/* Year and Semester Section */}
        <div style={styles.yearSemesterSection}>
          <div style={styles.yearSection}>
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
          <div style={styles.semesterSection}>{/* Empty for layout */}</div>
        </div>

        {/* Subjects Grid */}
        <div style={styles.subjectsGrid}>
          {subjects.map((column, columnIndex) => (
            <div
              key={columnIndex}
              style={columnIndex < 2 ? { borderRight: "2px solid #333" } : {}}
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

        {/* Downtime Activities Section */}
        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <div style={styles.activityRow}>
              <strong>Downtime Activities</strong>
              <strong>Activity:</strong>
              <strong>Relationship Activities</strong>
              <strong>NPC:</strong>
              <strong>Successes:</strong>
              <div></div>
            </div>
          </div>

          {formData.activities.map((activity, index) => (
            <div key={index} style={styles.activityRow}>
              <div></div>
              <input
                type="text"
                value={activity.activity}
                onChange={(e) =>
                  updateActivity(index, "activity", e.target.value)
                }
                style={styles.input}
                placeholder="Activity description"
              />
              <div></div>
              <input
                type="text"
                value={activity.npc}
                onChange={(e) => updateActivity(index, "npc", e.target.value)}
                style={styles.input}
                placeholder="NPC name"
              />
              <div></div>
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

        {/* Extra Downtime Section */}
        <div style={styles.activitiesSection}>
          <div style={styles.activityHeader}>
            <div style={styles.activityRow}>
              <strong>Extra Downtime</strong>
              <strong>Activity:</strong>
              <strong>Extra Relationship</strong>
              <strong>NPC:</strong>
              <strong>Successes:</strong>
              <div></div>
            </div>
          </div>

          <div style={styles.activityRow}>
            <div></div>
            <input
              type="text"
              value={formData.extraActivity.activity}
              onChange={(e) => updateExtraActivity("activity", e.target.value)}
              style={styles.input}
              placeholder="Activity description"
            />
            <div></div>
            <input
              type="text"
              value={formData.extraActivity.npc}
              onChange={(e) => updateExtraActivity("npc", e.target.value)}
              style={styles.input}
              placeholder="NPC name"
            />
            <div></div>
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

        {/* Magic School Increase Section */}
        <div style={styles.magicSchoolSection}>
          <div style={styles.sectionTitle}>Magic School Increase</div>
          <div style={styles.radioGroup}>
            <div>Choose one:</div>
            {["Transfiguration", "Charms", "DADA", "Potions", "Herbology"].map(
              (school) => (
                <label
                  key={school}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="radio"
                    name="magicSchool"
                    value={school}
                    checked={formData.magicSchoolChoice === school}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        magicSchoolChoice: e.target.value,
                      }))
                    }
                  />
                  <span>{school}</span>
                </label>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DowntimeSheet;
