# Custom Recipes Database

## Table Structure

### Fields

| Field Name                | Type         | Required | Description                                                |
| ------------------------- | ------------ | -------- | ---------------------------------------------------------- |
| `id`                      | Serial       | Yes      | Primary key, auto-incremented unique identifier            |
| `name`                    | String (255) | Yes      | The name of the custom recipe                              |
| `category`                | String (50)  | No       | Recipe category (combat, support, utility, healing, etc.)  |
| `eating_time`             | String (50)  | No       | Time required to consume (e.g., "1 bonus action")          |
| `duration`                | String (50)  | No       | How long the recipe's effects last (e.g., "1 hour")        |
| `description`             | Text         | No       | Detailed description of the recipe's appearance and flavor |
| `created_by_character_id` | Integer      | Yes      | ID of the character who created and owns this recipe       |
| `qualities`               | JSONB        | Yes      | Recipe effects at different quality levels                 |
| `created_at`              | Timestamp    | No       | When the recipe was created (auto-generated)               |

## Example Data Object

```json
{
  "id": 15,
  "name": "Mystic Moonberry Tart",
  "category": "support",
  "eating_time": "1 bonus action",
  "duration": "30 minutes",
  "description": "A shimmering tart that glows with lunar energy, providing enhanced perception under moonlight. The berries seem to pulse with a soft silver light.",
  "created_by_character_id": 1,
  "qualities": {
    "flawed": "You gain darkvision for 30 feet for the duration, but only while in moonlight.",
    "regular": "You gain darkvision for 60 feet for the duration, regardless of lighting.",
    "exceptional": "You gain darkvision for 120 feet and can see invisible creatures within 30 feet for the duration.",
    "superior": "You gain truesight for 60 feet for the duration."
  },
  "created_at": "2025-01-15T14:30:22.123Z"
}
```

## Quality Levels Structure

The `qualities` field must contain all four quality levels:

- **flawed**: Basic/poor quality effects
- **regular**: Standard quality effects
- **exceptional**: High quality effects
- **superior**: Perfect quality effects

## Access Control

Custom recipes are **private** - only the character who created the recipe can access and use it.

# Recipe Progress Database

## Overview

The `recipe_progress` table tracks each character's progress with official recipes (IDs 1-22). It records whether they've attempted each recipe, their best quality achieved, and total attempt count.

## Table Structure

### Fields

| Field Name       | Type        | Required | Default      | Description                                                 |
| ---------------- | ----------- | -------- | ------------ | ----------------------------------------------------------- |
| `id`             | Serial      | Yes      | Auto         | Primary key, auto-incremented unique identifier             |
| `character_id`   | Integer     | Yes      | None         | ID of the character making progress                         |
| `recipe_id`      | Integer     | Yes      | None         | ID of the official recipe (1-22 only)                       |
| `attempted`      | Boolean     | Yes      | false        | Whether the character has attempted this recipe             |
| `best_quality`   | String (12) | No       | null         | Best quality achieved (flawed/regular/exceptional/superior) |
| `attempts_count` | Integer     | Yes      | 0            | Total number of attempts made                               |
| `created_at`     | Timestamp   | No       | CURRENT_TIME | When the progress record was first created                  |
| `updated_at`     | Timestamp   | No       | CURRENT_TIME | When the progress record was last updated                   |

### Constraints

- **Primary Key**: `id` - Ensures each progress record has a unique identifier
- **Unique**: `character_id` + `recipe_id` - One progress record per character per recipe
- **Check Constraint**: `best_quality` must be one of: 'flawed', 'regular', 'exceptional', 'superior'
- **Recipe ID Range**: Only official recipes (IDs 1-22) are tracked

### Indexes

- `character_id` - Fast lookup of all progress for a character
- `recipe_id` - Fast lookup of all character progress for a specific recipe
- `attempted` - Quick filtering of attempted vs unattempted recipes
- `best_quality` - Efficient queries by quality level

## Example Data Object

```json
{
  "id": 42,
  "character_id": 1,
  "recipe_id": 5,
  "attempted": true,
  "best_quality": "exceptional",
  "attempts_count": 7,
  "created_at": "2025-01-10T09:15:30.123Z",
  "updated_at": "2025-01-15T14:22:18.456Z"
}
```

## Quality Progression

Characters typically progress through quality levels:

1. **First Attempt**: `attempted` = true, `best_quality` might be 'flawed' or null (failed)
2. **Improvement**: `best_quality` upgrades to 'regular', 'exceptional', then 'superior'
3. **Tracking**: `attempts_count` increments with each try, `updated_at` reflects latest attempt

## Usage Notes

- Only tracks **official recipes** (IDs 1-22 from the JavaScript recipe data)
- Custom recipes are stored separately in `custom_recipes` table
- Progress records are created when a character first attempts a recipe
- `best_quality` remains null if character has never successfully created the recipe
