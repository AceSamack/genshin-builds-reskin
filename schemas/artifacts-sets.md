# artifacts-sets.json

`artifacts-sets.json` defines ranked artifact set recommendations for one build.

```txt
src/content/<element>/<rarity>/<character>/<build>/artifacts-sets.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "This ranking assumes the team can maintain the required aura."
    }
  ],
  "artifact_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "emblem-of-severed-fate",
              "pieces": 4,
              "note": {
                "en": "Use if the Energy Recharge requirement is high."
              }
            }
          ]
        }
      ]
    },
    {
      "groups": [
        {
          "items": [
            {
              "name": "nymphs-dream",
              "pieces": 4
            }
          ]
        },
        {
          "items": [
            {
              "name": "a-day-carved-from-rising-winds",
              "pieces": 4
            }
          ]
        },
        {
          "choose": true,
          "items": [
            {
              "name": "noblesse-oblige",
              "pieces": 2
            },
            {
              "name": "hydro-dmg-set",
              "pieces": 2
            },
            {
              "name": "atk-set",
              "pieces": 2
            },
            {
              "name": "emblem-of-severed-fate",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ],
  "conditional": [
    {
      "items": [
        {
          "name": "blizzard-strayer",
          "pieces": 4,
          "note": {
            "en": "Only useful when the enemy can stay Frozen."
          }
        }
      ]
    }
  ]
}
```

## Fields

- `artifact_sets`: Ordered ranking entries.
- `notes`: Optional section-level notes shown under
  `Regarding Artifacts Choices:` without adding a `*` marker to any set.
- `artifact_sets[].groups`: Rendered lines for that ranking entry.
  - The first group renders as the numbered line.
  - Later groups render as `≈` alternatives.
- `groups[].items`: Artifact sets shown on the same rendered line.
- `groups[].choose`: Optional boolean. Use `true` when that line is a
  choose-two mix.
- `items[].name`: Artifact i18n ID from `src/i18n/<lang>/artifact-sets.json`,
  or a stat pseudo-set ID from `src/i18n/<lang>/stats.json`, such as `atk-set`
  or `em-set`.
- `items[].pieces`: Number of set pieces, usually `2` or `4`.
- `items[].note`: Optional localized editorial note.
- `conditional`: Optional unranked artifact set groups shown below the ranking
  under `Conditional (See Notes):`.

## Group Rules

Every ranked artifact entry must use `groups`.

Use one group for a simple ranked set:

```json
{
  "groups": [
    {
      "items": [{ "name": "noblesse-oblige", "pieces": 4 }]
    }
  ]
}
```

Use multiple groups for alternatives:

```json
{
  "groups": [
    {
      "items": [{ "name": "nymphs-dream", "pieces": 4 }]
    },
    {
      "items": [{ "name": "a-day-carved-from-rising-winds", "pieces": 4 }]
    },
    {
      "choose": true,
      "items": [
        { "name": "noblesse-oblige", "pieces": 2 },
        { "name": "hydro-dmg-set", "pieces": 2 },
        { "name": "atk-set", "pieces": 2 },
        { "name": "emblem-of-severed-fate", "pieces": 2 }
      ]
    }
  ]
}
```

Do not put `items` or `choose` directly on an `artifact_sets[]` entry.

## Conditional Sets

Use `conditional` for artifact sets that are only recommended under special
conditions explained in notes:

```json
{
  "conditional": [
    {
      "items": [
        {
          "name": "blizzard-strayer",
          "pieces": 4,
          "note": {
            "en": "Only valuable when enemies can stay Frozen."
          }
        }
      ]
    }
  ]
}
```

## Notes

- Notes support Markdown and inline translation tokens.
- Artifact set names are translated before rendering.
