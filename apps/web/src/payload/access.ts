import type { Access, FieldAccess } from 'payload';

/* Who may do what in the admin. The website itself reads through Payload's local API on the
 * server, which skips these checks, so nothing here is needed for visitors. */

type WithRole = { role?: string } | null | undefined;

export const signedIn: Access = ({ req }) => Boolean(req.user);
export const isAdmin: Access = ({ req }) => (req.user as WithRole)?.role === 'admin';
export const isAdminField: FieldAccess = ({ req }) => (req.user as WithRole)?.role === 'admin';
export const anyone: Access = () => true;

/** Admins manage every account; editors only see and change their own. */
export const adminOrSelf: Access = ({ req }) => {
  const user = req.user as (WithRole & { id?: string | number }) | null;
  if (!user) return false;
  if (user.role === 'admin') return true;
  return { id: { equals: user.id } };
};
