-- =============================================================================
-- Witches & Snitches - Database schema (public)
-- =============================================================================
-- Reconstructed from the live Supabase project's public schema. Run this once
-- against a fresh Supabase project to create all tables, then load your own
-- reference data (spells, feats, creatures, game_sessions).
--
-- Order matters:
--   1. Extensions   (uuid generation)
--   2. Sequences    (referenced by nextval() column defaults below)
--   3. Tables + views
--   4. Foreign keys
--   5. Helper functions (policies depend on these)
--   6. RLS + policies
--
-- STILL TODO (see notes at the bottom): `spell_schools` (likely a materialized
-- view — not captured by the table/view queries) and CREATE TRIGGER statements
-- that bind the trigger functions in section 5 to their tables.
-- =============================================================================

-- 1. Extensions ---------------------------------------------------------------
create extension if not exists "uuid-ossp";   -- uuid_generate_v4() used by public.spells
create extension if not exists pgcrypto;       -- gen_random_uuid() used by several tables

-- 2. Sequences ----------------------------------------------------------------
-- These back the `id bigint/integer DEFAULT nextval(...)` columns. They must
-- exist before the tables that reference them.
create sequence if not exists public.character_activity_progress_id_seq;
create sequence if not exists public.character_downtime_id_seq;
create sequence if not exists public.character_money_id_seq;
create sequence if not exists public.character_notes_id_seq;
create sequence if not exists public.character_npc_notes_id_seq;
create sequence if not exists public.character_pc_notes_id_seq;
create sequence if not exists public.character_resources_id_seq;
create sequence if not exists public.characters_id_seq;
create sequence if not exists public.custom_recipes_id_seq;
create sequence if not exists public.inventory_items_id_seq;
create sequence if not exists public.owl_mail_id_seq;
create sequence if not exists public.spell_progress_summary_id_seq;
create sequence if not exists public.user_roles_id_seq;

