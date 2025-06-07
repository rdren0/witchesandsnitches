const AdminPanel = () => {
  const [archivedCharacters, setArchivedCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadArchived = async () => {
    setLoading(true);
    try {
      const archived = await characterService.getArchivedCharacters();
      setArchivedCharacters(archived);
    } catch (error) {
      console.error("Error loading archived characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (characterId, discordUserId, characterName) => {
    if (window.confirm(`Restore character "${characterName}"?`)) {
      try {
        await characterService.restoreCharacter(characterId, discordUserId);
        loadArchived(); // Refresh the list
        alert("Character restored successfully!");
      } catch (error) {
        console.error("Error restoring character:", error);
        alert("Failed to restore character");
      }
    }
  };

  useEffect(() => {
    loadArchived();
  }, []);

  if (loading) return <div>Loading archived characters...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Archived Characters (Admin Panel)</h2>
      <button onClick={loadArchived} style={{ marginBottom: "20px" }}>
        Refresh List
      </button>

      {archivedCharacters.length === 0 ? (
        <p>No archived characters found.</p>
      ) : (
        <div>
          {archivedCharacters.map((char) => (
            <div
              key={char.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
              }}
            >
              <div>
                <strong>{char.name}</strong> - Level {char.level}{" "}
                {char.casting_style}
              </div>
              <div>
                User: {char.discord_user_id} | Archived:{" "}
                {new Date(char.archived_at).toLocaleDateString()}
              </div>
              <div>
                House: {char.house} | Session: {char.game_session || "None"}
              </div>
              <button
                onClick={() =>
                  handleRestore(char.id, char.discord_user_id, char.name)
                }
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Restore Character
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
