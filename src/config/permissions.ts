import { roles, type Role } from "./roles";

export const permissions = {
  properties: {
    read: "properties:read",
    create: "properties:create",
    update: "properties:update",
    delete: "properties:delete",
    publish: "properties:publish",
  },
  blog: {
    read: "blog:read",
    create: "blog:create",
    update: "blog:update",
    delete: "blog:delete",
    publish: "blog:publish",
  },
  media: {
    read: "media:read",
    upload: "media:upload",
    delete: "media:delete",
  },
  users: {
    read: "users:read",
    create: "users:create",
    update: "users:update",
    delete: "users:delete",
  },
  settings: {
    read: "settings:read",
    update: "settings:update",
  },
  logs: {
    read: "logs:read",
  },
  contact: {
    read: "contact:read",
    respond: "contact:respond",
  },
  favorites: {
    read: "favorites:read",
    manage: "favorites:manage",
  },
  leads: {
    read: "leads:read",
    create: "leads:create",
    update: "leads:update",
    delete: "leads:delete",
  },
} as const;

export type Permission = {
  [K in keyof typeof permissions]: (typeof permissions)[K][keyof (typeof permissions)[K]];
}[keyof typeof permissions];

export const allPermissions: Permission[] = [
  ...Object.values(permissions.properties),
  ...Object.values(permissions.blog),
  ...Object.values(permissions.media),
  ...Object.values(permissions.users),
  ...Object.values(permissions.settings),
  ...Object.values(permissions.logs),
  ...Object.values(permissions.contact),
  ...Object.values(permissions.favorites),
  ...Object.values(permissions.leads),
];

export const rolePermissions: Record<Role, readonly Permission[]> = {
  [roles.SUPER_ADMIN]: allPermissions,
  [roles.ADMIN]: allPermissions.filter((p) => p !== permissions.users.delete),
  [roles.EDITOR]: [
    permissions.properties.read,
    permissions.properties.create,
    permissions.properties.update,
    permissions.properties.publish,
    permissions.blog.read,
    permissions.blog.create,
    permissions.blog.update,
    permissions.blog.publish,
    permissions.media.read,
    permissions.media.upload,
    permissions.favorites.read,
  ],
  [roles.AGENT]: [
    permissions.properties.read,
    permissions.properties.create,
    permissions.properties.update,
    permissions.blog.read,
    permissions.media.read,
    permissions.media.upload,
    permissions.favorites.read,
    permissions.favorites.manage,
    permissions.contact.read,
    permissions.leads.read,
    permissions.leads.create,
    permissions.leads.update,
  ],
  [roles.VIEWER]: [
    permissions.properties.read,
    permissions.blog.read,
    permissions.media.read,
    permissions.favorites.read,
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}
