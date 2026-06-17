export const routes = {
  public: {
    home: "/",
    properties: "/properties",
    propertyDetail: (slug: string) => `/properties/${slug}` as const,
    blog: "/blog",
    blogPost: (slug: string) => `/blog/${slug}` as const,
    contact: "/contact",
    about: "/about",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  admin: {
    root: "/admin",
    dashboard: "/admin",
    properties: "/admin/properties",
    propertyCreate: "/admin/properties/new",
    propertyEdit: (id: string) => `/admin/properties/${id}/edit` as const,
    blog: "/admin/blog",
    media: "/admin/media",
    leads: "/admin/leads",
    favorites: "/admin/favorites",
    contact: "/admin/contact",
    users: "/admin/users",
    settings: "/admin/settings",
    logs: "/admin/logs",
  },
  api: {
    auth: "/api/auth",
    health: "/api/health",
  },
} as const;

export type Routes = typeof routes;
