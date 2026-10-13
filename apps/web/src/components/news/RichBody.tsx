import type React from 'react';
import type { RichDoc } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { image, type CmsMedia } from '@/lib/cms/map';
import { Photo } from '@/components/ui/Photo';
import styles from './RichBody.module.css';
import { safeHref } from './safeHref';

/**
 * Article text from the admin's rich-text editor, rendered as React elements (never raw HTML).
 * Only the structure the design supports: paragraphs, two heading levels, quotes, lists,
 * bold/italic/underline, links and photos; anything else shows as plain text.
 */
type Node = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  listType?: string;
  children?: Node[];
  fields?: { url?: string; newTab?: boolean; linkType?: string };
  value?: CmsMedia;
};

const BOLD = 1;
const ITALIC = 2;
const UNDERLINE = 8;

function renderNodes(nodes: Node[] | undefined, locale: Locale): React.ReactNode[] {
  return (nodes ?? []).map((n, i) => renderNode(n, i, locale));
}

function renderNode(n: Node, key: number, locale: Locale): React.ReactNode {
  const kids = () => renderNodes(n.children, locale);
  switch (n.type) {
    case 'text': {
      let el: React.ReactNode = n.text ?? '';
      const f = typeof n.format === 'number' ? n.format : 0;
      if (f & UNDERLINE) el = <u>{el}</u>;
      if (f & ITALIC) el = <em>{el}</em>;
      if (f & BOLD) el = <strong>{el}</strong>;
      return <span key={key}>{el}</span>;
    }
    case 'linebreak':
      return <br key={key} />;
    case 'paragraph':
      return <p key={key}>{kids()}</p>;
    case 'heading':
      return n.tag === 'h1' || n.tag === 'h2' ? (
        <h2 key={key}>{kids()}</h2>
      ) : (
        <h3 key={key}>{kids()}</h3>
      );
    case 'quote':
      return <blockquote key={key}>{kids()}</blockquote>;
    case 'list':
      return n.listType === 'number' ? <ol key={key}>{kids()}</ol> : <ul key={key}>{kids()}</ul>;
    case 'listitem':
      return <li key={key}>{kids()}</li>;
    case 'link':
    case 'autolink': {
      const href = safeHref(n.fields?.url);
      if (!href) return <span key={key}>{kids()}</span>;
      const external = href.startsWith('http');
      return (
        <a
          key={key}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {kids()}
        </a>
      );
    }
    case 'upload': {
      const img = image(n.value);
      return img ? (
        <Photo
          key={key}
          image={img}
          locale={locale}
          className={styles.photo}
          sizes="(width < 900px) 100vw, 760px"
        />
      ) : null;
    }
    default:
      return n.children ? <span key={key}>{kids()}</span> : null;
  }
}

export function RichBody({ doc, locale }: { doc: RichDoc; locale: Locale }) {
  const root = (doc as { root?: Node } | null)?.root;
  return <div className={styles.body}>{renderNodes(root?.children, locale)}</div>;
}
