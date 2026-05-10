# weapons.json

`weapons.json` defines ranked weapon recommendations for one build.

```txt
src/content/<element>/<rarity>/<character>/<build>/weapons.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Weapon rankings assume the listed rotation and team buffs."
    }
  ],
  "weapons": [
    {
      "items": [
        {
          "name": "amos-bow",
          "rarity": 5,
          "refinement": 1,
          "note": {
            "en": "Good with [[stat:atk%]].",
            "fr": "Bon avec [[stat:atk%]]."
          }
        }
      ]
    }
  ],
  "conditional": [
    {
      "name": "freedom-sworn",
      "rarity": 5,
      "refinement": "4+",
      "note": {
        "en": "Use only in the team described in notes."
      }
    }
  ]
}
```

## Fields

- `weapons`: Ordered ranking groups.
- `notes`: Optional section-level notes shown under
  `Regarding Weapons Choices:` without adding a `*` marker to any weapon.
- `weapons[].items`: Weapons in the same ranking position.
- `items[].name`: Weapon i18n ID from `src/i18n/<lang>/weapons.json`.
- `items[].rarity`: Weapon rarity, usually `3`, `4`, or `5`.
- `items[].refinement`: Optional refinement rank. Use a number for exact
  refinements, such as `5`, or a string for ranges, such as `"4+"`.
- `items[].note`: Optional editorial note.
- `conditional`: Optional unranked weapon list shown below the ranking under
  `Conditional (See Notes):`.

## Conditional Weapons

Use `conditional` for weapons that are only recommended under special conditions
explained in the notes.

Conditional weapons use the same item fields as ranked weapons:

```json
{
  "conditional": [
    {
      "name": "primordial-jade-cutter",
      "rarity": 5,
      "note": {
        "en": "Only valuable when the build can use the passive well."
      }
    }
  ]
}
```

## Notes

- `note` must have a `en` item as it is the fallback if no other translation was provided.
- Notes support Markdown (`**to make something bold**`) and inline translation tokens (referecing another weapon's name using `[[weapon:the-weapon-name]]` for example)
