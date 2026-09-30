import { z } from 'zod';

/**
 * The contact form's fields, shared by the browser (instant feedback) and the API
 * (the only check that counts). Options follow the current form on businesscentercapellen.lu.
 */
export const officeTypes = ['coworking', 'private-office'] as const;
export const teamSizes = ['1-2', '3-4', '4-6', '6-8', '8+'] as const;
export const services = [
  'domiciliation',
  'accounting',
  'parking',
  'mail',
  'meeting-rooms',
  'private-cloud',
  'other',
] as const;

// No line breaks in single-line fields: they end up in e-mail headers (subject, reply-to name).
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: 'tooLong' })
    .refine((v) => !/[\r\n]/.test(v), { error: 'invalid' });

export const contactSchema = z.object({
  firstName: line(80).min(1, { error: 'required' }),
  lastName: line(80).min(1, { error: 'required' }),
  company: line(120).optional().default(''),
  email: z
    .string()
    .trim()
    .max(200, { error: 'tooLong' })
    .pipe(z.email({ error: 'email' })),
  phone: line(40)
    .refine((v) => v === '' || /^[+()\d\s./-]{6,40}$/.test(v), { error: 'phone' })
    .optional()
    .default(''),
  officeType: z.enum(officeTypes, { error: 'required' }),
  teamSize: z.enum(teamSizes).optional(),
  services: z.array(z.enum(services)).min(1, { error: 'services' }).max(services.length),
  message: z.string().trim().max(2000, { error: 'tooLong' }).optional().default(''),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Anti-spam fields sent alongside the form data. */
export const envelopeSchema = z.object({
  locale: z.enum(['en', 'fr', 'de', 'lu']),
  /** Honeypot: a field hidden from people. Bots fill it in. */
  website: z.string().max(200).optional().default(''),
  /** Milliseconds between the form appearing and being sent. People need more than a few seconds. */
  elapsedMs: z.number().int().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
});

export const requestSchema = z.object({ form: contactSchema, meta: envelopeSchema });

/** Maps the hero finder's choice (?workspace=…&team=…) onto the form. */
export function prefillFromQuery(params: {
  workspace?: string;
  team?: string;
}): Partial<ContactInput> {
  const out: Partial<ContactInput> = {};
  switch (params.workspace) {
    case 'private-office':
      out.officeType = 'private-office';
      break;
    case 'coworking':
      out.officeType = 'coworking';
      break;
    case 'meeting-room':
      out.services = ['meeting-rooms'];
      break;
    case 'domiciliation':
      out.services = ['domiciliation'];
      break;
  }
  const n = Number(params.team);
  if (out.officeType === 'private-office' && Number.isFinite(n) && n > 0) {
    out.teamSize = n <= 2 ? '1-2' : n <= 4 ? '3-4' : n <= 6 ? '4-6' : n <= 8 ? '6-8' : '8+';
  }
  return out;
}
