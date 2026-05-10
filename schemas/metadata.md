# metadata.json

`metadata.json` describes character-level display metadata. It lives in the
character folder, not inside a build folder.

```txt
src/content/<element>/<rarity>/<character>/metadata.json
```

## Expected Shape

```json
{
  "weapon": "bow",
  "last_updated": "5.7",
  "image": "https://example.com/character.png"
}
```

## Fields

- `weapon`: Character weapon type. Will be used later for sorting/filtering.
- `last_updated`: Genshin version string shown in the page header.
- `image`: Character image URL shown in the page header. Should come from the official hoyo-wiki.