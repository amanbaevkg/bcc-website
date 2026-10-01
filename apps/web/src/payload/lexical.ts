import type { TextRun } from '@/content/types';

/*
 * The offer texts are short paragraphs with bold runs. In the admin they are a Lexical rich-text
 * field limited to bold; these helpers convert between that and the site's TextRun[] lists.
 */

type LexNode = {
  type?: string;
  text?: string;
  format?: number | string;
  children?: LexNode[];
};
export type LexicalDoc = { root?: LexNode } | null | undefined;

const BOLD = 1;

export function runsFromLexical(doc: LexicalDoc): TextRun[] | undefined {
  const out: TextRun[] = [];
  (doc?.root?.children ?? []).forEach((p, i) => {
    if (i > 0 && out.length) out.push(' ');
    for (const c of p.children ?? []) {
      if (c.type !== 'text' || !c.text) continue;
      const bold = typeof c.format === 'number' && (c.format & BOLD) === BOLD;
      out.push(bold ? { strong: c.text } : c.text);
    }
  });
  return out.some((r) => (typeof r === 'string' ? r.trim() : r.strong.trim())) ? out : undefined;
}

const textNode = (text: string, bold: boolean) => ({
  type: 'text',
  text,
  format: bold ? BOLD : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
});

export function paragraphs(...paras: TextRun[][]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paras.map((runs) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: runs.map((r) =>
          typeof r === 'string' ? textNode(r, false) : textNode(r.strong, true),
        ),
      })),
    },
  };
}