-- 3. Tables -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.character_activity_progress (
    id bigint DEFAULT nextval('character_activity_progress_id_seq'::regclass) NOT NULL,
    character_id bigint NOT NULL,
    activity_name text NOT NULL,
    attempt_count integer DEFAULT 0 NOT NULL,
    success_count integer DEFAULT 0 NOT NULL,
    year integer NOT NULL,
    semester text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT character_activity_progress_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_downtime (
    id bigint DEFAULT nextval('character_downtime_id_seq'::regclass) NOT NULL,
    character_id bigint NOT NULL,
    user_id uuid NOT NULL,
    character_name text NOT NULL,
    year text,
    semester integer NOT NULL,
    subjects jsonb DEFAULT '{}'::jsonb,
    activities jsonb DEFAULT '[]'::jsonb,
    extra_activity jsonb DEFAULT '{}'::jsonb,
    magic_school_choices jsonb DEFAULT '{}'::jsonb,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_edited_at timestamp with time zone,
    last_edited_by uuid,
    spell_research_data jsonb DEFAULT '{}'::jsonb,
    dice_pool integer[],
    extra_fields_unlocked boolean DEFAULT false,
    is_draft boolean DEFAULT false NOT NULL,
    roll_assignments jsonb DEFAULT '{}'::jsonb,
    selected_magic_school text DEFAULT ''::text,
    relationships jsonb DEFAULT '[]'::jsonb,
    review_status text DEFAULT 'pending'::text,
    admin_feedback text DEFAULT ''::text,
    admin_notes text DEFAULT ''::text,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    selected_spells jsonb DEFAULT '{}'::jsonb,
    activity_progress jsonb DEFAULT '{}'::jsonb,
    school_year text,
    archived boolean DEFAULT false NOT NULL,
    CONSTRAINT character_downtime_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_money (
    id integer DEFAULT nextval('character_money_id_seq'::regclass) NOT NULL,
    character_id integer NOT NULL,
    discord_user_id text NOT NULL,
    total_knuts integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT character_money_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_notes (
    id integer DEFAULT nextval('character_notes_id_seq'::regclass) NOT NULL,
    character_id integer NOT NULL,
    user_id text NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT character_notes_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_npc_notes (
    id bigint DEFAULT nextval('character_npc_notes_id_seq'::regclass) NOT NULL,
    character_id bigint NOT NULL,
    discord_user_id text NOT NULL,
    npc_name text NOT NULL,
    npc_school text,
    npc_type text,
    notes text,
    relationship text DEFAULT 'unknown'::text,
    last_interaction text,
    custom_tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    connections jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT character_npc_notes_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_pc_notes (
    id bigint DEFAULT nextval('character_pc_notes_id_seq'::regclass) NOT NULL,
    character_id bigint NOT NULL,
    discord_user_id text NOT NULL,
    pc_name text NOT NULL,
    pc_school text,
    pc_clan text,
    notes text,
    relationship text DEFAULT 'unknown'::text,
    last_interaction text,
    custom_tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT character_pc_notes_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.character_resources (
    id bigint DEFAULT nextval('character_resources_id_seq'::regclass) NOT NULL,
    character_id bigint,
    discord_user_id text NOT NULL,
    corruption_points integer DEFAULT 0,
    sorcery_points integer DEFAULT 0,
    max_sorcery_points integer DEFAULT 0,
    spell_slots_1 integer DEFAULT 0,
    spell_slots_2 integer DEFAULT 0,
    spell_slots_3 integer DEFAULT 0,
    spell_slots_4 integer DEFAULT 0,
    spell_slots_5 integer DEFAULT 0,
    spell_slots_6 integer DEFAULT 0,
    spell_slots_7 integer DEFAULT 0,
    spell_slots_8 integer DEFAULT 0,
    spell_slots_9 integer DEFAULT 0,
    max_spell_slots_1 integer DEFAULT 0,
    max_spell_slots_2 integer DEFAULT 0,
    max_spell_slots_3 integer DEFAULT 0,
    max_spell_slots_4 integer DEFAULT 0,
    max_spell_slots_5 integer DEFAULT 0,
    max_spell_slots_6 integer DEFAULT 0,
    max_spell_slots_7 integer DEFAULT 0,
    max_spell_slots_8 integer DEFAULT 0,
    max_spell_slots_9 integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    inspiration boolean DEFAULT false,
    spell_bonus_dice jsonb,
    luck integer,
    CONSTRAINT character_resources_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.characters (
    id bigint DEFAULT nextval('characters_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    house text,
    casting_style text,
    subclass text,
    innate_heritage text,
    background text,
    standard_feats jsonb DEFAULT '[]'::jsonb,
    ability_scores jsonb NOT NULL,
    hit_points integer DEFAULT 0,
    level integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    wand_type text DEFAULT ''::text,
    magic_modifiers jsonb DEFAULT '{"charms": 0, "healing": 0, "divinations": 0, "transfiguration": 0, "jinxesHexesCurses": 0}'::jsonb,
    discord_user_id text NOT NULL,
    game_session character varying(50),
    active boolean DEFAULT true,
    archived_at timestamp with time zone,
    current_hit_dice integer,
    level1_choice_type character varying(20),
    current_hit_points integer,
    asi_choices jsonb DEFAULT '{}'::jsonb,
    initiative_ability character varying(20) DEFAULT 'dexterity'::character varying,
    skill_proficiencies text[],
    skill_expertise text[],
    image_url text,
    subclass_choices jsonb DEFAULT '{}'::jsonb,
    house_choices jsonb DEFAULT '{}'::jsonb,
    feat_choices jsonb DEFAULT '{}'::jsonb,
    base_ability_scores jsonb,
    calculated_ability_scores jsonb,
    base_skill_proficiencies text[],
    calculated_skill_proficiencies text[],
    tool_proficiencies jsonb DEFAULT '[]'::jsonb,
    heritage_choices jsonb DEFAULT '{}'::jsonb,
    innate_heritage_skills text[] DEFAULT '{}'::text[],
    corruption_points integer DEFAULT 0 NOT NULL,
    subclass_features jsonb DEFAULT '[]'::jsonb,
    subclass_level integer DEFAULT 1,
    school_year integer DEFAULT 1,
    notes text,
    casting_style_choices jsonb DEFAULT '{}'::jsonb,
    feature_uses jsonb DEFAULT '{}'::jsonb,
    language_proficiencies text[] DEFAULT '{}'::text[],
    metamagic_choices jsonb DEFAULT '{}'::jsonb,
    additional_feats jsonb DEFAULT '[]'::jsonb,
    ac jsonb DEFAULT '{"modifier": 0, "override": null}'::jsonb,
    spell_attack jsonb DEFAULT '{"modifier": 0, "override": null}'::jsonb,
    wand_info text,
    initiative jsonb DEFAULT '{"modifier": 0, "override": null}'::jsonb,
    additional_asi jsonb DEFAULT '[]'::jsonb,
    temp_hp integer DEFAULT 0,
    tool_expertise jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT characters_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.creatures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    discord_user_id text NOT NULL,
    name text NOT NULL,
    size text DEFAULT 'Medium'::text NOT NULL,
    type text DEFAULT 'Beast'::text NOT NULL,
    alignment text,
    armor_class integer DEFAULT 10 NOT NULL,
    armor_type text,
    hit_points integer DEFAULT 1 NOT NULL,
    hit_dice text,
    speed jsonb DEFAULT '{"walk": 30}'::jsonb,
    strength integer DEFAULT 10 NOT NULL,
    dexterity integer DEFAULT 10 NOT NULL,
    constitution integer DEFAULT 10 NOT NULL,
    intelligence integer DEFAULT 10 NOT NULL,
    wisdom integer DEFAULT 10 NOT NULL,
    charisma integer DEFAULT 10 NOT NULL,
    saving_throws jsonb,
    skills jsonb,
    damage_vulnerabilities text[],
    damage_resistances text[],
    damage_immunities text[],
    condition_immunities text[],
    senses jsonb DEFAULT '{"passive_perception": 10}'::jsonb,
    languages text[],
    special_traits jsonb,
    actions jsonb,
    reactions jsonb,
    legendary_actions jsonb,
    legendary_actions_per_round integer DEFAULT 0,
    lair_actions jsonb,
    description text,
    notes text,
    source text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    attacks jsonb,
    character_id integer,
    current_hit_points integer NOT NULL,
    image_url text,
    initiative_modifier integer DEFAULT 0,
    traits jsonb DEFAULT '[]'::jsonb,
    proficiencies jsonb DEFAULT '{}'::jsonb,
    resistances jsonb DEFAULT '{}'::jsonb,
    skill_proficiencies jsonb DEFAULT '{}'::jsonb,
    saving_throw_proficiencies jsonb DEFAULT '[]'::jsonb,
    selected_skills jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT creatures_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.custom_counters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id text NOT NULL,
    discord_user_id text NOT NULL,
    name text NOT NULL,
    counter_type text DEFAULT 'boolean'::text NOT NULL,
    current_value integer DEFAULT 0 NOT NULL,
    max_value integer,
    renews_on_long_rest boolean DEFAULT false NOT NULL,
    description text,
    color text DEFAULT '#6366f1'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    icon text,
    CONSTRAINT custom_counters_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.custom_melee_attacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id integer NOT NULL,
    discord_user_id text NOT NULL,
    name text NOT NULL,
    attack_ability_modifier text DEFAULT 'strength'::text NOT NULL,
    has_proficiency boolean DEFAULT true,
    magical_bonus integer DEFAULT 0,
    range text DEFAULT 'Melee'::text,
    damage_dice_count integer,
    damage_dice_type text DEFAULT 'd8'::text,
    damage_modifier integer DEFAULT 0,
    bonus_damage integer DEFAULT 0,
    damage_type text,
    additional_damage jsonb DEFAULT '[]'::jsonb,
    save_type text,
    save_effect text,
    description text,
    higher_levels text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    crit_range integer DEFAULT 20,
    damage_name text,
    CONSTRAINT custom_melee_attacks_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.custom_recipes (
    id integer DEFAULT nextval('custom_recipes_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(50),
    eating_time character varying(50),
    duration character varying(50),
    description text,
    created_by_character_id integer NOT NULL,
    qualities jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT custom_recipes_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.custom_spells (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id bigint NOT NULL,
    discord_user_id text NOT NULL,
    name text NOT NULL,
    spell_class text NOT NULL,
    level text NOT NULL,
    casting_time text NOT NULL,
    range text NOT NULL,
    duration text,
    components text,
    check_type text,
    save_type text,
    damage_type text,
    tags text,
    description text NOT NULL,
    higher_levels text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    damage_dice_count integer,
    damage_dice_type text,
    damage_modifier integer,
    status text DEFAULT 'known'::text,
    concentration boolean DEFAULT false,
    scaling_dice_count integer,
    scaling_dice_type character varying,
    scaling_per_level boolean DEFAULT true,
    CONSTRAINT custom_spells_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.discord_users (
    discord_user_id text NOT NULL,
    username text,
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT discord_users_pkey PRIMARY KEY (discord_user_id)
);

CREATE TABLE IF NOT EXISTS public.feats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    preview text,
    description jsonb DEFAULT '[]'::jsonb,
    benefits jsonb DEFAULT '{}'::jsonb,
    prerequisites jsonb,
    repeatable boolean DEFAULT false,
    repeatable_key text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT feats_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text DEFAULT 'other'::text NOT NULL,
    discord_webhook_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    archived boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    webhook_verified boolean DEFAULT false NOT NULL,
    CONSTRAINT game_sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id bigint DEFAULT nextval('inventory_items_id_seq'::regclass) NOT NULL,
    discord_user_id text NOT NULL,
    character_id bigint NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text,
    quantity integer DEFAULT 1 NOT NULL,
    value text DEFAULT ''::text,
    category text DEFAULT 'General'::text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    attunement_required boolean,
    is_attuned boolean DEFAULT false,
    recharge_type text,
    max_uses integer,
    current_uses integer,
    CONSTRAINT inventory_items_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.owl_mail (
    id bigint DEFAULT nextval('owl_mail_id_seq'::regclass) NOT NULL,
    sender_character_id bigint,
    recipient_character_id bigint,
    subject text NOT NULL,
    message text,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT owl_mail_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.spell_progress_summary (
    id integer DEFAULT nextval('spell_progress_summary_id_seq'::regclass) NOT NULL,
    character_id integer NOT NULL,
    discord_user_id text NOT NULL,
    spell_name text NOT NULL,
    successful_attempts integer DEFAULT 0,
    has_natural_twenty boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    has_failed_attempt boolean DEFAULT false NOT NULL,
    researched boolean DEFAULT false NOT NULL,
    has_arithmantic_tag boolean DEFAULT false,
    has_runic_tag boolean DEFAULT false,
    CONSTRAINT spell_progress_summary_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.spells (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
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
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT spells_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    discord_user_id text NOT NULL,
    username text,
    discord_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id integer DEFAULT nextval('user_roles_id_seq'::regclass) NOT NULL,
    discord_user_id text NOT NULL,
    role text NOT NULL,
    granted_by text,
    granted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_roles_pkey PRIMARY KEY (id)
);

-- 3b. Views -------------------------------------------------------------------
CREATE OR REPLACE VIEW public.enhanced_spells AS
  SELECT sps.id,
    sps.character_id,
    sps.discord_user_id,
    sps.spell_name,
    sps.successful_attempts,
    sps.has_natural_twenty,
    sps.created_at,
    sps.updated_at,
    sps.has_failed_attempt,
    sps.researched,
    sps.has_arithmantic_tag,
    sps.has_runic_tag,
    c.name AS character_name,
    c.subclass,
    c.subclass_features,
        CASE
            WHEN (sps.has_arithmantic_tag AND sps.has_runic_tag) THEN 'Both Tags'::text
            WHEN sps.has_arithmantic_tag THEN 'Arithmantic Only'::text
            WHEN sps.has_runic_tag THEN 'Runic Only'::text
            ELSE 'No Enhancement'::text
        END AS enhancement_level
   FROM (spell_progress_summary sps
     JOIN characters c ON ((sps.character_id = c.id)))
  WHERE ((sps.has_arithmantic_tag = true) OR (sps.has_runic_tag = true));

CREATE OR REPLACE VIEW public.user_role_status AS
  SELECT user_roles.discord_user_id,
        CASE
            WHEN ('forbidden'::text = ANY (array_agg(user_roles.role))) THEN 'forbidden'::text
            WHEN ('admin'::text = ANY (array_agg(user_roles.role))) THEN 'admin'::text
            WHEN ('moderator'::text = ANY (array_agg(user_roles.role))) THEN 'moderator'::text
            ELSE 'user'::text
        END AS effective_role,
    array_agg(DISTINCT user_roles.role) AS roles
   FROM user_roles
  GROUP BY user_roles.discord_user_id;

-- 4. Foreign keys -------------------------------------------------------------
ALTER TABLE public.character_activity_progress ADD CONSTRAINT character_activity_progress_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.character_downtime ADD CONSTRAINT character_downtime_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.character_npc_notes ADD CONSTRAINT character_npc_notes_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.character_pc_notes ADD CONSTRAINT character_pc_notes_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.character_resources ADD CONSTRAINT character_resources_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.characters ADD CONSTRAINT fk_characters_discord_user FOREIGN KEY (discord_user_id) REFERENCES discord_users(discord_user_id);
ALTER TABLE public.custom_spells ADD CONSTRAINT custom_spells_character_id_fkey FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.owl_mail ADD CONSTRAINT owl_mail_recipient_character_id_fkey FOREIGN KEY (recipient_character_id) REFERENCES characters(id) ON DELETE CASCADE;
ALTER TABLE public.owl_mail ADD CONSTRAINT owl_mail_sender_character_id_fkey FOREIGN KEY (sender_character_id) REFERENCES characters(id) ON DELETE CASCADE;
-- NOTE: production also has a duplicate FK `custom_spells_character_fkey` on the
-- same column; omitted here since it's redundant with custom_spells_character_id_fkey.

-- 5. Helper functions ---------------------------------------------------------
-- REQUIRED before the policies below — they call get_my_discord_user_id() and
-- is_user_admin() (both SECURITY DEFINER). The rest are trigger functions.
-- NOTE: update_spell_progress_simple() references a table `character_spell_progress`
-- that no longer exists in this schema; it is legacy and only errors if its
-- trigger ever fires. Left as-is to match production.

CREATE OR REPLACE FUNCTION public.get_my_discord_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(
    (SELECT raw_user_meta_data->>'provider_id'
     FROM auth.users
     WHERE id = auth.uid()),
    ''
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_user_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE discord_user_id = public.get_my_discord_user_id()
      AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_feats_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_custom_melee_attacks_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_custom_spells_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_creatures_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_character_downtime_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_character_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE characters
  SET updated_at = NOW()
  WHERE id = NEW.character_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.apply_researcher_enhancement()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If the character is a Researcher and the spell is being marked as researched
  IF NEW.researched = TRUE AND OLD.researched = FALSE THEN
    -- Check if character has Researcher feature
    IF EXISTS (
      SELECT 1 FROM characters
      WHERE id = NEW.character_id
      AND subclass_features @> '["Researcher"]'
    ) THEN
      -- Apply both tags
      NEW.has_arithmantic_tag = TRUE;
      NEW.has_runic_tag = TRUE;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_create_discord_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO discord_users (
    discord_user_id, username, display_name, created_at, updated_at
  )
  VALUES (
    NEW.discord_user_id,
    COALESCE(NEW.discord_user_id, 'Unknown'),
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (discord_user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_old_owl_mail()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM owl_mail
  WHERE created_at < NOW() - INTERVAL '15 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_character_spell_stats(char_id integer)
 RETURNS TABLE(total_spells_attempted integer, total_spells_mastered integer, total_spells_researched integer, total_spells_failed integer, total_enhanced_spells integer, arithmantic_spells integer, runic_spells integer, both_tags_spells integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_spells_attempted,
    COUNT(CASE WHEN successful_attempts >= 2 THEN 1 END)::INTEGER as total_spells_mastered,
    COUNT(CASE WHEN researched = TRUE THEN 1 END)::INTEGER as total_spells_researched,
    COUNT(CASE WHEN has_failed_attempt = TRUE THEN 1 END)::INTEGER as total_spells_failed,
    COUNT(CASE WHEN has_arithmantic_tag = TRUE OR has_runic_tag = TRUE THEN 1 END)::INTEGER as total_enhanced_spells,
    COUNT(CASE WHEN has_arithmantic_tag = TRUE THEN 1 END)::INTEGER as arithmantic_spells,
    COUNT(CASE WHEN has_runic_tag = TRUE THEN 1 END)::INTEGER as runic_spells,
    COUNT(CASE WHEN has_arithmantic_tag = TRUE AND has_runic_tag = TRUE THEN 1 END)::INTEGER as both_tags_spells
  FROM spell_progress_summary
  WHERE character_id = char_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_config(setting_name text, setting_value text, is_local boolean DEFAULT false)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_spell_progress_simple()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Legacy: references character_spell_progress, which is not part of this schema.
    INSERT INTO character_spell_progress (
        character_id, discord_user_id, spell_name, successful_attempts,
        has_natural_twenty, total_attempts, failed_attempts, updated_at
    )
    VALUES (
        NEW.character_id, NEW.discord_user_id, NEW.spell_name,
        CASE WHEN NEW.is_success THEN
            CASE WHEN NEW.is_natural_twenty THEN 2 ELSE 1 END
        ELSE 0 END,
        NEW.is_natural_twenty, 1,
        CASE WHEN NEW.is_success THEN 0 ELSE 1 END,
        NOW()
    )
    ON CONFLICT (character_id, discord_user_id, spell_name)
    DO UPDATE SET
        total_attempts = character_spell_progress.total_attempts + 1,
        failed_attempts = character_spell_progress.failed_attempts +
            CASE WHEN NEW.is_success THEN 0 ELSE 1 END,
        successful_attempts = CASE
            WHEN NEW.is_natural_twenty AND NEW.is_success THEN 2
            WHEN NEW.is_success AND character_spell_progress.has_natural_twenty = false THEN
                CASE WHEN character_spell_progress.successful_attempts + 1 > 2 THEN 2
                ELSE character_spell_progress.successful_attempts + 1 END
            ELSE character_spell_progress.successful_attempts
        END,
        has_natural_twenty = character_spell_progress.has_natural_twenty OR NEW.is_natural_twenty,
        updated_at = NOW();

    RETURN NEW;
END;
$function$;

-- 6. RLS + policies -----------------------------------------------------------
-- Without RLS policies the browser anon key can read/write freely (or nothing
-- works once RLS is enabled with no policy). Do not skip this section.
-- NOTE: several policy names below contain stray whitespace/newlines — that is
-- how they exist in production; left verbatim so this matches the live DB.
ALTER TABLE public.owl_mail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_pc_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_money ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spell_progress_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_downtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_activity_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_melee_attacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_npc_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY manage_own_character_activity_progress ON public.character_activity_progress AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_activity_progress.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_activity_progress.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY manage_own_character_downtime ON public.character_downtime AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_downtime.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_downtime.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY manage_own_character_money ON public.character_money AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_money.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_money.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY "Admins can delete all character notes" ON public.character_notes AS PERMISSIVE FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can insert all character notes" ON public.character_notes AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can update all character notes" ON public.character_notes AS PERMISSIVE FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can view all character notes" ON public.character_notes AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Users and admins can manage character notes" ON public.character_notes AS PERMISSIVE FOR ALL TO authenticated USING ((((( SELECT auth.jwt() AS jwt) ->> 'discord_user_id'::text) IN ( SELECT characters.discord_user_id
   FROM characters
  WHERE (characters.id = character_notes.character_id))) OR ((( SELECT auth.jwt() AS jwt) ->> 'role'::text) = 'admin'::text))) WITH CHECK ((((( SELECT auth.jwt() AS jwt) ->> 'discord_user_id'::text) IN ( SELECT characters.discord_user_id
   FROM characters
  WHERE (characters.id = character_notes.character_id))) OR ((( SELECT auth.jwt() AS jwt) ->> 'role'::text) = 'admin'::text)));
CREATE POLICY "Users and admins can view character notes" ON public.character_notes AS PERMISSIVE FOR SELECT TO authenticated USING ((((( SELECT auth.jwt() AS jwt) ->> 'discord_user_id'::text) IN ( SELECT characters.discord_user_id
   FROM characters
  WHERE (characters.id = character_notes.character_id))) OR ((( SELECT auth.jwt() AS jwt) ->> 'role'::text) = 'admin'::text)));
CREATE POLICY "Users can manage their own character notes" ON public.character_notes AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = (auth.uid())::text)) WITH CHECK ((user_id = (auth.uid())::text));
CREATE POLICY manage_own_character_notes ON public.character_notes AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_notes.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_notes.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY "Admins can delete all character npc notes" ON public.character_npc_notes AS PERMISSIVE FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can insert all character npc notes" ON public.character_npc_notes AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can update all character npc notes" ON public.character_npc_notes AS PERMISSIVE FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY "Admins can view all character npc notes" ON public.character_npc_notes AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.discord_user_id = (auth.uid())::text) AND (user_roles.role = 'admin'::text)))));
CREATE POLICY admin_manage_character_npc_notes ON public.character_npc_notes AS PERMISSIVE FOR ALL TO authenticated USING (( SELECT is_user_admin() AS is_user_admin)) WITH CHECK (( SELECT is_user_admin() AS is_user_admin));
CREATE POLICY manage_own_character_pc_notes ON public.character_pc_notes AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_pc_notes.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_pc_notes.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY manage_own_character_resources ON public.character_resources AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_resources.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_resources.character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY "Users can view active characters in same game" ON public.characters AS PERMISSIVE FOR SELECT TO authenticated USING ((active = true));
CREATE POLICY "Users can view their own characters" ON public.characters AS PERMISSIVE FOR SELECT TO authenticated USING ((discord_user_id = (auth.jwt() ->> 'provider_id'::text)));
CREATE POLICY manage_own_characters ON public.characters AS PERMISSIVE FOR ALL TO authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY view_active_characters ON public.characters AS PERMISSIVE FOR SELECT TO anon USING ((active = true));
CREATE POLICY manage_own_creatures ON public.creatures AS PERMISSIVE FOR ALL TO authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY view_all_creatures ON public.creatures AS PERMISSIVE FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all on custom_counters" ON public.custom_counters AS PERMISSIVE FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own custom melee attacks" ON public.custom_melee_attacks AS PERMISSIVE FOR DELETE TO public USING (true);
CREATE POLICY "Users can insert their own custom melee attacks" ON public.custom_melee_attacks AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can update their own custom melee attacks" ON public.custom_melee_attacks AS PERMISSIVE FOR UPDATE TO public USING (true);
CREATE POLICY "Users can view their own custom melee attacks" ON public.custom_melee_attacks AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY manage_own_custom_recipes ON public.custom_recipes AS PERMISSIVE FOR ALL TO authenticated USING (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = custom_recipes.created_by_character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = custom_recipes.created_by_character_id) AND (characters.discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id))))) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY manage_own_custom_spells ON public.custom_spells AS PERMISSIVE FOR ALL TO authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY "Allow authenticated users to insert discord_users" ON public.discord_users AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to read discord_users" ON public.discord_users AS PERMISSIVE FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own discord_users row" ON public.discord_users AS PERMISSIVE FOR UPDATE TO authenticated USING ((discord_user_id = ((auth.jwt() -> 'user_metadata'::text) ->> 'provider_id'::text))) WITH CHECK ((discord_user_id = ((auth.jwt() -> 'user_metadata'::text) ->> 'provider_id'::text)));
CREATE POLICY service_manage_discord_users ON public.discord_users AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY view_all_discord_users ON public.discord_users AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access on feats" ON public.feats AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Allow service role full access on feats" ON public.feats AS PERMISSIVE FOR ALL TO public USING ((auth.role() = 'service_role'::text));
CREATE POLICY game_sessions_insert ON public.game_sessions AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY game_sessions_select ON public.game_sessions AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY game_sessions_update ON public.game_sessions AS PERMISSIVE FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for authenticated users" ON public.inventory_items AS PERMISSIVE FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) IS NOT NULL));
CREATE POLICY "Enable insert access for authenticated users" ON public.inventory_items AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) IS NOT NULL));
CREATE POLICY "Enable read access for authenticated users" ON public.inventory_items AS PERMISSIVE FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) IS NOT NULL));
CREATE POLICY "Enable update access for authenticated users" ON public.inventory_items AS PERMISSIVE FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) IS NOT NULL));
CREATE POLICY manage_own_spell_progress ON public.spell_progress_summary AS PERMISSIVE FOR ALL TO authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY "Users can insert own profile" ON public.user_profiles AS PERMISSIVE FOR INSERT TO public WITH CHECK (((auth.uid())::text = discord_user_id));
CREATE POLICY manage_own_user_profile ON public.user_profiles AS PERMISSIVE FOR ALL TO authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin))) WITH CHECK (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));
CREATE POLICY view_all_user_profiles ON public.user_profiles AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY admin_manage_user_roles ON public.user_roles AS PERMISSIVE FOR ALL TO authenticated USING (( SELECT is_user_admin() AS is_user_admin)) WITH CHECK (( SELECT is_user_admin() AS is_user_admin));
CREATE POLICY service_manage_user_roles ON public.user_roles AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY view_own_user_roles ON public.user_roles AS PERMISSIVE FOR SELECT TO anon, authenticated USING (((discord_user_id = ( SELECT get_my_discord_user_id() AS get_my_discord_user_id)) OR ( SELECT is_user_admin() AS is_user_admin)));

