# artifacts-substats.json

`artifacts-substats.json` defines substat priority for one build.

```txt
src/content/<element>/<rarity>/<character>/<build>/artifacts-substats.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Substat priority changes after meeting the Energy Recharge target."
    }
  ],
  "substats_priority": [
    "er",
    {
      "name": "cr",
      "note": {
        "en": "Prioritize until your ratio is stable."
      }
    },
    {
      "items": [
        "atk%",
        "em"
      ]
    }
  ]
}
```

## Fields

- `substats_priority`: Ordered list of substats.
- `notes`: Optional top-level section notes shown under
  `Regarding Artifacts Choices:` without adding a `*` marker to any substat.
- Each item may be either:
  - a stat ID string, such as `"er"` or `"atk%"`
  - an object with `name` and optional `note`
  - an alternative group with `items`, where the first stat keeps the numbered
    rank and later stats render with `≈`
- `name`: Stat ID from `src/i18n/<lang>/stats.json`.
- `items`: List of stat strings or stat objects for same-rank alternatives.
- `note`: Optional localized editorial note.

## Notes

- String items are concise and should be used when no note is needed.
- Object items should be used when a substat needs an explanation.
- Alternative groups are useful when two stats share a priority slot:

```json
{
  "substats_priority": [
    {
      "name": "er",
      "note": {
        "en": "Prioritize first until you meet the requirement."
      }
    },
    "cr/cd",
    {
      "items": [
        "atk%",
        "em"
      ]
    }
  ]
}
```

This renders as:

```txt
1. Energy Recharge*
2. CRIT Rate / CRIT DMG
3. ATK%
≈ Elemental Mastery
```

- Notes support Markdown and inline translation tokens.
