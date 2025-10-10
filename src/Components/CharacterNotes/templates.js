export const templates = {
  hogwartsMarkdown: `# 🪄 [Document Title]

## 🏰 Setting the Scene
**Date:**  
**Location:**  
**House:**  
**Professor:**  

> "Magic is merely the art of turning the impossible into the improbable."  
> — *Unknown Wizard*

---

## 📜 Overview

### 🎓 Lesson / Mission Summary
Provide a short summary of the class, mission, or magical event.  
What was learned, discovered, or encountered?

### 🧩 Key Characters
| Name | Role | House | Notes |
|------|------|--------|-------|
|      |      |        |       |
|      |      |        |       |

---

## ✨ Magical Elements

### 🪶 Spells Practiced
- **Spell Name:**  
- **Effect:**  
- **Incantation:**  
- **Notes:**  

### 🧪 Potions Brewed
1. Name:  
2. Ingredients:  
   -  
   -  
   -  
3. Brewing Difficulty:  
4. Outcome:  

---

## 📚 Study Notes

### 🔮 Theoretical Notes
- 

### ⚗️ Practical Applications
- 

### 🧮 Magical Formulae Example
\`\`\`js
// Example Spellcasting Roll Formula
const castSpell = (intelligence, proficiency) => {
  const d20 = Math.floor(Math.random() * 20) + 1;
  return d20 + intelligence + proficiency;
};
\`\`\`

### 🧙‍♂️ Study Checklist
- [ ] Review class materials  
- [ ] Memorize new spells  
- [ ] Feed the potion ingredients (again)  
- [ ] Avoid setting anything on fire this time  

---

## 🧭 Field Report

### 🌲 Location
**Name:**  
**Region:**  
**Weather / Magical Conditions:**  

### 🐉 Creatures Encountered
| Creature | Disposition | Danger Level | Notes |
|-----------|--------------|---------------|-------|
|           |              |               |       |
|           |              |               |       |

### ⚔️ Combat or Challenges
- **Opponent / Task:**  
- **Strategy Used:**  
- **Outcome:**  

---

## 🎒 Inventory
- Wand:  
- Focus Item:  
- Broom Model:  
- Notable Trinkets:  
- Potions / Scrolls:  

---

## 🧠 Reflections
- What did I learn?  
- What could have gone better?  
- How did my Housemates contribute?  
- Did I lose or earn House Points?  

---

## 🏆 Rewards & House Points
| Source | Points | Reason |
|---------|---------|--------|
|         |         |        |
|         |         |        |

---

## 🔗 Useful Links
- [Ministry of Magic Records](https://www.wizardingworld.com)
- [Hogwarts Library Archives](https://harrypotter.fandom.com/wiki/Hogwarts_Library)

---

## 💭 Quotes or Thoughts
> “The stars are never wrong — but wizards often are.”  
> — Professor Sinistra

---

## 🎯 Next Steps
- [ ]  
- [ ]  
- [ ]  

---

## 🪄 Quick Reference
**Common Spells Table**

| Spell | Type | Effect | Notes |
|--------|------|---------|--------|
| Lumos | Charm | Creates light | Useful in dark corridors |
| Alohomora | Charm | Unlocks doors | Prefects hate this one |
| Expelliarmus | Dueling | Disarms opponent | Always works on Todd |

---

## 🧩 Bonus Section
**Example JSON Spell Entry:**
\`\`\`json
{
  "name": "",
  "school": "",
  "level": "",
  "casting_time": "",
  "effect": "",
  "duration": ""
}
\`\`\`

---

## 🎨 Decorative Elements
Horizontal rules:
---
***
___

Inline examples:  
\`Accio Wand\` • *Wingardium Leviosa* • **Protego!** • ~~Mischief Managed~~

---
`,
  spell: `## 🔮 [Spell Name]

**📊 Stats:**
- **Level:** 
- **School:** 
- **Casting Time:** 
- **Range:** 
- **Components:** 
- **Duration:** 
- **Concentration:** 

**📝 Description:**


**⚔️ Combat Use:**


**🎯 Strategic Notes:**


---

`,
  session: `# 📅 Session ${new Date().toLocaleDateString()}

## 📖 Session Summary


## 🗣️ Important NPCs
| Name | Role | Notes |
|------|------|-------|
|      |      |       |

## 🗺️ Locations Visited


## ⚔️ Combat Encounters


## 🎒 Loot & Rewards


## 📝 Character Development


## 🎯 Next Session Goals
- [ ] 
- [ ] 
- [ ] 

## 💭 Player Notes


---

`,
  relationship: `## 👥 Relationship: [NPC Name]

**📊 Relationship Status:** 
**🎭 Their Personality:** 
**🎯 Their Goals:** 
**💭 What They Think of Me:** 
**🤝 How I Can Help Them:** 
**⚠️ Potential Conflicts:** 

### 📝 Interaction History


### 🎯 Future Plans


---

`,
  creature: `## 🐉 [Creature Name]

**📊 Basic Stats:**
- **AC:** 
- **HP:** 
- **Speed:** 
- **CR:** 
- **Size:** 
- **Type:** 

**💪 Ability Scores:**
| STR | DEX | CON | INT | WIS | CHA |
|-----|-----|-----|-----|-----|-----|
|     |     |     |     |     |     |

**🎯 Skills & Senses:**
- **Skills:** 
- **Senses:** 
- **Damage Resistances:** 
- **Damage Immunities:** 
- **Condition Immunities:** 

**✨ Special Abilities:**


**⚔️ Actions:**


**🌟 Legendary Actions:** *(if applicable)*


**📖 Lore & Description:**


**🎯 Tactical Use:**
- **Combat Role:** 
- **Environment:** 
- **Allies:** 

---

`,
};
