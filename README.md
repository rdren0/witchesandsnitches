# Witches & Snitches - Character Management System

A comprehensive web application for managing characters in the Witches & Snitches tabletop RPG system, featuring character creation, spell management, inventory tracking, and more.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Key Components](#key-components)
- [Discord Integration](#discord-integration)
- [Development](#development)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎮 Overview

Witches & Snitches is a full-featured character management system for a Harry Potter-inspired tabletop RPG. The application provides players and game masters with tools to create, manage, and track their magical characters through their adventures at a wizarding school.

### Live Demo

- Production: [WitchesAndSnitches.com](https://witchesandsnitches.com/)
- Development: http://localhost:3000

## ✨ Features

### Character Management

- **Character Creation & Editing**: Comprehensive character builder with guided workflow
- **Character Sheets**: Interactive character sheets with real-time calculations
- **Multiple Characters**: Support for multiple characters per user
- **Level Progression**: Track character advancement from level 1-20
- **Ability Scores**: STR, DEX, CON, INT, WIS, CHA with modifiers
- **Skills & Proficiencies**: Extensive skill system with expertise tracking

### Magic System

- **Spellbook**: Complete spell management with attempt tracking
- **Spell Progress Tracking**: Monitor successful attempts, critical successes, and failures
- **Research System**: Research new spells with History of Magic checks
- **Arithmancy & Runes**: Alternative spell casting methods
- **Wand Modifiers**: Track wand bonuses and custom wands

### Gameplay Features

- **Downtime Activities**: Manage between-session activities
- **Inventory System**: Track items, equipment, and magical artifacts
- **Potion Brewing**: Craft potions with quality tracking
- **Recipe Cooking**: Create magical recipes and food items
- **Inspiration Tracking**: Monitor and use inspiration points
- **Character Notes**: Personal notes and backstory management
- **Dice Rolling**: Integrated dice rolling with Discord webhook notifications

### Administrative Features

- **Admin Dashboard**: Comprehensive admin tools for game masters
- **User Management**: Discord-based authentication and user tracking
- **Character Gallery**: View all characters in the system
- **Draft System**: Save and manage character creation drafts
- **Downtime Review**: Review and manage player downtime submissions
- **Session Management**: Track game sessions and inspiration awards

## 🛠 Tech Stack

### Frontend

- **React** (v18.x) - UI framework
- **React Router** (v6.x) - Client-side routing
- **Lucide React** - Icon library
- **CSS-in-JS** - Dynamic styling system

### Backend & Database

- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage

### Authentication

- **Discord OAuth** - Primary authentication method
- **Supabase Auth** - Authentication management

### Integration

- **Discord Webhooks** - Roll result notifications
- **Discord API** - User authentication and data

### Development Tools

- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Jest** - Testing framework

## 📦 Installation

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- Supabase account
- Discord application (for OAuth)
- Discord webhook URL (for roll notifications)

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/witches-and-snitches.git
cd witches-and-snitches
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_DISCORD_CLIENT_ID=your_discord_client_id
REACT_APP_DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
REACT_APP_DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

4. **Database Setup**
   Run the Supabase migrations to set up your database schema:

```bash
# Database tables needed:
# - characters
# - spell_progress_summary
# - downtime_sheets
# - inventory_items
# - character_notes
# - users
# - session_inspiration_tracking
```

5. **Start the development server**

```bash
npm start
# or
yarn start
```

## 📁 Project Structure

```
src/
├── Admin/                   # Admin functionality
│   ├── Admin.js            # Admin main component
│   ├── AdminDashboard.js   # Admin dashboard
│   ├── AdminDowntimeManager.js    # Downtime management
│   ├── AdminDowntimeReviewer.js   # Downtime review system
│   ├── AdminPasswordModal.js      # Admin authentication
│   ├── GameSessionInspiration.js  # Session tracking
│   └── SessionManagement.js       # Session management
├── App/
│   ├── App.js              # Main application component
│   ├── BetaBanner.js       # Beta version banner
│   └── const.js            # Application constants
├── Components/
│   ├── CharacterManager/   # Character creation/editing
│   │   ├── components/
│   │   │   ├── CharacterForm/
│   │   │   ├── sections/
│   │   │   └── FormSection.js
│   │   ├── hooks/
│   │   │   ├── useCharacterData.js
│   │   │   └── useFormSections.js
│   │   └── utils/
│   │       ├── characterUtils.js
│   │       └── characterTransformUtils.js
│   ├── CharacterSheet/     # Character sheet display
│   │   ├── CharacterSheet.js
│   │   ├── CharacterSheetWrapper.js
│   │   ├── CharacterTabbedPanel.js
│   │   ├── Skills/
│   │   ├── InspirationTracker.js
│   │   └── CastingTiles.js
│   ├── SpellBook/          # Spell management
│   │   ├── SpellBook.js
│   │   ├── SubjectCard.js
│   │   ├── RestrictionModal.js
│   │   ├── SpellBonusDiceModal.js
│   │   └── utils.js
│   ├── Downtime/           # Downtime activities
│   │   ├── DowntimeWrapper.js
│   │   ├── DowntimeForm.js
│   │   ├── DicePoolManager.js
│   │   ├── SpellSelector.js
│   │   ├── SkillSelector.js
│   │   └── utils/
│   │       ├── spellUtils.js
│   │       ├── validationUtils.js
│   │       └── databaseUtils.js
│   ├── Inventory/          # Item management
│   │   └── Inventory.js
│   ├── Potions/            # Potion brewing system
│   │   └── Potions.js
│   ├── Recipes/            # Recipe cooking system
│   │   └── RecipeCookingSystem.js
│   ├── CharacterGallery/   # Character viewing
│   │   └── CharacterGallery.js
│   ├── CharacterNotes/     # Notes system
│   │   └── CharacterNotes.js
│   ├── CharacterSelector/  # Character selection
│   │   └── CharacterSelector.js
│   ├── ThemeSettings/      # Theme customization
│   │   └── ThemeSettings.js
│   └── utils/              # Shared utilities
│       ├── diceRoller.js
│       └── discordWebhook.js
├── contexts/
│   ├── ThemeContext.js     # Theme management
│   └── AdminContext.js     # Admin state management
├── services/
│   └── characterService.js # Character API service
├── styles/
│   └── masterStyles.js     # Centralized styling
├── SharedData/
│   ├── spells.js           # Spell database
│   ├── downtime.js         # Downtime activities
│   ├── backgrounds.js      # Character backgrounds
│   ├── feats.js            # Character feats
│   └── houses.js           # House information
├── Images/
│   └── logo/               # Application logos
└── utils/                  # Root level utilities
```

## 🧩 Key Components

### CharacterSheet

The main character display component showing all character information, abilities, and stats.

```javascript
import CharacterSheet from "./Components/CharacterSheet/CharacterSheet";

<CharacterSheet
  user={user}
  supabase={supabase}
  selectedCharacter={character}
/>;
```

### SpellBook

Manages spell attempts, tracking, and research.

```javascript
import SpellBook from "./Components/SpellBook/SpellBook";

<SpellBook supabase={supabase} user={user} selectedCharacter={character} />;
```

### CharacterManager

Handles character creation and editing with form validation.

```javascript
import CharacterManager from "./Components/CharacterManager/CharacterManager";

<CharacterManager
  userId={user.id}
  supabase={supabase}
  mode="create" // or "edit"
/>;
```

## 🎲 Discord Integration

### Webhook Configuration

The application integrates with Discord webhooks to send roll results to your Discord server in real-time.

#### Setting up Discord Webhook

1. **Create a webhook in your Discord server**

   - Go to Server Settings → Integrations → Webhooks
   - Click "New Webhook"
   - Name it (e.g., "Witches & Snitches Dice Bot")
   - Copy the webhook URL

2. **Add webhook URL to environment**

```env
REACT_APP_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
```

#### Roll Result Notifications

The Discord webhook sends formatted messages for various roll types:

```javascript
// Example webhook payload structure
{
  embeds: [
    {
      title: "🎲 Ability Check",
      description: `**${characterName}** rolls ${abilityName}!`,
      color: getRollResultColor(total, dc),
      fields: [
        { name: "Roll", value: `1d20 (${rollValue})`, inline: true },
        { name: "Modifier", value: formatModifier(modifier), inline: true },
        { name: "Total", value: `**${total}**`, inline: true },
        { name: "DC", value: dc || "—", inline: true },
        { name: "Result", value: getResultEmoji(success), inline: true },
      ],
      footer: { text: "Witches & Snitches" },
      timestamp: new Date().toISOString(),
    },
  ];
}
```

#### Supported Roll Types

- **Ability Checks**: STR, DEX, CON, INT, WIS, CHA
- **Skill Checks**: All skill proficiencies with expertise indicators
- **Spell Attempts**: Success/failure with DC calculations
- **Saving Throws**: Death saves and ability saves
- **Attack Rolls**: With critical hit/miss detection
- **Potion Brewing**: Quality results and proficiency bonuses
- **Research Checks**: History of Magic and spell research

#### Roll Result Colors

```javascript
const ROLL_COLORS = {
  CRITICAL_SUCCESS: 0xffd700, // Gold
  SUCCESS: 0x00ff00, // Green
  FAILURE: 0xff0000, // Red
  CRITICAL_FAILURE: 0x8b0000, // Dark Red
  NEUTRAL: 0x6366f1, // Indigo
};
```

## 🚀 Development

### Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run linting
npm run lint
```

### Code Style Guidelines

- Use functional components with hooks
- Implement proper error handling
- Follow ESLint rules
- Use meaningful variable names
- Comment complex logic
- Keep components focused and single-purpose

### Testing

```bash
# Run all tests
npm test
```

## 🔌 API Integration

### Supabase Client

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
```

### Character Service

```javascript
import { characterService } from "./services/characterService";

// Fetch character
const character = await characterService.fetchCharacter(characterId);

// Save character
await characterService.saveCharacter(character);
```

### Discord Webhook Service

```javascript
import { sendDiscordRollWebhook } from "./utils/discordWebhook";

// Send roll result to Discord
await sendDiscordRollWebhook({
  webhookUrl: discordWebhookUrl,
  characterName: character.name,
  rollType: "ability",
  rollValue: 15,
  modifier: 3,
  total: 18,
  dc: 15,
  success: true,
});
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Create issues for bugs and enhancements

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues

```
Error: Failed to fetch character data
Solution: Check Supabase credentials in .env file
```

#### Authentication Problems

```
Error: Discord authentication failed
Solution: Verify Discord OAuth settings and redirect URI
```

#### Spell Progress Not Loading

```
Error: spell_progress_summary called multiple times
Solution: Ensure loadSpellProgress is called only once in parent component
```

#### Discord Webhook Not Working

```
Error: Failed to send webhook
Solution:
1. Verify webhook URL is correct
2. Check Discord server permissions
3. Ensure webhook is not rate-limited
```

### Performance Optimization

- Implement React.memo for expensive components
- Use useCallback and useMemo for optimization
- Lazy load large components
- Optimize database queries with proper indexes
- Batch Discord webhook requests to avoid rate limits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Lead**: Rachael Drennan
- **Email**: rachael.drennan@yahoo.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/witches-and-snitches/issues)

---

**Note**: This project is a fan-made creation inspired by the Harry Potter universe and is not affiliated with or endorsed by J.K. Rowling, Warner Bros., or any official Harry Potter entities.
