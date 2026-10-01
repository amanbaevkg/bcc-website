import type { CollectionConfig } from 'payload';
import { adminOrSelf, isAdmin, isAdminField } from '../access';

/**
 * People who can sign in to /admin with e-mail and password.
 * Admins manage accounts and legal pages; editors change content.
 * The first admin is created on the server's first start from PAYLOAD_ADMIN_EMAIL /
 * PAYLOAD_ADMIN_PASSWORD (see src/payload/bootstrap.ts), so the sign-up page never appears.
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
