import type { CollectionConfig } from 'payload';
import { adminOrSelf, isAdmin, isAdminField } from '../access';
import { resetPasswordEmail } from '../email';

/**
 * People who can sign in to /admin with e-mail and password.
 * Admins manage accounts and legal pages; editors change content.
 * The first admin is created on the server's first start from PAYLOAD_ADMIN_EMAIL /
 * PAYLOAD_ADMIN_PASSWORD (see src/payload/bootstrap.ts), so the sign-up page never appears.
 * "Forgot password?" on the sign-in page e-mails a one-hour reset link (see src/payload/email.ts).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: { useAsTitle: 'email', group: 'Settings', defaultColumns: ['email', 'name', 'role'] },
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
