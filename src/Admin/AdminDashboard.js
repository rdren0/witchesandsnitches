import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  BarChart3,
  Crown,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";
import { useTheme } from "../contexts/ThemeContext";
import { characterService } from "../services/characterService";

const AdminDashboard = ({ supabase, user }) => {
  const { theme } = useTheme();
  const { isUserAdmin, loadAllUsers } = useAdmin();

  const [activeTab, setActiveTab] = useState("overview");
  // eslint-disable-next-line
  const [_characters, setCharacters] = useState([]);
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCharacters: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalSessions: 0,
  });

  useEffect(() => {
    if (isUserAdmin) {
      loadData();
    }
    // eslint-disable-next-line
  }, [isUserAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      await loadAllUsers();

      const allCharacters = await characterService.getAllCharacters();
      setCharacters(allCharacters);

      const sessionGroups = groupCharactersBySession(allCharacters);
      setGameSessions(sessionGroups);

      const uniqueUsers = new Set(allCharacters.map((c) => c.discord_user_id));
      const uniqueSessions = new Set(
        allCharacters
          .filter((c) => c.game_session && c.game_session.trim() !== "")
          .map((c) => c.game_session)
      );

      setStats({
        totalCharacters: allCharacters.length,
        activeUsers: uniqueUsers.size,
        adminUsers: 0,
        totalSessions: uniqueSessions.size,
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const filteredCharacters = characters.filter((character) => {
  //   if (!searchTerm) return true;

  //   const searchLower = searchTerm.toLowerCase();
  //   return (
  //     character.name?.toLowerCase().includes(searchLower) ||
  //     character.game_session?.toLowerCase().includes(searchLower) ||
  //     character.background?.toLowerCase().includes(searchLower) ||
  //     character.subclass?.toLowerCase().includes(searchLower)
  //   );
  // });

  const groupCharactersBySession = (characters) => {
    const charactersWithSessions = characters.filter(
      (char) =>
        char.game_session &&
        char.game_session.trim() !== "" &&
        char.game_session.toLowerCase() !== "development"
    );

    const grouped = charactersWithSessions.reduce((acc, character) => {
      const sessionName = character.game_session;
      if (!acc[sessionName]) {
        acc[sessionName] = [];
      }
      acc[sessionName].push({
        id: character.id,
        name: character.name,
        level: character.level,
        house: character.house || "No House",
        subclass: character.subclass || "No Subclass",
        background: character.background || "No Background",
        discord_user_id: character.discord_user_id,
        created_at: character.created_at,
      });
      return acc;
    }, {});

    const sessions = Object.entries(grouped).map(
      ([sessionName, sessionCharacters]) => {
        const sortedCharacters = sessionCharacters.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return {
          id: sessionName,
          name: sessionName,
          characters: sortedCharacters,
          characterCount: sessionCharacters.length,
          lastActivity: sortedCharacters[0]?.created_at,
        };
      }
    );

    return sortSessionsByDayOfWeek(sessions);
  };

  const sortSessionsByDayOfWeek = (sessions) => {
    const dayOrder = {
      sunday: 0,
      sun: 0,
      monday: 1,
      mon: 1,
      tuesday: 2,
      tue: 2,
      tues: 2,
      wednesday: 3,
      wed: 3,
      thursday: 4,
      thu: 4,
      thur: 4,
      thurs: 4,
      friday: 5,
      fri: 5,
      saturday: 6,
      sat: 6,
    };

    const getSessionDayOrder = (sessionName) => {
      const lowerName = sessionName.toLowerCase();
      for (const [dayName, order] of Object.entries(dayOrder)) {
        const regex = new RegExp(`\\b${dayName}\\b`, "i");
        if (regex.test(lowerName)) {
          return order;
        }
      }
      return 999;
    };

    return sessions.sort((a, b) => {
      const dayA = getSessionDayOrder(a.name);
      const dayB = getSessionDayOrder(b.name);

      if (dayA !== dayB) {
        return dayA - dayB;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getHouseColor = (house) => {
    const houseColors = {
      Gryffindor: "#740001",
      Slytherin: "#1a472a",
      Ravenclaw: "#0e1a40",
      Hufflepuff: "#ecb939",
      Thunderbird: "#8B5A2B",
      "Horned Serpent": "#1E3A8A",
      Pukwudgie: "#7C2D12",
      Wampus: "#6D28D9",
      Beauxbatons: "#4F8FFF",
      Durmstrang: "#8B0000",
      Uagadou: "#CD853F",
      Mahoutokoro: "#DC143C",
      Castelobruxo: "#228B22",
      Koldovstoretz: "#4682B4",
    };

    if (!house || house === "No House") {
      return theme.textSecondary;
    }

    return houseColors[house] || theme.primary;
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    adminBadge: {
      background: "linear-gradient(135deg, #ffd700, #ffed4e)",
      color: "#8b4513",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    tabs: {
      display: "flex",
      marginBottom: "20px",
      borderBottom: `1px solid ${theme.border}`,
    },
    tab: {
      padding: "12px 24px",
      border: "none",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      cursor: "pointer",
      borderBottom: "2px solid transparent",
      transition: "all 0.2s ease",
    },
    activeTab: {
      color: theme.primary,
      borderBottomColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    content: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${theme.border}`,
    },
    searchContainer: {
      position: "relative",
      marginBottom: "20px",
      maxWidth: "400px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 40px 12px 40px",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s ease",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textSecondary,
    },
    clearButton: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "2px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    searchResultsCount: {
      color: theme.textSecondary,
      fontSize: "14px",
      marginBottom: "12px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      backgroundColor: theme.background,
      padding: "20px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    sessionGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "24px",
      marginTop: "20px",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    sessionCard: {
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
      padding: "20px",
      transition: "all 0.2s ease",
      cursor: "pointer",
      width: "540px",
      minHeight: "600px",
    },
    sessionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    sessionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
    },
    sessionMeta: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: theme.textSecondary,
      fontSize: "14px",
      marginBottom: "16px",
    },
    charactersList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    characterItem: {
      display: "grid",
      gridTemplateColumns:
        "minmax(120px, 2fr) 50px 80px minmax(120px, 1.5fr) minmax(120px, 1.2fr)",
      alignItems: "center",
      padding: "8px 12px",
      backgroundColor: theme.surface,
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      fontSize: "14px",
    },
    characterName: {
      fontWeight: "600",
      color: theme.text,
      textAlign: "left",
      fontSize: ".75rem",
    },
    characterLevel: {
      color: theme.primary,
      fontWeight: "500",
      textAlign: "center",
      fontSize: ".75rem",
    },
    characterHouse: {
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: ".5rem",
      fontWeight: "500",
      color: "white",
      textAlign: "center",
      justifySelf: "center",
    },
    characterSubclass: {
      color: theme.textSecondary,
      textAlign: "center",
      fontSize: ".8rem",
    },
    characterBackground: {
      color: theme.textSecondary,
      textAlign: "center",
      fontSize: ".6rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: theme.background,
      borderRadius: "8px",
      overflow: "hidden",
      tableLayout: "fixed",
    },
    tableHeader: {
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
    },
    tableRow: {
      borderBottom: `1px solid ${theme.border}`,
    },
    tableCell: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
    },

    nameColumn: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
      width: "150px",
      minWidth: "120px",
    },
    levelColumn: {
      padding: "12px 16px",
      textAlign: "center",
      color: theme.text,
      width: "50px",
    },
    classColumn: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
      width: "140px",
    },
    hpColumn: {
      padding: "12px 16px",
      textAlign: "center",
      color: theme.text,
      width: "80px",
    },
    sessionColumn: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
      width: "140px",
      minWidth: "120px",
    },
    backgroundColumn: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
      width: "130px",
    },
    subclassColumn: {
      padding: "12px 16px",
      textAlign: "left",
      color: theme.text,
      width: "120px",
    },
    actionsColumn: {
      padding: "12px 16px",
      textAlign: "center",
      color: theme.text,
      width: "200px",
    },
    actionButton: {
      padding: "6px 12px",
      margin: "0 4px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    viewButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
    editButton: {
      backgroundColor: "#10b981",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    roleSelect: {
      padding: "4px 8px",
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "12px",
    },
  };

  const renderOverview = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalCharacters}</div>
          <div style={styles.statLabel}>Total Characters</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.activeUsers}</div>
          <div style={styles.statLabel}>Active Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalSessions}</div>
          <div style={styles.statLabel}>Game Sessions</div>
        </div>
      </div>

      <h3 style={{ color: theme.text, marginBottom: "16px" }}>Game Sessions</h3>

      <div style={styles.sessionGrid}>
        {gameSessions.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: theme.textSecondary,
              backgroundColor: theme.background,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            No game sessions found. Characters need to have a game_session value
            to appear here.
          </div>
        ) : (
          gameSessions.map((session) => (
            <div key={session.id} style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <div style={styles.sessionTitle}>{session.name}</div>
                <div style={styles.sessionMeta}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Users size={14} />
                    {session.characterCount} Characters
                  </span>
                  {session.lastActivity && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={14} />
                      Last:{" "}
                      {new Date(session.lastActivity).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={styles.charactersList}>
                {/* FIXED: Updated header row to use consistent grid */}
                <div
                  style={{
                    ...styles.characterItem,
                    backgroundColor: theme.primary + "10",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: theme.textSecondary,
                  }}
                >
                  <span style={{ textAlign: "left" }}>Name</span>
                  <span style={{ textAlign: "center" }}>Level</span>
                  <span style={{ textAlign: "center" }}>House</span>
                  <span style={{ textAlign: "center" }}>Subclass</span>
                  <span style={{ textAlign: "center" }}>Background</span>
                </div>

                {session.characters.map((character) => (
                  <div key={character.id} style={styles.characterItem}>
                    <span style={styles.characterName}>{character.name}</span>
                    <span style={styles.characterLevel}>
                      Lv. {character.level}
                    </span>
                    <span
                      style={{
                        ...styles.characterHouse,
                        backgroundColor: getHouseColor(character.house),
                      }}
                    >
                      {character.house}
                    </span>
                    <span style={styles.characterSubclass}>
                      {character.subclass}
                    </span>
                    <span style={styles.characterBackground}>
                      {character.background}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // const renderCharacterManagement = () => (
  //   <div>
  //     <h3 style={{ color: theme.text, marginBottom: "16px" }}>
  //       All Characters
  //     </h3>

  //     {/* Search Input */}
  //     <div style={styles.searchContainer}>
  //       <Search size={16} style={styles.searchIcon} />
  //       <input
  //         type="text"
  //         placeholder="Search by name, game session, background, or subclass..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         style={{
  //           ...styles.searchInput,
  //           borderColor: searchTerm ? theme.primary : theme.border,
  //         }}
  //       />
  //       {searchTerm && (
  //         <button
  //           style={{
  //             ...styles.clearButton,
  //             ":hover": {
  //               backgroundColor: theme.surface,
  //               color: theme.text,
  //             },
  //           }}
  //           onClick={() => setSearchTerm("")}
  //           title="Clear search"
  //         >
  //           <X size={14} />
  //         </button>
  //       )}
  //     </div>

  //     {/* Search Results Count */}
  //     {searchTerm && (
  //       <div style={styles.searchResultsCount}>
  //         Showing {filteredCharacters.length} of {characters.length} characters
  //         {searchTerm && ` matching "${searchTerm}"`}
  //       </div>
  //     )}

  //     <table style={styles.table}>
  //       <thead style={styles.tableHeader}>
  //         <tr>
  //           <th style={styles.nameColumn}>Name</th>
  //           <th style={styles.levelColumn}>Level</th>
  //           <th style={styles.sessionColumn}>Game Session</th>
  //           <th style={styles.classColumn}>Class</th>
  //           <th style={styles.backgroundColumn}>Background</th>
  //           <th style={styles.subclassColumn}>Subclass</th>
  //           <th style={styles.actionsColumn}>Actions</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {filteredCharacters.map((character) => (
  //           <tr key={character.id} style={styles.tableRow}>
  //             <td style={styles.nameColumn}>{character.name}</td>
  //             <td style={styles.levelColumn}>{character.level}</td>
  //             <td style={styles.sessionColumn}>
  //               {character.game_session || "No Session"}
  //             </td>
  //             <td style={styles.classColumn}>{character.casting_style}</td>
  //             <td style={styles.backgroundColumn}>
  //               {character.background || "No Background"}
  //             </td>
  //             <td style={styles.subclassColumn}>
  //               {character.subclass || "No Subclass"}
  //             </td>

  //             <td style={styles.actionsColumn}>
  //               <button
  //                 style={{ ...styles.actionButton, ...styles.viewButton }}
  //               >
  //                 View
  //               </button>
  //               <button
  //                 style={{ ...styles.actionButton, ...styles.editButton }}
  //               >
  //                 Edit
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {/* No Results Message */}
  //     {searchTerm && filteredCharacters.length === 0 && (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           padding: "40px",
  //           color: theme.textSecondary,
  //           backgroundColor: theme.background,
  //           borderRadius: "8px",
  //           border: `1px solid ${theme.border}`,
  //           marginTop: "20px",
  //         }}
  //       >
  //         No characters found matching "{searchTerm}". Try adjusting your search
  //         terms.
  //       </div>
  //     )}
  //   </div>
  // );

  if (!isUserAdmin) {
    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.content,
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <AlertTriangle
            size={48}
            color={theme.warning}
            style={{ marginBottom: "20px" }}
          />
          <h2 style={{ color: theme.text, marginBottom: "12px" }}>
            Access Denied
          </h2>
          <p style={{ color: theme.textSecondary }}>
            You need administrator privileges to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <Shield size={32} color={theme.primary} />
          Admin Dashboard
          <div style={styles.adminBadge}>
            <Crown size={14} />
            ADMIN
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        {[
          { key: "overview", label: "Overview", icon: BarChart3 },
          // { key: "characters", label: "Characters", icon: UserCheck },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            style={{
              ...styles.tab,
              ...(activeTab === key ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} style={{ marginRight: "8px" }} />
            {label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: theme.textSecondary,
            }}
          >
            Loading admin data...
          </div>
        ) : (
          <>
            {activeTab === "overview" && renderOverview()}
            {/* {activeTab === "characters" && renderCharacterManagement()} */}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
