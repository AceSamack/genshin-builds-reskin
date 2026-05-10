# artifacts-mainstats.json

`artifacts-mainstats.json` defines main stat priorities for sands, goblet, and
circlet.

```txt
src/content/<element>/<rarity>/<character>/<build>/artifacts-mainstats.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Main stat rankings assume the listed Energy Recharge target is met."
    }
  ],
  "main_stats": {
    "sands": [
      {
        "name": "atk%"
      },
      {
        "name": "em",
        "note": {
          "en": "Use when reaction damage matters."
        }
      }
    ],
    "goblet": [
      {
        "name": "Pyro DMG"
      }
    ],
    "circlet": [
      {
        "name": "cr"
      }
    ]
  }
}
```

## Fields

- `main_stats`: Object containing exactly these artifact slots:
  - `sands`
  - `goblet`
  - `circlet`
- Each slot is an ordered array of stat items.
- `name`: Main stat ID or display string.
- `note`: Optional localized editorial note.
- `notes`: Optional top-level section notes shown under
  `Regarding Artifacts Choices:` without adding a `*` marker to any stat.

## Notes

- Stat IDs such as `atk%`, `em`, `cr`, and `cd` are translated through
  `src/i18n/<lang>/stats.json`.
- Custom display strings such as `Pyro DMG` can be used when no i18n ID exists.
- Notes support Markdown and inline translation tokens.
