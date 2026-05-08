# Genshin Builds Content Structure

This repository renders character build pages from JSON data stored under `content/`.

## Folder structure

- `content/`
  - `<element>/` (e.g. `pyro`, `electro`)
    - `<rarity>/` (e.g. `4`, `5`)
      - `<character>/` (e.g. `amber`)
        - `metadata.json`
        - `<build-name>/` (e.g. `melt-DPS`)
          - `weapons.json`
          - `artifacts-sets.json`
          - `artifacts-mainstats.json`
          - `artifacts-substats.json`
          - `talents.json`
          - `build-notes.json`

The page source is `src/pages/[...character].astro`, which resolves the URL parameter to a character directory under `content/`.

## How loading works

For each build, the page loads JSON in this priority order:

1. `content/<element>/<rarity>/<character>/<build-name>/<file>.json`
2. `content/<element>/<rarity>/<character>/<file>.json`

If the file exists at the build level, it is used. If not, the character-level JSON is used as a fallback.
If neither exists, `loadJSON()` returns `null`.

### Example

- If `melt-DPS/weapons.json` exists → it is used.
- Otherwise `amber/weapons.json` is used.

This applies to every JSON loaded by the page:

- `metadata.json`
- `weapons.json`
- `artifacts-sets.json`
- `artifacts-mainstats.json`
- `artifacts-substats.json`
- `talents.json`
- `build-notes.json`

## Expected JSON structure

### `metadata.json`

Used for the character header.

Fields:

- `weapon`: string — weapon type, e.g. `polearm`, `bow`, `sword`, `claymore`, `catalyst`
- `last_updated`: string — version or patch text used in the page header
- `image`: string — character portrait URL

Example:

```json
{
  "weapon": "polearm",
  "last_updated": "5.7",
  "image": "https://.../avatar.png"
}
```

### `weapons.json`

Contains ranked weapon options.

Root object:

- `weapons`: array of weapon groups

Each weapon group:

- `items`: array of weapon objects

Each weapon object may include:

- `name`: string
- `rarity`: number
- `refinement`: number (optional)
- `note`: string (optional)

The first item in each group is rendered as the main recommended weapon, and subsequent items are rendered as alternatives.

A `note` adds `*` next to the weapon entry and creates a note entry under the build Notes section.

Example:

```json
{
  "weapons": [
    {
      "items": [{ "name": "The First Great Magic", "rarity": 5 }]
    },
    {
      "items": [{ "name": "Aqua Simulacra", "rarity": 5 }]
    }
  ]
}
```

### `artifacts-sets.json`

Defines artifact set choices.

Root object:

- `artifact_sets`: array of artifact set groups

Each artifact set group:

- `items`: array of objects with `name` and `pieces`
- `choose`: boolean (optional) — if present and `true`, adds a [Choose Two] text after the list

Example:

```json
{
  "artifact_sets": [
    {
      "items": [{ "name": "Shimenawa's Reminiscence", "pieces": 4 }]
    },
    {
      "items": [
        { "name": "Crimson Witch of Flames", "pieces": 2 },
        { "name": "+80 EM set", "pieces": 2 }
      ],
      "choose": true
    }
  ]
}
```

### `artifacts-mainstats.json`

Lists recommended main stats for each artifact slot.

Root object:

- `main_stats`
  - `sands`: array of objects with `name` and optional `note`
  - `goblet`: array of objects with `name` and optional `note`
  - `circlet`: array of objects with `name` and optional `note`

A `note` adds `*` next to the stat and creates a note entry under the build Notes section.

Example:

```json
{
  "main_stats": {
    "sands": [{ "name": "ATK%" }, { "name": "Elemental Mastery" }],
    "goblet": [{ "name": "Pyro DMG" }],
    "circlet": [{ "name": "Crit DMG" }]
  }
}
```

### `artifacts-substats.json`

Defines substat priority.

Root object:

- `substats_priority`: array of strings or objects with `name` and optional `note`

A `note` adds `*` next to the substat and creates a note entry under the build Notes section.

Example:

```json
{
  "substats_priority": ["Crit DMG", "ATK%", "Elemental Mastery"]
}
```

### `talents.json`

Lists talent priorities.

Root object:

- `talents`: array of talent groups

Each talent group:

- `items`: array of objects with `name` and optional `note`

A `note` adds `*` next to the talent entry and creates a note entry under the build Notes section.

Example:

```json
{
  "talents": [
    { "items": [{ "name": "Normal Attack" }] },
    { "items": [{ "name": "Skill" }] }
  ]
}
```

### `build-notes.json`

Optional build notes and sources.

Fields:

- `artifact`: object with `link` and `author` (optional)
- `weapons`: object with `link` and `author` (optional)
- `talent`: object with `link` and `author` (optional)
- `notes`: array of markdown strings

The `notes` array is rendered as markdown.

Example:

```json
{
  "artifact": {
    "link": "https://example.com/artifact-source",
    "author": "AuthorName"
  },
  "weapons": {
    "link": "https://example.com/weapon-source",
    "author": "AuthorName"
  },
  "talent": {
    "link": "https://example.com/talent-source",
    "author": "AuthorName"
  },
  "notes": [
    "Amber Melt DPS is a playstyle where she uses Charged Attacks to trigger Melt.",
    "When attacking Weak Points, the attacks are guaranteed to Crit."
  ]
}
```

## Notes

- The code uses `fs.existsSync()` to detect whether a build-level JSON file exists.
- If the build-level file is missing, it attempts to load the corresponding file from the character root.
- The character header page uses `metadata.image` and `metadata.last_updated`.
