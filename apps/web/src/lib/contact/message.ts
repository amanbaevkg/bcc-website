import type { ContactChoice } from '@/content/types';
import type { ContactData } from './schema';

/** The form's answers as the admin lists them (Contact page → 2. Form). */
export type ContactChoices = { officeTypes: ContactChoice[]; services: ContactChoice[] };

/** Plain label for the e-mail BCC receives (in English, the team's working language). */
const labelOf = (list: ContactChoice[], id: string) =>
  list.find((c) => c.id === id)?.label.en ?? id;

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

export function buildMessage(d: ContactData, locale: string, choices: ContactChoices) {
  const office = labelOf(choices.officeTypes, d.officeType);
  const name = `${d.firstName} ${d.lastName}`.trim();
  const rows: [string, string][] = [
    ['Name', name],
    ['Company', d.company || '—'],
    ['Email', d.email],
    ['Phone', d.phone || '—'],
    ['Office type', office],
    ['People', d.teamSize ?? '—'],
    ['Services', d.services.map((s) => labelOf(choices.services, s)).join(', ')],
    ['Site language', locale.toUpperCase()],
  ];
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (d.message ? `\n\nMessage:\n${d.message}` : '');
  const html =
    '<table cellpadding="6" style="font:14px/1.5 Arial,sans-serif;border-collapse:collapse">' +
    rows
      .map(
        ([k, v]) => `<tr><th align="left" valign="top">${escape(k)}</th><td>${escape(v)}</td></tr>`,
      )
      .join('') +
    '</table>' +
    (d.message
      ? `<p style="font:14px/1.5 Arial,sans-serif;white-space:pre-wrap">${escape(d.message)}</p>`
      : '');
  return {
    subject: `Website enquiry: ${office} — ${name}${d.company ? `, ${d.company}` : ''}`,
    text,
    html,
  };
}
