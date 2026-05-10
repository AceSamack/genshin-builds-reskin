# Content JSON Architecture

This folder documents the expected shape of the JSON files under `src/content`.
These files are human-readable authoring guides, not strict machine validators.

## Folder Layout

Character content is organized by element, rarity, character slug, then build
slug:

```txt
src/content/<element>/<rarity>/<character>/<build>/
```

Example:

```txt
src/content/pyro/4/amber/melt-DPS/
```

Character-level files live directly inside the character folder:

```txt
src/content/pyro/4/amber/metadata.json
```

Build-level files live inside each build folder:

```txt
src/content/pyro/4/amber/melt-DPS/weapons.json
src/content/pyro/4/amber/melt-DPS/artifacts-sets.json
src/content/pyro/4/amber/melt-DPS/artifacts-mainstats.json
src/content/pyro/4/amber/melt-DPS/artifacts-substats.json
src/content/pyro/4/amber/melt-DPS/talents.json
src/content/pyro/4/amber/melt-DPS/build-notes.json
```

## Character Defaults and Build Overrides

Build JSON files can be shared at the character level to avoid duplicating
common data across builds.

When the site loads a build JSON file, it checks in this order:

```txt
1. src/content/<element>/<rarity>/<character>/<build>/<file>.json
2. src/content/<element>/<rarity>/<character>/<file>.json
```

If the build folder contains the file, that build-specific file is used. If the
build folder does not contain the file, the character-level file is used as the
default.

This is useful when multiple builds share the same values. For example, if two
Amber builds use the same artifact main stats, place the shared file here:

```txt
src/content/pyro/4/amber/artifacts-mainstats.json
```

Then only add this file inside a specific build folder when that build needs to
override the shared defaults:

```txt
src/content/pyro/4/amber/melt-DPS/artifacts-mainstats.json
```

This default-and-override behavior applies to build data loaded through the
content loader, including:

- `weapons.json`
- `artifacts-sets.json`
- `artifacts-mainstats.json`
- `artifacts-substats.json`
- `talents.json`
- `build-notes.json`

## Shared Rules

- Folder names are stable slugs and should not be translated.
- Gameplay names usually use IDs from `src/i18n/<lang>/*.json`.
- Editorial text is localized inline in content JSON.
- Localized editorial objects must include `en`; other languages are optional.
- Requested language falls back to `en`.
- Notes support Markdown and inline translation tokens.

## Section-Level Notes

Build data files can include top-level `notes` for comments that belong to the
whole section instead of one specific item.

Example:

```json
{
  "notes": [
    {
      "en": "This ranking assumes the team can maintain the required aura.",
      "fr": "Ce classement suppose que l'équipe peut maintenir l'aura requise."
    }
  ],
  "artifact_sets": []
}
```

Section-level notes render inside the matching notes section, such as
`Regarding Artifacts Choices:`, without adding a `*` marker to any listed item.

## i18n Dictionary Files

Each language folder can contain these translation dictionaries:

```txt
src/i18n/<lang>/weapons.json
src/i18n/<lang>/artifact-sets.json
src/i18n/<lang>/characters.json
src/i18n/<lang>/stats.json
src/i18n/<lang>/elements.json
src/i18n/<lang>/ui.json
```

Use `stats.json` for stat labels and stat-like pseudo-set labels, such as `er`,
`atk%`, `cr`, `em-set`, and `atk-set`.

Use `elements.json` for elemental labels and reactions, such as `melt`,
`vaporize`, `swirl`, and `bloom`.

## Inline Translation Tokens

Editorial text can reference i18n IDs:

```txt
[[weapon:amos-bow]]
[[artifact:noblesse-oblige]]
[[character:xingqiu]]
[[stat:er]]
[[element:melt]]
[[er]]
```

Typed tokens search a specific category. Untyped tokens search known categories.

## File Guides

- [metadata.md](./metadata.md)
- [build-notes.md](./build-notes.md)
- [weapons.md](./weapons.md)
- [artifacts-sets.md](./artifacts-sets.md)
- [artifacts-mainstats.md](./artifacts-mainstats.md)
- [artifacts-substats.md](./artifacts-substats.md)
- [talents.md](./talents.md)
