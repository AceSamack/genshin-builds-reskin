import { t } from './i18n';

type TranslationCategory =
  | 'artifact'
  | 'weapon'
  | 'character'
  | 'stat'
  | 'element';

const CATEGORIES: TranslationCategory[] = [
  'artifact',
  'weapon',
  'character',
  'stat',
  'element',
];

/**
 * Helper class for translating structured content IDs and inline note references.
 *
 * Supports:
 * - translating artifact/weapon/character/stat/element IDs
 * - parsing inline note syntax like [[weapon:amos-bow]]
 * - tracking missing translation warnings
 */
export class TranslationHelper {
  // Collected missing translation warnings.
  private warnings: string[] = [];

  // Used to prevent duplicate warnings.
  private warningSet = new Set<string>();

  /**
   * Creates a new translation helper instance.
   *
   * @param locale Current locale object returned by getLocale().
   */
  constructor(private locale: any) {}

  /**
   * Translates a content ID from a specific category.
   *
   * If the translation is missing, a warning is stored and
   * the original ID is returned.
   *
   * @param category Translation category.
   * @param id Translation ID.
   * @param sourceFile Optional source file path for debugging.
   * @returns Translated string or original ID if missing.
   */
  translate(category: TranslationCategory, id: string, sourceFile?: string) {
    const translation = t(this.locale, category, id, sourceFile);

    if (translation === id) {
      this.addWarning(
        `[i18n] Missing translation for id '${id}' in category '${category}'` +
          (sourceFile ? ` (source: ${sourceFile})` : ''),
      );
    }

    return translation;
  }

  /**
   * Parses and translates inline note references.
   *
   * Supported syntax:
   * - [[weapon:amos-bow]]
   * - [[artifact:viridescent-venerer]]
   * - [[character:furina]]
   * - [[stat:er]]
   * - [[element:melt]]
   * - [[some-id]] (automatic category lookup)
   *
   * Unknown IDs are left unchanged and logged as warnings.
   *
   * @param text Raw note text.
   * @param sourceFile Optional source file path for debugging.
   * @returns Note text with translated inline references.
   */
  translateNoteText(text: string, sourceFile?: string) {
    return text.replace(
      /\[\[(?:(artifact|weapon|character|stat|element):)?([a-z0-9%/-]+)\]\]/g,
      (match, category: TranslationCategory | undefined, id: string) => {
        const translation = this.translateInlineId(id, category, sourceFile);

        return translation ?? match;
      },
    );
  }

  /**
   * Translates an inline note ID.
   *
   * If a category is provided, only that category is checked.
   * Otherwise, all known categories are searched.
   *
   * @param id Translation ID found inside an inline note reference.
   * @param category Optional translation category.
   * @param sourceFile Optional source file path for debugging.
   * @returns Translated string or null if no translation exists.
   */
  private translateInlineId(
    id: string,
    category?: TranslationCategory,
    sourceFile?: string,
  ) {
    if (category) {
      const translation = this.translate(category, id, sourceFile);
      return translation !== id ? translation : null;
    }

    return this.findTranslationInAnyCategory(id, sourceFile);
  }

  /**
   * Searches every known translation category for a matching ID.
   *
   * Used by inline note references without an explicit category,
   * such as [[er]] or [[melt]].
   *
   * @param id Translation ID to search for.
   * @param sourceFile Optional source file path for debugging.
   * @returns Translated string or null if no category contains the ID.
   */
  private findTranslationInAnyCategory(id: string, sourceFile?: string) {
    for (const category of CATEGORIES) {
      const translation = t(this.locale, category, id, sourceFile, false);

      if (translation !== id) {
        return translation;
      }
    }

    this.addWarning(
      `[i18n] Missing translation for id '${id}'` +
        (sourceFile ? ` (source: ${sourceFile})` : ''),
    );

    return null;
  }

  /**
   * Stores a warning if it has not already been added.
   *
   * @param warning Warning message to store.
   */
  private addWarning(warning: string) {
    if (!this.warningSet.has(warning)) {
      this.warningSet.add(warning);
      this.warnings.push(warning);
    }
  }

  /**
   * Returns all collected translation warnings.
   *
   * @returns Array of warning strings.
   */
  getWarnings() {
    return this.warnings;
  }
}
