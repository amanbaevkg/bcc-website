import type { CollectionConfig } from 'payload';
import { adminOrSelf, isAdmin, isAdminField } from '../access';
import { resetPasswordEmail, welcomeEmail } from '../email';

/** How long the link in the welcome e-mail works (password reset links: one hour). */
const WELCOME_LINK_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * People who can sign in to /admin with e-mail and password.
 * Admins manage accounts and legal pages; editors change content.
 * The first admin is created on the server's first start from PAYLOAD_ADMIN_EMAIL /
 * PAYLOAD_ADMIN_PASSWORD (see src/payload/bootstrap.ts), so the sign-up page never appears.
 * "Forgot password?" on the sign-in page e-mails a one-hour reset link, and someone an admin adds
 * gets a welcome e-mail with a link to choose their password (see src/payload/email.ts).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    defaultColumns: ['email', 'name', 'role'],
    description:
      'Adding someone: enter their e-mail and any password. They get an e-mail with a link to choose their own password.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      // At most one reset e-mail per account every 2 minutes.
      minRequestInterval: 2 * 60 * 1000,
      generateEmailSubject: () => 'Reset your password – BCC website admin',
      generateEmailHTML: resetPasswordEmail,
    },
  },
  hooks: {
    // The very first account is always an admin, whatever the form said: otherwise nobody
    // could add users or approve the legal pages.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
    // Someone added by an admin gets an e-mail with a link to choose their own password,
    // so no password has to be passed on. Not for the first account or the start-up admin.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || !req.user) return doc;
        try {
          const token = await req.payload.forgotPassword({
            collection: 'users',
            data: { email: doc.email },
            disableEmail: true,
            req,
          });
          await req.payload.db.updateOne({
            collection: 'users',
            id: doc.id,
            data: { resetPasswordExpiration: new Date(Date.now() + WELCOME_LINK_MS).toISOString() },
            req,
          });
          await req.payload.sendEmail({
            to: doc.email,
            subject: 'Your access to the BCC website admin',
            html: welcomeEmail({
              token,
              role: doc.role,
              by: (req.user as { name?: string; email?: string }).name || req.user.email,
            }),
          });
        } catch (error) {
          // The account exists either way; the person can still use "Forgot password?".
          req.payload.logger.error({ err: error }, `[admin] welcome e-mail to ${doc.email} failed`);
        }
        return doc;
      },
    ],
  },
  access: {
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Editor: changes texts, photos and lists', value: 'editor' },
        { label: 'Admin: also manages users and legal pages', value: 'admin' },
      ],
      access: { create: isAdminField, update: isAdminField },
      saveToJWT: true,
    },
  ],
};
