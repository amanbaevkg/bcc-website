import type { NewsPost } from '../types';

/**
 * TEST DATA ONLY. Lets the News templates be reviewed before BCC publishes real news.
 * Loaded only when NEWS_FIXTURES=1 and SITE_ENV is not "production"; every page that shows
 * it carries a visible "Test data" badge. These texts describe the template, not BCC.
 */
const block = (key: string, text: string, style = 'normal') => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
});

export const newsFixtures: NewsPost[] = [
  {
    slug: 'example-article',
    title: 'Example article: how a news post looks',
    date: '2026-09-15',
    excerpt:
      'Test data. This teaser shows how a short summary appears in the news list, limited to 250 characters in the editor.',
    cover: {
      src: '/images/home/space-lounge.jpg',
      width: 1280,
      height: 853,
      alt: { en: 'Lounge and meeting room with table football, TV and a large table' },
    },
    lang: 'en',
    fixture: true,
    author: 'Template preview',
    body: [
      block('a', 'Test data. The opening paragraph of an article appears here in a larger size.'),
      block('b', 'A subheading', 'h2'),
      block(
        'c',
        'Body text sits in a comfortable reading width. Editors can use headings, quotes, bold and italic text, links and photos; colours and fonts stay fixed by the design.',
      ),
      block('d', 'A quote from the article stands out like this.', 'blockquote'),
      block('e', 'A smaller subheading', 'h3'),
      block('f', 'A closing paragraph ends the article, followed by a link back to all news.'),
    ],
  },
  {
    slug: 'second-example',
    title: 'Second example without a cover photo',
    date: '2026-08-02',
    excerpt: 'Test data. Posts without a cover photo get a plain card in the list.',
    lang: 'en',
    fixture: true,
    body: [block('a', 'Test data. A short article without a cover photo.')],
  },
];
