# talents.json

`talents.json` defines talent priority groups for one build.

```txt
src/content/<element>/<rarity>/<character>/<build>/talents.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Talent priority assumes this build's main rotation."
    }
  ],
  "talents": [
    {
      "items": [
        {
          "name": "Normal Attack",
          "note": {
            "en": "Level this first for Charged Attack builds."
          }
        }
      ]
    },
    {
      "items": [
        {
          "name": "Burst"
        },
        {
          "name": "Skill",
          "note": {
            "en": "Prioritize Skill first if this character is mainly used for shielding."
          }
        }
      ]
    }
  ]
}
```

## Fields

- `talents`: Ordered priority groups.
- `notes`: Optional section-level notes shown under
  `Regarding Talents Choices:` without adding a `*` marker to any talent.
- `talents[].items`: Talents in the same priority position. Multiple items
  render on one line with `=`.
- `items[].name`: Talent display name.
- `items[].note`: Optional localized editorial note.

## Notes

- Talent names are currently display strings, not centralized i18n IDs.
- Use multiple items in the same priority group when talents should be leveled
  equally:

```json
{
  "talents": [
    {
      "items": [
        {
          "name": "Burst"
        },
        {
          "name": "Skill",
          "note": {
            "en": "Prioritize Skill first if this character is mainly used for shielding."
          }
        }
      ]
    }
  ]
}
```

This renders as:

```txt
1. Burst = Skill*
```

- Notes support Markdown and inline translation tokens.
