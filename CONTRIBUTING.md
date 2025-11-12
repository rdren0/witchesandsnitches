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

### Database Schema Setup

To set up your development database, follow these steps:

#### 1. Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project for development
3. Note your project URL and anon key for your `.env` file

#### 2. Create Database Tables

Copy and paste the following SQL into your Supabase SQL Editor (Database → SQL Editor → New Query):

<details>
<summary><strong>📋 Click to expand complete database schema SQL</strong></summary>

```sql
-- ============================================================
-- Create all tables
-- ============================================================

-- Helper function for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE character_activity_progress (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  semester text NOT NULL,
  activity_name text NOT NULL,
  year integer NOT NULL,
  success_count integer NOT NULL,
  attempt_count integer NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE character_downtime (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  user_id uuid NOT NULL,
  semester integer NOT NULL,
  character_name text NOT NULL,
  year text,
  school_year text,
  subjects jsonb,
  activities jsonb,
  extra_activity jsonb,
  activity_progress jsonb,
  selected_spells jsonb,
  selected_magic_school text,
  magic_school_choices jsonb,
  spell_research_data jsonb,
  relationships jsonb,
  roll_assignments jsonb,
  dice_pool text[],
  is_draft boolean NOT NULL,
  archived boolean NOT NULL,
  extra_fields_unlocked boolean,
  review_status text,
  admin_feedback text,
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  last_edited_at timestamp with time zone,
  last_edited_by uuid
);

CREATE TABLE character_money (
  id integer NOT NULL PRIMARY KEY,
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  total_knuts integer NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE character_notes (
  id integer NOT NULL PRIMARY KEY,
  character_id integer NOT NULL,
  user_id text NOT NULL,
  notes text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE character_npc_notes (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  npc_name text NOT NULL,
  npc_school text,
  npc_type text,
  relationship text,
  notes text,
  last_interaction text,
  custom_tags jsonb,
  connections jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE character_pc_notes (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  pc_name text NOT NULL,
  pc_school text,
  pc_clan text,
  relationship text,
  notes text,
  last_interaction text,
  custom_tags jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE character_resources (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint,
  discord_user_id text NOT NULL,
  sorcery_points integer,
  max_sorcery_points integer,
  corruption_points integer,
  inspiration boolean,
  luck integer,
  spell_slots_1 integer,
  spell_slots_2 integer,
  spell_slots_3 integer,
  spell_slots_4 integer,
  spell_slots_5 integer,
  spell_slots_6 integer,
  spell_slots_7 integer,
  spell_slots_8 integer,
  spell_slots_9 integer,
  max_spell_slots_1 integer,
  max_spell_slots_2 integer,
  max_spell_slots_3 integer,
  max_spell_slots_4 integer,
  max_spell_slots_5 integer,
  max_spell_slots_6 integer,
  max_spell_slots_7 integer,
  max_spell_slots_8 integer,
  max_spell_slots_9 integer,
  spell_bonus_dice jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE characters (
  id bigint NOT NULL PRIMARY KEY,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  level integer,
  house text,
  school_year integer,
  casting_style text,
  subclass text,
  innate_heritage text,
  background text,
  game_session character varying,
  level1_choice_type character varying,
  initiative_ability character varying,
  wand_type text,
  wand_info text,
  image_url text,
  notes text,
  ability_scores jsonb NOT NULL,
  base_ability_scores jsonb,
  calculated_ability_scores jsonb,
  hit_points integer,
  current_hit_points integer,
  temp_hp integer,
  current_hit_dice integer,
  corruption_points integer NOT NULL,
  active boolean,
  archived_at timestamp with time zone,
  skill_proficiencies text[],
  base_skill_proficiencies text[],
  calculated_skill_proficiencies text[],
  innate_heritage_skills text[],
  skill_expertise text[],
  language_proficiencies text[],
  tool_proficiencies jsonb,
  asi_choices jsonb,
  additional_asi jsonb,
  subclass_choices jsonb,
  house_choices jsonb,
  feat_choices jsonb,
  additional_feats jsonb,
  standard_feats jsonb,
  heritage_choices jsonb,
  casting_style_choices jsonb,
  metamagic_choices jsonb,
  subclass_features jsonb,
  subclass_level integer,
  feature_uses jsonb,
  magic_modifiers jsonb,
  ac jsonb,
  spell_attack jsonb,
  initiative jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE creatures (
  id uuid NOT NULL PRIMARY KEY,
  discord_user_id text NOT NULL,
  character_id integer,
  name text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  alignment text,
  description text,
  source text,
  notes text,
  armor_class integer NOT NULL,
  armor_type text,
  hit_points integer NOT NULL,
  current_hit_points integer NOT NULL,
  hit_dice text,
  speed jsonb,
  strength integer NOT NULL,
  dexterity integer NOT NULL,
  constitution integer NOT NULL,
  intelligence integer NOT NULL,
  wisdom integer NOT NULL,
  charisma integer NOT NULL,
  saving_throws jsonb,
  saving_throw_proficiencies jsonb,
  skills jsonb,
  selected_skills jsonb,
  skill_proficiencies jsonb,
  proficiencies jsonb,
  senses jsonb,
  languages text[],
  damage_vulnerabilities text[],
  damage_resistances text[],
  damage_immunities text[],
  condition_immunities text[],
  resistances jsonb,
  special_traits jsonb,
  traits jsonb,
  actions jsonb,
  attacks jsonb,
  reactions jsonb,
  legendary_actions jsonb,
  legendary_actions_per_round integer,
  lair_actions jsonb,
  initiative_modifier integer,
  image_url text,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE custom_melee_attacks (
  id uuid NOT NULL PRIMARY KEY,
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  description text,
  attack_ability_modifier text NOT NULL,
  damage_dice_count integer,
  damage_dice_type text,
  damage_modifier integer,
  damage_type text,
  damage_name text,
  bonus_damage integer,
  additional_damage jsonb,
  range text,
  has_proficiency boolean,
  magical_bonus integer,
  crit_range integer,
  save_type text,
  save_effect text,
  higher_levels text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE custom_recipes (
  id integer NOT NULL PRIMARY KEY,
  created_by_character_id integer NOT NULL,
  name character varying NOT NULL,
  category character varying,
  description text,
  duration character varying,
  eating_time character varying,
  qualities jsonb NOT NULL,
  created_at timestamp without time zone
);

CREATE TABLE custom_spells (
  id uuid NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  spell_class text NOT NULL,
  level text NOT NULL,
  casting_time text NOT NULL,
  range text NOT NULL,
  duration text,
  components text,
  description text NOT NULL,
  higher_levels text,
  concentration boolean,
  damage_dice_count integer,
  damage_dice_type text,
  damage_modifier integer,
  damage_type text,
  scaling_dice_count integer,
  scaling_dice_type character varying,
  scaling_per_level boolean,
  check_type text,
  save_type text,
  tags text,
  status text,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE discord_users (
  discord_user_id text NOT NULL PRIMARY KEY,
  username text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE enhanced_spells (
  id integer PRIMARY KEY,
  character_id integer,
  discord_user_id text,
  character_name text,
  spell_name text,
  subclass text,
  subclass_features jsonb,
  enhancement_level text,
  researched boolean,
  successful_attempts integer,
  has_failed_attempt boolean,
  has_natural_twenty boolean,
  has_arithmantic_tag boolean,
  has_runic_tag boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE inventory_items (
  id bigint NOT NULL PRIMARY KEY,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  quantity integer NOT NULL,
  value text,
  attunement_required boolean,
  is_attuned boolean,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE owl_mail (
  id bigint NOT NULL PRIMARY KEY,
  sender_character_id bigint,
  recipient_character_id bigint,
  subject text NOT NULL,
  message text,
  read boolean,
  created_at timestamp with time zone
);

CREATE TABLE spells (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  school text NOT NULL,
  level text NOT NULL,
  casting_time text,
  range text,
  duration text,
  year integer,
  description text NOT NULL,
  higher_levels text,
  check_type text,
  attack_type text,
  saving_throw jsonb,
  damage jsonb,
  class jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  ritual boolean DEFAULT false,
  restriction boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT spells_pkey PRIMARY KEY (id),
  CONSTRAINT spells_name_key UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_spells_school ON spells (school);
CREATE INDEX IF NOT EXISTS idx_spells_level ON spells (level);
CREATE INDEX IF NOT EXISTS idx_spells_year ON spells (year);
CREATE INDEX IF NOT EXISTS idx_spells_name ON spells (name);

-- Trigger to auto-update updated_at on spells table
CREATE TRIGGER update_spells_updated_at
  BEFORE UPDATE ON spells
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE spell_progress_summary (
  id integer NOT NULL PRIMARY KEY,
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  spell_name text NOT NULL,
  researched boolean NOT NULL,
  successful_attempts integer,
  has_failed_attempt boolean NOT NULL,
  has_natural_twenty boolean,
  has_arithmantic_tag boolean,
  has_runic_tag boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE user_profiles (
  id uuid NOT NULL PRIMARY KEY,
  discord_user_id text NOT NULL,
  username text,
  discord_name text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE user_role_status (
  discord_user_id text,
  roles text[],
  effective_role text
);

CREATE TABLE user_roles (
  id integer NOT NULL PRIMARY KEY,
  discord_user_id text NOT NULL,
  role text NOT NULL,
  granted_by text,
  granted_at timestamp with time zone,
  created_at timestamp with time zone
);
```

