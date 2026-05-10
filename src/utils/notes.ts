import { marked } from 'marked';
import { getLocalizedNote } from './content';

function renderNote(note: string, sourceFile: string, translator: any) {
  const renderedNote = translator.translateNoteText(note, sourceFile);

  return (marked.parse(renderedNote) as string).replace(/<\/?p>/g, '');
}

function getNotePrefix(sourceFile: string) {
  if (sourceFile.endsWith('weapons.json')) return 'w';
  if (sourceFile.endsWith('artifacts-sets.json')) return 'as';
  if (sourceFile.endsWith('artifacts-mainstats.json')) return 'am';
  if (sourceFile.endsWith('artifacts-substats.json')) return 'at';
  if (sourceFile.endsWith('talents.json')) return 't';

  return 'n';
}

function createNoteId(sourceFile: string, index: number) {
  return `${getNotePrefix(sourceFile)}-${index + 1}`;
}

export function collectSectionNotes(
  data: any,
  sourceFile: string,
  lang: string,
  translator: any,
) {
  if (!Array.isArray(data?.notes)) return [];

  return data.notes
    .map((note: any) => getLocalizedNote({ note }, lang))
    .filter(Boolean)
    .map((note: string) => renderNote(note, sourceFile, translator));
}

export function collectNotes(
  groups: any[],
  formatter: (item: any) => string,
  sourceFile: string,
  lang: string,
  translator: any,
) {
  const notes: { id: string; name: string; note: string }[] = [];

  groups.forEach((group) => {
    group.items.forEach((item: any) => {
      const localizedNote = getLocalizedNote(item, lang);

      if (localizedNote) {
        const name = formatter(item);
        const noteId = createNoteId(sourceFile, notes.length);

        item.noteId = noteId;

        notes.push({
          id: noteId,
          name,
          note: renderNote(localizedNote, sourceFile, translator),
        });
      }
    });
  });

  return notes;
}

export function collectStatNotes(
  items: any[],
  formatter: (item: any) => string,
  sourceFile: string,
  lang: string,
  translator: any,
) {
  const notes: { id: string; name: string; note: string }[] = [];

  items.flatMap((item) => item.items ?? [item]).forEach((item) => {
    const localizedNote = getLocalizedNote(item, lang);

    if (localizedNote) {
      const name = formatter(item);
      const noteId = createNoteId(sourceFile, notes.length);

      item.noteId = noteId;

      notes.push({
        id: noteId,
        name,
        note: renderNote(localizedNote, sourceFile, translator),
      });
    }
  });

  return notes;
}
