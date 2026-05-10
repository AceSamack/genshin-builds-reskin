import fs from 'fs';
import path from 'path';
import { getLocale, t } from './i18n';

export function getHomePageData(lang = 'en') {
  const locale = getLocale(lang);
  const contentPath = path.join(process.cwd(), 'src', 'content');

  const characters = fs
    .readdirSync(contentPath, { withFileTypes: true })
    .filter((element) => element.isDirectory())
    .flatMap((element) =>
      fs
        .readdirSync(path.join(contentPath, element.name), {
          withFileTypes: true,
        })
        .filter((rarity) => rarity.isDirectory())
        .flatMap((rarity) =>
          fs
            .readdirSync(path.join(contentPath, element.name, rarity.name), {
              withFileTypes: true,
            })
            .filter((character) => character.isDirectory())
            .map((character) => {
              const metadataPath = path.join(
                contentPath,
                element.name,
                rarity.name,
                character.name,
                'metadata.json',
              );
              const metadata = JSON.parse(
                fs.readFileSync(metadataPath, 'utf-8'),
              );
              const name = t(
                locale,
                'character',
                character.name,
                undefined,
                false,
              );

              return {
                name,
                slug: character.name,
                element: element.name,
                rarity: rarity.name,
                weapon: metadata.weapon,
                portrait: metadata.portrait,
              };
            }),
        ),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    characters,
    lang,
    locale,
  };
}
