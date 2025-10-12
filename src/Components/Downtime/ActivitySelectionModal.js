import React, { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { downtime } from "../../SharedData/downtime";

const ActivitySelectionModal = ({ isOpen, onClose, onSelect, currentActivity, theme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter activities based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery && !selectedCategory) {
      return Object.entries(downtime);
    }

    return Object.entries(downtime)
      .map(([key, category]) => {
        const filteredActivities = category.activities.filter((activity) =>
          activity.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return [key, { ...category, activities: filteredActivities }];
      })
      .filter(([key, category]) => {
        if (selectedCategory && key !== selectedCategory) return false;
        return category.activities.length > 0;
      });
  }, [searchQuery, selectedCategory]);

  const handleSelect = (activity) => {
    onSelect(activity);
    onClose();
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const getActivityMainName = (activityText) => {
    return activityText.split(" - ")[0];
  };

  const getActivityDetails = (activityText) => {
    const parts = activityText.split(" - ");
    return parts.length > 1 ? parts[1] : "";
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.background,
          borderRadius: "12px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `2px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <h2 style={{ margin: 0, color: theme.text, fontSize: "24px", fontWeight: "600" }}>
            Select Downtime Activity
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: theme.textSecondary,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.error + "20";
              e.currentTarget.style.color = theme.error;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.textSecondary;
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px 24px", backgroundColor: theme.surface }}>
          <div style={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.textSecondary,
              }}
            />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                color: theme.text,
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: theme.surface,
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: "6px 14px",
              backgroundColor: !selectedCategory ? theme.primary : theme.background,
              color: !selectedCategory ? "white" : theme.text,
              border: `1px solid ${!selectedCategory ? theme.primary : theme.border}`,
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            All Categories
          </button>
          {Object.entries(downtime).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: "6px 14px",
                backgroundColor: selectedCategory === key ? theme.primary : theme.background,
                color: selectedCategory === key ? "white" : theme.text,
                border: `1px solid ${selectedCategory === key ? theme.primary : theme.border}`,
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== key) {
                  e.currentTarget.style.backgroundColor = theme.primary + "20";
                  e.currentTarget.style.borderColor = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== key) {
                  e.currentTarget.style.backgroundColor = theme.background;
                  e.currentTarget.style.borderColor = theme.border;
                }
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
          }}
        >
          {filteredCategories.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: theme.textSecondary,
              }}
            >
              <p style={{ fontSize: "16px", margin: 0 }}>
                No activities found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            filteredCategories.map(([categoryKey, category]) => (
              <div key={categoryKey} style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: `2px solid ${theme.border}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: theme.primary,
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {category.name}
                  </h3>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: theme.textSecondary,
                      fontStyle: "italic",
                    }}
                  >
                    {category.description}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {category.activities.map((activity, index) => {
                    const mainName = getActivityMainName(activity);
                    const details = getActivityDetails(activity);
                    const isSelected = currentActivity === activity;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelect(activity)}
                        style={{
                          padding: "14px 16px",
                          backgroundColor: isSelected
                            ? theme.primary + "15"
                            : theme.surface,
                          border: `2px solid ${
                            isSelected ? theme.primary : theme.border
                          }`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = theme.background;
                            e.currentTarget.style.borderColor = theme.primary + "80";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = theme.surface;
                            e.currentTarget.style.borderColor = theme.border;
                            e.currentTarget.style.transform = "translateX(0)";
                          }
                        }}
                      >
                        <div
                          style={{
                            color: theme.text,
                            fontSize: "15px",
                            fontWeight: "600",
                            marginBottom: details ? "6px" : 0,
                          }}
                        >
                          {mainName}
                          {isSelected && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: theme.primary,
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              ✓ Selected
                            </span>
                          )}
                        </div>
                        {details && (
                          <div
                            style={{
                              color: theme.textSecondary,
                              fontSize: "13px",
                              lineHeight: "1.5",
                            }}
                          >
                            {details}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: theme.surface,
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "13px", color: theme.textSecondary }}>
            {currentActivity ? (
              <span>
                Currently selected: <strong>{getActivityMainName(currentActivity)}</strong>
              </span>
            ) : (
              <span>No activity selected</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.background;
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionModal;
