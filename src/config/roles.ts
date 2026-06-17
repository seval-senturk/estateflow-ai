export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  AGENT: "AGENT",
  VIEWER: "VIEWER",
} as const;

export type Role = (typeof roles)[keyof typeof roles];

export const roleHierarchy: Record<Role, number> = {
  [roles.SUPER_ADMIN]: 100,
  [roles.ADMIN]: 80,
  [roles.AGENT]: 50,
  [roles.VIEWER]: 10,
};

export const roleLabels: Record<Role, string> = {
  [roles.SUPER_ADMIN]: "Super Admin",
  [roles.ADMIN]: "Administrator",
  [roles.AGENT]: "Agent",
  [roles.VIEWER]: "Viewer",
};
