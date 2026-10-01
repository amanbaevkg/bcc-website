import type { NewsPost } from '../types';

/**
 * TEST DATA ONLY. Lets the News templates be reviewed before BCC publishes real news.
 * Loaded only when NEWS_FIXTURES=1 and SITE_ENV is not "production"; every page that shows
 * it carries a visible "Test data" badge. These texts describe the template, not BCC.
 */
const text = (t: string) => ({ type: 'text', text: t, format: 0, version: 1 });
const block = (t: string, kind: 'p' | 'h2' | 'h3' | 'quote' = 'p') =>
  kind === 'p'
    ? { type: 'paragraph', version: 1, children: [text(t)] }
    : kind === 'quote'
      ? { type: 'quote', version: 1, children: [text(t)] }
      : { type: 'heading', tag: kind, version: 1, children: [text(t)] };
const doc = (...children: object[]) => ({ root: { type: 'root', version: 1, children } });

export const newsFixtures: NewsPost[] = [
  {
    slug: 'example-article',
    title: 'Example article: how a news post looks',
    date: '2026-09-15',
    excerpt:
      'Test data. This teaser shows how a short summary appears in the news list, limited to 400 characters in the editor.',
    cover: {
      src: '/images/home/space-lounge.jpg',
      width: 1280,
      height: 853,
      alt: { en: 'Lounge and meeting room with table football, TV and a large table' },
    },
    lang: 'en',
    fixture: true,
    author: 'Template preview',
    body: doc(
      block('Test data. The opening paragraph of an article appears here in a larger size.'),
      block('A subheading', 'h2'),
      block(
        'Body text sits in a comfortable reading width. Editors can use headings, quotes, bold and italic text, links and photos; colours and fonts stay fixed by the design.',
      ),
      block('A quote from the article stands out like this.', 'quote'),
      block('A smaller subheading', 'h3'),
      block('A closing paragraph ends the article, followed by a link back to all news.'),
    ),
  },
  {
    slug: 'second-example',
    title: 'Second example without a cover photo',
    date: '2026-08-02',
    excerpt: 'Test data. Posts without a cover photo get a plain card in the list.',
    lang: 'en',
    fixture: true,
    body: doc(block('Test data. A short article without a cover photo.')),
  },
];
