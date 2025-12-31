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

CREATE TABLE public.character_downtime (
  id bigserial NOT NULL,
  character_id bigint NOT NULL,
  user_id uuid NOT NULL,
  character_name text NOT NULL,
  year text NULL,
  semester integer NOT NULL,
  subjects jsonb NULL DEFAULT '{}'::jsonb,
  activities jsonb NULL DEFAULT '[]'::jsonb,
  extra_activity jsonb NULL DEFAULT '{}'::jsonb,
  magic_school_choices jsonb NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_edited_at timestamp with time zone NULL,
  last_edited_by uuid NULL,
  spell_research_data jsonb NULL DEFAULT '{}'::jsonb,
  dice_pool integer[] NULL,
  extra_fields_unlocked boolean NULL DEFAULT false,
  is_draft boolean NOT NULL DEFAULT false,
  roll_assignments jsonb NULL DEFAULT '{}'::jsonb,
  selected_magic_school text NULL DEFAULT ''::text,
  relationships jsonb NULL DEFAULT '[]'::jsonb,
  review_status text NULL DEFAULT 'pending'::text,
  admin_feedback text NULL DEFAULT ''::text,
  admin_notes text NULL DEFAULT ''::text,
  reviewed_at timestamp with time zone NULL,
  reviewed_by uuid NULL,
  selected_spells jsonb NULL DEFAULT '{}'::jsonb,
  activity_progress jsonb NULL DEFAULT '{}'::jsonb,
  school_year text NULL,
  archived boolean NOT NULL DEFAULT false,
  CONSTRAINT character_downtime_pkey PRIMARY KEY (id),
  CONSTRAINT character_downtime_character_id_year_semester_key UNIQUE (character_id, year, semester),
  CONSTRAINT character_downtime_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT check_review_status CHECK (
    (
      review_status = ANY (
        ARRAY[
          'pending'::text,
          'success'::text,
          'failure'::text,
          'partial'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_downtime_selected_spells ON public.character_downtime USING gin (selected_spells) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_activity_progress ON public.character_downtime USING gin (activity_progress) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_year_semester ON public.character_downtime USING btree (year, semester) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_character_id ON public.character_downtime USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_user_id ON public.character_downtime USING btree (user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_review_status ON public.character_downtime USING btree (review_status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_downtime_reviewed_at ON public.character_downtime USING btree (reviewed_at) TABLESPACE pg_default;

CREATE TRIGGER trigger_character_downtime_updated_at BEFORE UPDATE ON character_downtime FOR EACH ROW
EXECUTE FUNCTION update_character_downtime_updated_at();

CREATE TABLE public.character_money (
  id serial NOT NULL,
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  total_knuts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT character_money_pkey PRIMARY KEY (id),
  CONSTRAINT character_money_character_id_discord_user_id_key UNIQUE (character_id, discord_user_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_money_character_id ON public.character_money USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_money_discord_user_id ON public.character_money USING btree (discord_user_id) TABLESPACE pg_default;

CREATE TRIGGER update_character_money_updated_at BEFORE UPDATE ON character_money FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.character_notes (
  id serial NOT NULL,
  character_id integer NOT NULL,
  user_id text NOT NULL,
  notes text NULL DEFAULT ''::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT character_notes_pkey PRIMARY KEY (id),
  CONSTRAINT character_notes_character_id_user_id_key UNIQUE (character_id, user_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_notes_character_id ON public.character_notes USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_notes_user_id ON public.character_notes USING btree (user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_notes_updated_at ON public.character_notes USING btree (updated_at) TABLESPACE pg_default;

CREATE TABLE public.character_npc_notes (
  id bigserial NOT NULL,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  npc_name text NOT NULL,
  npc_school text NULL,
  npc_type text NULL,
  notes text NULL,
  relationship text NULL DEFAULT 'unknown'::text,
  last_interaction text NULL,
  custom_tags jsonb NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  connections jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT character_npc_notes_pkey PRIMARY KEY (id),
  CONSTRAINT character_npc_notes_character_id_discord_user_id_npc_name_key UNIQUE (character_id, discord_user_id, npc_name),
  CONSTRAINT character_npc_notes_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT character_npc_notes_relationship_check CHECK (
    (
      relationship = ANY (
        ARRAY[
          'unknown'::text,
          'friend'::text,
          'neutral'::text,
          'suspicious'::text,
          'enemy'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_npc_notes_character_user ON public.character_npc_notes USING btree (character_id, discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_npc_notes_custom_tags ON public.character_npc_notes USING gin (custom_tags) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_npc_notes_relationship ON public.character_npc_notes USING btree (relationship) TABLESPACE pg_default;

CREATE TABLE public.character_pc_notes (
  id bigserial NOT NULL,
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  pc_name text NOT NULL,
  pc_school text NULL,
  pc_clan text NULL,
  notes text NULL,
  relationship text NULL DEFAULT 'unknown'::text,
  last_interaction text NULL,
  custom_tags jsonb NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT character_pc_notes_pkey PRIMARY KEY (id),
  CONSTRAINT character_pc_notes_character_id_discord_user_id_pc_name_key UNIQUE (character_id, discord_user_id, pc_name),
  CONSTRAINT character_pc_notes_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT character_pc_notes_relationship_check CHECK (
    (
      relationship = ANY (
        ARRAY[
          'unknown'::text,
          'ally'::text,
          'neutral'::text,
          'rival'::text,
          'enemy'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_pc_notes_character_user ON public.character_pc_notes USING btree (character_id, discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_pc_notes_custom_tags ON public.character_pc_notes USING gin (custom_tags) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_pc_notes_relationship ON public.character_pc_notes USING btree (relationship) TABLESPACE pg_default;

CREATE TABLE public.character_resources (
  id bigserial NOT NULL,
  character_id bigint NULL,
  discord_user_id text NOT NULL,
  corruption_points integer NULL DEFAULT 0,
  sorcery_points integer NULL DEFAULT 0,
  max_sorcery_points integer NULL DEFAULT 0,
  spell_slots_1 integer NULL DEFAULT 0,
  spell_slots_2 integer NULL DEFAULT 0,
  spell_slots_3 integer NULL DEFAULT 0,
  spell_slots_4 integer NULL DEFAULT 0,
  spell_slots_5 integer NULL DEFAULT 0,
  spell_slots_6 integer NULL DEFAULT 0,
  spell_slots_7 integer NULL DEFAULT 0,
  spell_slots_8 integer NULL DEFAULT 0,
  spell_slots_9 integer NULL DEFAULT 0,
  max_spell_slots_1 integer NULL DEFAULT 0,
  max_spell_slots_2 integer NULL DEFAULT 0,
  max_spell_slots_3 integer NULL DEFAULT 0,
  max_spell_slots_4 integer NULL DEFAULT 0,
  max_spell_slots_5 integer NULL DEFAULT 0,
  max_spell_slots_6 integer NULL DEFAULT 0,
  max_spell_slots_7 integer NULL DEFAULT 0,
  max_spell_slots_8 integer NULL DEFAULT 0,
  max_spell_slots_9 integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  inspiration boolean NULL DEFAULT false,
  spell_bonus_dice jsonb NULL,
  luck integer NULL,
  CONSTRAINT character_resources_pkey PRIMARY KEY (id),
  CONSTRAINT character_resources_character_id_discord_user_id_key UNIQUE (character_id, discord_user_id),
  CONSTRAINT character_resources_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_resources_character_id ON public.character_resources USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_character_resources_discord_user_id ON public.character_resources USING btree (discord_user_id) TABLESPACE pg_default;

CREATE TABLE public.characters (
  id bigserial NOT NULL,
  name text NOT NULL,
  house text NULL,
  casting_style text NULL,
  subclass text NULL,
  innate_heritage text NULL,
  background text NULL,
  standard_feats jsonb NULL DEFAULT '[]'::jsonb,
  ability_scores jsonb NOT NULL,
  hit_points integer NULL DEFAULT 0,
  level integer NULL DEFAULT 1,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  wand_type text NULL DEFAULT ''::text,
  magic_modifiers jsonb NULL DEFAULT '{"charms": 0, "healing": 0, "divinations": 0, "transfiguration": 0, "jinxesHexesCurses": 0}'::jsonb,
  discord_user_id text NOT NULL,
  game_session character varying(50) NULL,
  active boolean NULL DEFAULT true,
  archived_at timestamp with time zone NULL,
  current_hit_dice integer NULL,
  level1_choice_type character varying(20) NULL,
  current_hit_points integer NULL,
  asi_choices jsonb NULL DEFAULT '{}'::jsonb,
  initiative_ability character varying(20) NULL DEFAULT 'dexterity'::character varying,
  skill_proficiencies text[] NULL,
  skill_expertise text[] NULL,
  image_url text NULL,
  subclass_choices jsonb NULL DEFAULT '{}'::jsonb,
  house_choices jsonb NULL DEFAULT '{}'::jsonb,
  feat_choices jsonb NULL DEFAULT '{}'::jsonb,
  base_ability_scores jsonb NULL,
  calculated_ability_scores jsonb NULL,
  base_skill_proficiencies text[] NULL,
  calculated_skill_proficiencies text[] NULL,
  tool_proficiencies jsonb NULL DEFAULT '[]'::jsonb,
  heritage_choices jsonb NULL DEFAULT '{}'::jsonb,
  innate_heritage_skills text[] NULL DEFAULT '{}'::text[],
  corruption_points integer NOT NULL DEFAULT 0,
  subclass_features jsonb NULL DEFAULT '[]'::jsonb,
  subclass_level integer NULL DEFAULT 1,
  school_year integer NULL DEFAULT 1,
  notes text NULL,
  casting_style_choices jsonb NULL DEFAULT '{}'::jsonb,
  feature_uses jsonb NULL DEFAULT '{}'::jsonb,
  language_proficiencies text[] NULL DEFAULT '{}'::text[],
  metamagic_choices jsonb NULL DEFAULT '{}'::jsonb,
  additional_feats jsonb NULL DEFAULT '[]'::jsonb,
  ac jsonb NULL DEFAULT '{"modifier": 0, "override": null}'::jsonb,
  spell_attack jsonb NULL DEFAULT '{"modifier": 0, "override": null}'::jsonb,
  wand_info text NULL,
  initiative jsonb NULL DEFAULT '{"modifier": 0, "override": null}'::jsonb,
  additional_asi jsonb NULL DEFAULT '[]'::jsonb,
  temp_hp integer NULL DEFAULT 0,
  tool_expertise jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT characters_pkey PRIMARY KEY (id),
  CONSTRAINT fk_characters_discord_user FOREIGN KEY (discord_user_id) REFERENCES discord_users (discord_user_id),
  CONSTRAINT characters_school_year_check CHECK (
    (
      (school_year >= 1)
      AND (school_year <= 7)
    )
  ),
  CONSTRAINT valid_subclass_choices CHECK ((jsonb_typeof(subclass_choices) = 'object'::text))
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_active ON public.characters USING btree (active) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_archived_at ON public.characters USING btree (archived_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_id_discord_user ON public.characters USING btree (id, discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_subclass_choices ON public.characters USING gin (subclass_choices) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_discord_user_id ON public.characters USING btree (discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_asi_choices ON public.characters USING gin (asi_choices) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_house_choices ON public.characters USING gin (house_choices) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_innate_heritage ON public.characters USING btree (innate_heritage) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_heritage_choices ON public.characters USING gin (heritage_choices) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_subclass_features ON public.characters USING gin (subclass_features) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_game_session ON public.characters USING btree (game_session) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_metamagic_choices ON public.characters USING gin (metamagic_choices) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_characters_additional_feats ON public.characters USING gin (additional_feats) TABLESPACE pg_default;

CREATE TRIGGER ensure_discord_user_before_character_insert BEFORE INSERT ON characters FOR EACH ROW
EXECUTE FUNCTION auto_create_discord_user ();

CREATE TABLE public.creatures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  discord_user_id text NOT NULL,
  name text NOT NULL,
  size text NOT NULL DEFAULT 'Medium'::text,
  type text NOT NULL DEFAULT 'Beast'::text,
  alignment text NULL,
  armor_class integer NOT NULL DEFAULT 10,
  armor_type text NULL,
  hit_points integer NOT NULL DEFAULT 1,
  hit_dice text NULL,
  speed jsonb NULL DEFAULT '{"walk": 30}'::jsonb,
  strength integer NOT NULL DEFAULT 10,
  dexterity integer NOT NULL DEFAULT 10,
  constitution integer NOT NULL DEFAULT 10,
  intelligence integer NOT NULL DEFAULT 10,
  wisdom integer NOT NULL DEFAULT 10,
  charisma integer NOT NULL DEFAULT 10,
  saving_throws jsonb NULL,
  skills jsonb NULL,
  damage_vulnerabilities text[] NULL,
  damage_resistances text[] NULL,
  damage_immunities text[] NULL,
  condition_immunities text[] NULL,
  senses jsonb NULL DEFAULT '{"passive_perception": 10}'::jsonb,
  languages text[] NULL,
  special_traits jsonb NULL,
  actions jsonb NULL,
  reactions jsonb NULL,
  legendary_actions jsonb NULL,
  legendary_actions_per_round integer NULL DEFAULT 0,
  lair_actions jsonb NULL,
  description text NULL,
  notes text NULL,
  source text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  attacks jsonb NULL,
  character_id integer NULL,
  current_hit_points integer NOT NULL,
  image_url text NULL,
  initiative_modifier integer NULL DEFAULT 0,
  traits jsonb NULL DEFAULT '[]'::jsonb,
  proficiencies jsonb NULL DEFAULT '{}'::jsonb,
  resistances jsonb NULL DEFAULT '{}'::jsonb,
  skill_proficiencies jsonb NULL DEFAULT '{}'::jsonb,
  saving_throw_proficiencies jsonb NULL DEFAULT '[]'::jsonb,
  selected_skills jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT creatures_pkey PRIMARY KEY (id),
  CONSTRAINT creatures_current_hp_non_negative CHECK ((current_hit_points >= 0))
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_creatures_discord_user_id ON public.creatures USING btree (discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_creatures_name ON public.creatures USING btree (name) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_creatures_traits ON public.creatures USING gin (traits) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_creatures_character_id ON public.creatures USING btree (character_id) TABLESPACE pg_default;

CREATE TRIGGER update_creatures_updated_at BEFORE UPDATE ON creatures FOR EACH ROW
EXECUTE FUNCTION update_creatures_updated_at();

CREATE TABLE public.custom_melee_attacks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  attack_ability_modifier text NOT NULL DEFAULT 'strength'::text,
  has_proficiency boolean NULL DEFAULT true,
  magical_bonus integer NULL DEFAULT 0,
  range text NULL DEFAULT 'Melee'::text,
  damage_dice_count integer NULL,
  damage_dice_type text NULL DEFAULT 'd8'::text,
  damage_modifier integer NULL DEFAULT 0,
  bonus_damage integer NULL DEFAULT 0,
  damage_type text NULL,
  additional_damage jsonb NULL DEFAULT '[]'::jsonb,
  save_type text NULL,
  save_effect text NULL,
  description text NULL,
  higher_levels text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  crit_range integer NULL DEFAULT 20,
  damage_name text NULL,
  CONSTRAINT custom_melee_attacks_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_custom_melee_attacks_character ON public.custom_melee_attacks USING btree (character_id, discord_user_id) TABLESPACE pg_default;

CREATE TRIGGER update_custom_melee_attacks_updated_at BEFORE UPDATE ON custom_melee_attacks FOR EACH ROW
EXECUTE FUNCTION update_custom_melee_attacks_updated_at();

CREATE TABLE public.custom_recipes (
  id serial NOT NULL,
  name character varying(255) NOT NULL,
  category character varying(50) NULL,
  eating_time character varying(50) NULL,
  duration character varying(50) NULL,
  description text NULL,
  created_by_character_id integer NOT NULL,
  qualities jsonb NOT NULL,
  created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT custom_recipes_pkey PRIMARY KEY (id),
  CONSTRAINT custom_recipes_name_created_by_character_id_key UNIQUE (name, created_by_character_id)
) TABLESPACE pg_default;

CREATE TABLE public.custom_spells (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  character_id bigint NOT NULL,
  discord_user_id text NOT NULL,
  name text NOT NULL,
  spell_class text NOT NULL,
  level text NOT NULL,
  casting_time text NOT NULL,
  range text NOT NULL,
  duration text NULL,
  components text NULL,
  check_type text NULL,
  save_type text NULL,
  damage_type text NULL,
  tags text NULL,
  description text NOT NULL,
  higher_levels text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  damage_dice_count integer NULL,
  damage_dice_type text NULL,
  damage_modifier integer NULL,
  status text NULL DEFAULT 'known'::text,
  concentration boolean NULL DEFAULT false,
  scaling_dice_count integer NULL,
  scaling_dice_type character varying NULL,
  scaling_per_level boolean NULL DEFAULT true,
  CONSTRAINT custom_spells_pkey PRIMARY KEY (id),
  CONSTRAINT custom_spells_character_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT custom_spells_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT valid_status CHECK (
    (
      status = ANY (
        ARRAY[
          'known'::text,
          'researched'::text,
          'attempted'::text,
          'failed'::text,
          'mastered'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_custom_spells_character_id ON public.custom_spells USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_custom_spells_discord_user_id ON public.custom_spells USING btree (discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_custom_spells_character_discord ON public.custom_spells USING btree (character_id, discord_user_id) TABLESPACE pg_default;

CREATE TRIGGER update_custom_spells_updated_at BEFORE UPDATE ON custom_spells FOR EACH ROW
EXECUTE FUNCTION update_custom_spells_updated_at();

CREATE TABLE public.discord_users (
  discord_user_id text NOT NULL,
  username text NULL,
  display_name text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT discord_users_pkey PRIMARY KEY (discord_user_id)
) TABLESPACE pg_default;

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

CREATE TABLE public.feats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  preview text NULL,
  description jsonb NULL DEFAULT '[]'::jsonb,
  benefits jsonb NULL DEFAULT '{}'::jsonb,
  prerequisites jsonb NULL,
  repeatable boolean NULL DEFAULT false,
  repeatable_key text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT feats_pkey PRIMARY KEY (id),
  CONSTRAINT feats_name_key UNIQUE (name)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_feats_name ON public.feats USING btree (name) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_feats_repeatable ON public.feats USING btree (repeatable) TABLESPACE pg_default;

CREATE TRIGGER update_feats_updated_at BEFORE UPDATE ON feats FOR EACH ROW
EXECUTE FUNCTION update_feats_updated_at();

CREATE TABLE public.inventory_items (
  id bigserial NOT NULL,
  discord_user_id text NOT NULL,
  character_id bigint NOT NULL,
  name text NOT NULL,
  description text NULL DEFAULT ''::text,
  quantity integer NOT NULL DEFAULT 1,
  value text NULL DEFAULT ''::text,
  category text NOT NULL DEFAULT 'General'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  attunement_required boolean NULL,
  is_attuned boolean NULL DEFAULT false,
  CONSTRAINT inventory_items_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS inventory_items_discord_user_id_idx ON public.inventory_items USING btree (discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS inventory_items_character_id_idx ON public.inventory_items USING btree (character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS inventory_items_category_idx ON public.inventory_items USING btree (category) TABLESPACE pg_default;

CREATE TRIGGER handle_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TABLE public.owl_mail (
  id bigserial NOT NULL,
  sender_character_id bigint NULL,
  recipient_character_id bigint NULL,
  subject text NOT NULL,
  message text NULL,
  read boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT owl_mail_pkey PRIMARY KEY (id),
  CONSTRAINT owl_mail_recipient_character_id_fkey FOREIGN KEY (recipient_character_id) REFERENCES characters (id) ON DELETE CASCADE,
  CONSTRAINT owl_mail_sender_character_id_fkey FOREIGN KEY (sender_character_id) REFERENCES characters (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_owl_mail_sender ON public.owl_mail USING btree (sender_character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_owl_mail_recipient ON public.owl_mail USING btree (recipient_character_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_owl_mail_created_at ON public.owl_mail USING btree (created_at) TABLESPACE pg_default;

CREATE TABLE public.spells (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  school text NOT NULL,
  level text NOT NULL,
  casting_time text NULL,
  range text NULL,
  duration text NULL,
  year integer NULL,
  description text NOT NULL,
  higher_levels text NULL,
  check_type text NULL,
  attack_type text NULL,
  saving_throw jsonb NULL,
  damage jsonb NULL,
  class jsonb NULL,
  tags jsonb NULL DEFAULT '[]'::jsonb,
  ritual boolean NULL DEFAULT false,
  restriction boolean NULL DEFAULT false,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  CONSTRAINT spells_pkey PRIMARY KEY (id),
  CONSTRAINT spells_name_key UNIQUE (name)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spells_school ON public.spells USING btree (school) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spells_level ON public.spells USING btree (level) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spells_year ON public.spells USING btree (year) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spells_name ON public.spells USING btree (name) TABLESPACE pg_default;

CREATE TRIGGER update_spells_updated_at BEFORE UPDATE ON spells FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.spell_progress_summary (
  id serial NOT NULL,
  character_id integer NOT NULL,
  discord_user_id text NOT NULL,
  spell_name text NOT NULL,
  successful_attempts integer NULL DEFAULT 0,
  has_natural_twenty boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
  has_failed_attempt boolean NOT NULL DEFAULT false,
  researched boolean NOT NULL DEFAULT false,
  has_arithmantic_tag boolean NULL DEFAULT false,
  has_runic_tag boolean NULL DEFAULT false,
  CONSTRAINT spell_progress_summary_pkey PRIMARY KEY (id),
  CONSTRAINT spell_progress_summary_character_id_discord_user_id_spell_n_key UNIQUE (character_id, discord_user_id, spell_name)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spell_progress_spell_name ON public.spell_progress_summary USING btree (spell_name) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spell_progress_character_discord ON public.spell_progress_summary USING btree (character_id, discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_spell_progress_arithmantic_tag ON public.spell_progress_summary USING btree (has_arithmantic_tag) TABLESPACE pg_default
WHERE (has_arithmantic_tag = true);

CREATE INDEX IF NOT EXISTS idx_spell_progress_runic_tag ON public.spell_progress_summary USING btree (has_runic_tag) TABLESPACE pg_default
WHERE (has_runic_tag = true);

CREATE TRIGGER researcher_enhancement_trigger BEFORE UPDATE OF researched ON spell_progress_summary FOR EACH ROW
EXECUTE FUNCTION apply_researcher_enhancement ();

CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  discord_user_id text NOT NULL,
  username text NULL,
  discord_name text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_discord_user_id_key UNIQUE (discord_user_id),
  CONSTRAINT username_basic_validation CHECK (
    (
      (username IS NOT NULL)
      AND (
        length(
          TRIM(
            BOTH
            FROM
              username
          )
        ) > 0
      )
      AND (length(username) <= 50)
    )
  )
) TABLESPACE pg_default;

CREATE TABLE user_role_status (
  discord_user_id text,
  roles text[],
  effective_role text
);

CREATE TABLE public.user_roles (
  id serial NOT NULL,
  discord_user_id text NOT NULL,
  role text NOT NULL,
  granted_by text NULL,
  granted_at timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_discord_user_id_role_key UNIQUE (discord_user_id, role),
  CONSTRAINT user_roles_role_check CHECK (
    (
      role = ANY (
        ARRAY[
          'admin'::text,
          'moderator'::text,
          'user'::text,
          'forbidden'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_user_roles_discord_user_id ON public.user_roles USING btree (discord_user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles USING btree (role) TABLESPACE pg_default;
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

## Feats Data Management

The project uses a similar Google Apps Script approach to sync feat data from Google Sheets to Supabase.

### Feats Cache

Feats are cached in the browser's `sessionStorage` for 1 hour to improve performance and reduce database queries.

#### Cache Behavior

- **Cache Duration:** 60 minutes (1 hour)
- **Storage Location:** Browser sessionStorage
- **Cache Key:** `feats_cache`

#### Refreshing the Cache

If you've updated feats in the database and need to see changes immediately (without waiting for the 1-hour cache to expire), you can manually refresh the cache using the browser console:

```javascript
// Clear the feats cache
sessionStorage.removeItem("feats_cache");

// Then reload the page
location.reload();
```

#### Feat Benefits Structure

Feats in the database have a `benefits` JSONB column that should follow this structure:

**IMPORTANT:** When entering data in Google Sheets, make sure arrays are proper JSON arrays, NOT JSON strings. For example:
- ✅ Correct: `"resistances": ["fire", "cold"]`
- ❌ Wrong: `"resistances": "[\"fire\", \"cold\"]"`

The wrong format will display as raw text like `["fire"]` instead of being parsed as an array.

```json
{
  "combat": {
    "initiativeBonus": 5,
    "spellAttackBonus": 1,
    "criticalRange": 19,
    "concentrationAdvantage": true,
    "darkvision": 60,
    "hitPointsPerLevel": 1
  },
  "skills": ["Perception", "Investigation"],
  "tools": ["Broomstick", "Potioneer's kit"],
  "saves": ["Wisdom"],
  "resistances": ["fire", "cold"],
  "immunities": ["poison"],
  "special": [
    {
      "name": "Luck Points",
      "amount": "proficiency_bonus",
      "description": "Gain luck points equal to your proficiency bonus"
    }
  ],
  "speeds": {
    "walking": { "bonus": 10 },
    "flying": 50,
    "climb": "equal_to_walking"
  },
  "spellcasting": {
    "cantripsLearned": 2,
    "spellsKnown": { "1": 2 },
    "extraSpellSlots": { "1": 1 },
    "wandlessCantrips": true,
    "wandlessSpells": ["Shield", "Feather Fall"],
    "superiorWandlessCasting": true,
    "spellOpportunityAttacks": true,
    "spellRangeDouble": true,
    "ignoreHalfCover": true,
    "ignoreAllCover": true,
    "bonusActionCantrip": "Prestidigitation",
    "enhancedHealing": { "type": "maximized", "amount": 5 },
    "elementalMastery": [{ "type": "fire", "bonusDamage": 3 }],
    "metamagicOptions": ["Quickened Spell", "Twinned Spell"],
    "sorceryPoints": 2
  },
  "asi": {
    "type": "choice",
    "abilities": ["Intelligence", "Wisdom"],
    "amount": 1
  }
}
```

**Note:** The code transforms these property names:

- `tools` → `toolProficiencies`
- `skills` → `skillProficiencies`
- `saves` → `savingThrowProficiencies`
- `special` → `specialAbilities`
- `combat` → `combatBonuses`

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
