# build-notes.json

`build-notes.json` defines the translated build title and build-level editorial
notes.

```txt
src/content/<element>/<rarity>/<character>/<build>/build-notes.json
```

## Expected Shape

```json
{
  "best": true,
  "name": {
    "en": "[[element:melt]] DPS",
    "fr": "DPS [[element:melt]]"
  },
  "artifact": {
    "link": "https://example.com/artifact-calculation",
    "author": "AuthorName"
  },
  "weapons": {
    "link": "https://example.com/weapon-calculation",
    "author": "AuthorName"
  },
  "talent": {
    "link": "https://example.com/talent-calculation",
    "author": "AuthorName"
  },
  "notes": [
    {
      "en": "Use **Markdown** and [[character:bennett]] here.",
      "fr": "Utilisez **Markdown** et [[character:bennett]] ici.",
      "es": "Use texto localizado opcional aqui."
    }
  ]
}
```

## Fields

- `name`: Localized build title object.
  - `en` is the fallback title.
  - Other language keys are optional.
  - Supports inline translation tokens.
- `best`: Optional boolean. Use `true` for the role/build the character best
  excels at. This shows a badge on the closed build card header.
- `artifact`: Optional detailed artifact calculation credit.
- `weapons`: Optional detailed weapon calculation credit.
- `talent`: Optional detailed talent calculation credit.
- `notes`: Array of localized editorial note objects.
  - Each note item must include `en`.
  - Any other language key is optional, for example `fr`, `es`, `it`, `de`, or
    `ru`.
  - The requested language falls back to `en`.
  - Supports Markdown and inline translation tokens.

## Detailed Calculation Credits

Use these optional objects to show detailed calculation links at the top of the
Notes card:

```json
{
  "artifact": {
    "link": "https://example.com/artifact-calculation",
    "author": "AuthorName"
  },
  "weapons": {
    "link": "https://example.com/weapon-calculation",
    "author": "AuthorName"
  },
  "talent": {
    "link": "https://example.com/talent-calculation",
    "author": "AuthorName"
  }
}
```

Each object has:

- `link`: URL opened by the "Detailed ... calculation" link.
- `author`: Name shown after "Thank you to".

The current keys are intentionally:

- `artifact` for artifact calculations
- `weapons` for weapon calculations
- `talent` for talent calculations

## Required Rule

Use this shape for notes:

```json
{
  "notes": [
    {
      "en": "Required English fallback.",
      "fr": "Optional French translation."
    }
  ]
}
```