</details>

**Note on Spell Data:** The `spells` table will be empty after creation. Spell data is managed via Google Sheets and synced automatically. To populate your development database with spell data, you'll need access to the W&S spell management Google Sheet. **Contact the project maintainers (r8chael) to request access.** Alternatively, you can create test spell data manually for development purposes.

#### 3. Set Up Authentication

The app uses Discord OAuth for authentication. In your Supabase project:

1. Go to Authentication → Providers
2. Enable Discord provider
3. Add your Discord OAuth credentials (get these from [Discord Developer Portal](https://discord.com/developers/applications))
4. Add your local development URL (`http://localhost:3000/auth/callback`) to the allowed redirect URLs

#### 4. Configure Row Level Security (Optional)

The production database uses Row Level Security (RLS) policies. For development, you can either:

- **Disable RLS** (easier for testing, but less secure)
- **Set up basic RLS policies** (contact maintainer for complete policy SQL)

Example basic policy:

```sql
-- Example: Allow users to read their own characters
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own characters" ON characters
  FOR SELECT USING (discord_user_id = auth.uid()::text);
```

### Key Tables Overview

- **`characters`** - Main character data (abilities, stats, house, subclass, etc.)
- **`character_resources`** - Spell slots, sorcery points, hit points, inspiration
- **`discord_users`** - Discord user information for auth
- **`spells`** - Master spell definitions and data (synced from Google Sheets)
- **`spell_progress_summary`** - Character spell learning progress
- **`inventory_items`** - Character items and equipment
- **`character_downtime`** - Downtime activity submissions
- **`creatures`** - NPC and creature database
- **`custom_spells`** - Player-created custom spells
- **`owl_mail`** - In-game mail system
- And many more...

### Making Database Changes

1. **Never modify the production database directly**
2. Test database changes in a development Supabase project first
3. Document schema changes in your PR
4. Update TypeScript types if applicable
5. Ensure Row Level Security (RLS) policies are properly configured

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
