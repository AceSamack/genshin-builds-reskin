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
            "en": "Level this first for Charged Attack builds.",
            "fr": "A monter en premier pour les builds d'attaques chargees."
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
            "en": "Prioritize Skill first if this character is mainly used for shielding.",
            "fr": "Priorisez le skill si ce personnage est surtout utilise pour son bouclier."
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
- `items[].note`: Optional localized editorial note. Adds a `*` marker beside
  the talent and renders in the talent notes section.

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
            "en": "Prioritize Skill first if this character is mainly used for shielding.",
            "fr": "Priorisez le skill si ce personnage est surtout utilise pour son bouclier."
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

- Adding `note` to a talent automatically adds a `*` marker next to that talent
  in the talent priority list.
- The same `note` also automatically creates a matching note entry under
  `Regarding Talents Choices:`.
- Notes support Markdown and inline translation tokens.

Example with the same note translated in different languages:

```json
{
  "name": "Burst",
  "note": {
    "en": "Level this first if most of the build's damage comes from Burst.",
    "fr": "A monter en premier si la majorite des degats du build viennent de l'ult."
  }
}
```
