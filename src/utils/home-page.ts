import fs from 'fs';
import path from 'path';
import {
  getPublicCharacterName,
  getPublicCharacterSlug,
} from './character-slugs';
import { resolveCharacterAssetUrl } from './character-assets';
import { readJSONFile, toTitleCase } from './content';
import { getLocale } from './i18n';
import { TranslationHelper } from './translator';

function getBuildSummaries(
  characterPath: string,
  lang: string,
  translator: TranslationHelper,
) {
  return fs
    .readdirSync(characterPath, { withFileTypes: true })
    .filter((build) => build.isDirectory())
    .map((build) => {
      const buildNotesPath = path.join(
        characterPath,
        build.name,
        'build-notes.json',
      );
      const buildNoteData = fs.existsSync(buildNotesPath)
        ? readJSONFile(buildNotesPath)
        : null;
      const rawBuildName =
        buildNoteData?.name?.[lang] ??
        buildNoteData?.name?.en ??
        toTitleCase(build.name);

      return {
        name: translator.translateNoteText(rawBuildName, buildNotesPath),
      };
    });
}

/**
 * Builds the localized character list used by the home page.
 *
 * The content directory is the source of truth: element, rarity, and slug come
 * from folder names, while weapon and portrait come from metadata.json.
 *
 * @param lang Requested language code.
 * @returns Characters plus the matching locale bundle.
 */
export function getHomePageData(lang = 'en') {
  const locale = getLocale(lang);
  const contentPath = path.join(process.cwd(), 'src', 'content');
  const translator = new TranslationHelper(locale, {}, lang);

  // Walk element/rarity/character folders so new content appears automatically.
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
            .flatMap((character) => {
              const characterPath = path.join(
                contentPath,
                element.name,
                rarity.name,
                character.name,
              );
              const metadataPath = path.join(
                characterPath,
                'metadata.json',
              );

              if (!fs.existsSync(metadataPath)) {
                return [];
              }

              const metadata = readJSONFile(metadataPath);
              const assetContext = {
                element: element.name,
                rarity: rarity.name,
                character: character.name,
                characterPath,
              };
              const name = getPublicCharacterName(locale, {
                character: character.name,
                element: element.name,
              });

              return {
                name,
                slug: getPublicCharacterSlug({
                  character: character.name,
                  element: element.name,
                }),
                element: element.name,
                rarity: rarity.name,
                weapon: metadata.weapon,
                image: resolveCharacterAssetUrl(
                  assetContext,
                  metadata.image,
                  'image',
                ),
                portrait: resolveCharacterAssetUrl(
                  assetContext,
                  metadata.portrait,
                  'portrait',
                ),
                builds: getBuildSummaries(characterPath, lang, translator),
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