-- =============================================================================
-- NOTES
--
-- * public.spell_schools: does NOT exist server-side (no table/view/matview).
--   It was only referenced by a dead useSpellSchools() hook (never imported),
--   which has been removed from the app, so nothing is created for it here.
--
-- * Triggers are defined below in section 7.
-- =============================================================================

-- 7. Triggers -----------------------------------------------------------------
-- Attach the trigger functions from section 5 to their tables.
CREATE TRIGGER handle_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_character_money_updated_at BEFORE UPDATE ON public.character_money FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER researcher_enhancement_trigger BEFORE UPDATE OF researched ON public.spell_progress_summary FOR EACH ROW EXECUTE FUNCTION apply_researcher_enhancement();
CREATE TRIGGER trigger_character_downtime_updated_at BEFORE UPDATE ON public.character_downtime FOR EACH ROW EXECUTE FUNCTION update_character_downtime_updated_at();
CREATE TRIGGER update_character_activity_progress_updated_at BEFORE UPDATE ON public.character_activity_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER ensure_discord_user_before_character_insert BEFORE INSERT ON public.characters FOR EACH ROW EXECUTE FUNCTION auto_create_discord_user();
CREATE TRIGGER update_custom_spells_updated_at BEFORE UPDATE ON public.custom_spells FOR EACH ROW EXECUTE FUNCTION update_custom_spells_updated_at();
CREATE TRIGGER update_creatures_updated_at BEFORE UPDATE ON public.creatures FOR EACH ROW EXECUTE FUNCTION update_creatures_updated_at();
CREATE TRIGGER update_custom_melee_attacks_updated_at BEFORE UPDATE ON public.custom_melee_attacks FOR EACH ROW EXECUTE FUNCTION update_custom_melee_attacks_updated_at();
CREATE TRIGGER update_spells_updated_at BEFORE UPDATE ON public.spells FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feats_updated_at BEFORE UPDATE ON public.feats FOR EACH ROW EXECUTE FUNCTION update_feats_updated_at();
