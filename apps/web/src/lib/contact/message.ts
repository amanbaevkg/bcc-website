import type { ContactData } from './schema';

/** Plain labels for the e-mail BCC receives (in English, the team's working language). */
const officeLabels: Record<ContactData['officeType'], string> = {
  coworking: 'Co-Working Space',
  'private-office': 'Private Office',
};
const serviceLabels: Record<ContactData['services'][number], string> = {
  domiciliation: 'Company Creation/Domiciliation',
  accounting: 'Accounting Assistance',
  parking: 'Private Parking Space',
  mail: 'Mail Transfer Service',
  'meeting-rooms': 'Meeting Rooms',
  'private-cloud': 'Private Cloud',
  other: 'Other',
};

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

export function buildMessage(d: ContactData, locale: string) {
  const name = `${d.firstName} ${d.lastName}`.trim();
  const rows: [string, string][] = [
    ['Name', name],
    ['Company', d.company || '—'],
    ['Email', d.email],
    ['Phone', d.phone || '—'],
    ['Office type', officeLabels[d.officeType]],
    ['People', d.teamSize ?? '—'],
    ['Services', d.services.map((s) => serviceLabels[s]).join(', ')],
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
    subject: `Website enquiry: ${officeLabels[d.officeType]} — ${name}${d.company ? `, ${d.company}` : ''}`,
    text,
    html,
  };
}
