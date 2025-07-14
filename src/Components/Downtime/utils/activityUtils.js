import { getAllActivities } from "../../../SharedData/downtime";

export const activityRequiresMakeSpellInterface = (activityText) => {
  if (!activityText) return false;
  return activityText.toLowerCase().includes("make a spell");
};

export const getActivityDescription = (activityValue, availableActivities) => {
  if (!activityValue) return "";
  const activity = availableActivities.find((a) => a.value === activityValue);
  return activity ? activity.description : "";
};

export const getCheckDescription = (checkType) => {
  switch (checkType) {
    case "Magical Theory":
      return "Roll History of Magic + Intelligence modifier to research the theoretical foundations";
    case "Wand Modifier":
      return "Roll with your appropriate Wand Modifier based on the spell's school";
    case "Spellcasting Ability":
      return "Roll with your Spellcasting Ability modifier to test practical application";
    default:
      return "";
  }
};

export const getAvailableActivities = () => {
  const activities = getAllActivities();
  return [
    { value: "", label: "Select Activity", description: "" },
    ...activities.map((activity) => ({
      value: activity,
      label: activity ? activity.split(" - ")[0] : "Select Activity",
      description: activity,
    })),
  ];
};
