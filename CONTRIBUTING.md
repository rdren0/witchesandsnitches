# Contributing to Witches & Snitches

> **Are you a developer and want to contribute?** You're in the right place!

Thank you for your interest in contributing to Witches & Snitches! This D&D campaign management system is built to help the DM and players track characters, spells, inventory, and more.

## Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Guidelines](#code-guidelines)
- [Database & Supabase](#database--supabase)
- [Google Sheets Spell Sync](#google-sheets-spell-sync)
- [Submitting Contributions](#submitting-contributions)
- [Need Help?](#need-help)

## Getting Started

This project is a React-based web application for managing Witches and Snitches RPG data. It includes character management, spell tracking, inventory systems, downtime activities, and admin tools for DMs.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- A Supabase account (for database)
- Discord Developer Application (for OAuth)

## Tech Stack

**Frontend:**

- React 18
- React Router v6
- Material-UI (MUI)
- Lucide React Icons

**Backend/Database:**

- Supabase (PostgreSQL)
- Supabase Auth (Discord OAuth)

**External Integrations:**

- Discord Webhooks (for roll notifications)
- Google Sheets (spell data management via Apps Script)

**Development Tools:**

- ESLint
- Prettier
- Husky (git hooks)
- lint-staged

## Project Structure

```
witches-and-snitches/
├── public/                 # Static assets
├── src/
│   ├── Admin/             # Admin dashboard & management tools
│   ├── Components/        # React components
│   │   ├── CharacterSheet/
│   │   ├── CharacterManager/
│   │   ├── SpellBook/
│   │   ├── Inventory/
│   │   ├── Downtime/
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Third-party integrations (Supabase)
│   ├── services/          # Business logic & API calls
│   ├── SharedData/        # Static game data
│   ├── utils/             # Utility functions
│   ├── App/               # App shell & routing
│   └── index.js           # App entry point
├── scripts/               # Build & utility scripts
└── package.json
```

### Key Directories

- **`src/Components/CharacterSheet/`** - Character stat tracking, spell slots, abilities
- **`src/Components/SpellBook/`** - Spell browsing and learning
- **`src/Admin/`** - DM-only admin panels
- **`src/services/`** - Supabase queries and business logic
- **`src/hooks/`** - Reusable React hooks (useSpells, useCharacter, etc.)

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rdren0/witchesandsnitches.git
cd witchesandsnitches
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 5. (Optional) Set Up Discord OAuth

1. Create a Discord application at https://discord.com/developers/applications
2. Add OAuth2 redirect URL: `http://localhost:3000/auth/callback`
3. Configure Supabase Auth with your Discord credentials

## Development Workflow

### Making Changes

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [Code Guidelines](#code-guidelines)

3. **Test your changes** thoroughly

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

   Note: Pre-commit hooks will run ESLint automatically

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Guidelines

### JavaScript/React Style

- **Use functional components** with hooks (no class components)
- **Follow React best practices:**
  - Keep components small and focused
  - Use custom hooks for reusable logic
  - Lift state up when needed
  - Use meaningful component and variable names

### ESLint & Formatting

- ESLint runs automatically on commit via Husky
- Fix linting errors before committing:
  ```bash
  npm run lint
  ```

### Naming Conventions

- **Components:** PascalCase (`CharacterSheet.js`)
- **Hooks:** camelCase starting with `use` (`useSpells.js`)
- **Services:** camelCase (`characterService.js`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_SPELL_LEVEL`)
- **Functions:** camelCase (`calculateModifier()`)

### File Organization

- Keep related components in the same directory
- Create `index.js` files for easier imports
- Co-locate styles and tests with components when possible

## Database & Supabase

### Key Tables

- `characters` - Character data
- `spells` - Spell definitions
- `spell_progress_summary` - Character spell progress
- `inventory` - Character inventories
- And more...

### Making Database Changes

1. **Never modify the production database directly**
2. Test database changes in a development Supabase project first
3. Document schema changes in your PR
4. Update TypeScript types if applicable

### Supabase Queries

Use the centralized Supabase client:

```javascript
import { supabase } from "../lib/supabase";

const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", value);
```

## Google Sheets Spell Sync

The project uses Google Apps Script to sync spell data from Google Sheets to Supabase.

### Script Location

`scripts/google-apps-script-updated.js`

### Features

- **Auto-sync on edit** - Updates Supabase when cells are edited
- **Auto-delete (hourly)** - Removes spells deleted from sheet
- **Manual sync** - Bulk sync and manual deletion options

### Setup (for spell data managers)

1. Open the spell management Google Sheet
2. Go to Extensions → Apps Script
3. Paste the script from `scripts/google-apps-script-updated.js`
4. Update Supabase credentials in the script
5. Run "Setup Auto-Sync" and "Setup Auto-Delete" from the menu

## Submitting Contributions

### Pull Request Process

1. **Ensure your code:**

   - Follows our code guidelines
   - Passes ESLint checks
   - Has been tested locally
   - Doesn't break existing features

2. **Create a Pull Request with:**

   - Clear description of changes
   - Screenshots/GIFs for UI changes
   - Link to any related issues
   - Test instructions

3. **PR Title Format:**

   - `feat: Add spell filtering to SpellBook`
   - `fix: Resolve character sheet loading issue`
   - `docs: Update contributing guidelines`
   - `chore: Update dependencies`

4. **Wait for review** - Maintainers will review and provide feedback

### What to Contribute

**Good First Issues:**

- UI improvements and polish
- Bug fixes
- Documentation improvements
- Test coverage

**Feature Ideas:**

- New spell schools or game mechanics
- Improved mobile responsiveness
- Additional admin tools
- Performance optimizations

**Please open an issue first** for major features or architectural changes to discuss the approach.

## Need Help?

- **Questions?** Open a GitHub issue with the `question` label
- **Bug reports?** Open a GitHub issue with detailed reproduction steps
- **Feature requests?** Open a GitHub issue describing the feature and use case

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions focused and professional

---

Thank you for contributing to Witches & Snitches! Your help makes this project better for everyone.
