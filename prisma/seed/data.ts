export const ROLES = [
  {
    name: "Super Admin",
    slug: "SUPER_ADMIN",
    description: "Full system access with unrestricted permissions",
    level: 100,
    isSystem: true,
  },
  {
    name: "Admin",
    slug: "ADMIN",
    description: "Administrative access to manage platform operations",
    level: 80,
    isSystem: true,
  },
  {
    name: "Editor",
    slug: "EDITOR",
    description: "Content management for properties and blog",
    level: 60,
    isSystem: true,
  },
  {
    name: "Agent",
    slug: "AGENT",
    description: "Real estate agent with listing and lead management",
    level: 50,
    isSystem: true,
  },
  {
    name: "Viewer",
    slug: "VIEWER",
    description: "Read-only access to published content",
    level: 10,
    isSystem: true,
  },
] as const;

export const PERMISSIONS = [
  // Properties
  { name: "Read Properties", slug: "properties:read", module: "properties" },
  { name: "Create Properties", slug: "properties:create", module: "properties" },
  { name: "Update Properties", slug: "properties:update", module: "properties" },
  { name: "Delete Properties", slug: "properties:delete", module: "properties" },
  { name: "Publish Properties", slug: "properties:publish", module: "properties" },
  // Blog
  { name: "Read Blog", slug: "blog:read", module: "blog" },
  { name: "Create Blog", slug: "blog:create", module: "blog" },
  { name: "Update Blog", slug: "blog:update", module: "blog" },
  { name: "Delete Blog", slug: "blog:delete", module: "blog" },
  { name: "Publish Blog", slug: "blog:publish", module: "blog" },
  // Media
  { name: "Read Media", slug: "media:read", module: "media" },
  { name: "Upload Media", slug: "media:upload", module: "media" },
  { name: "Delete Media", slug: "media:delete", module: "media" },
  // Users
  { name: "Read Users", slug: "users:read", module: "users" },
  { name: "Create Users", slug: "users:create", module: "users" },
  { name: "Update Users", slug: "users:update", module: "users" },
  { name: "Delete Users", slug: "users:delete", module: "users" },
  // Settings
  { name: "Read Settings", slug: "settings:read", module: "settings" },
  { name: "Update Settings", slug: "settings:update", module: "settings" },
  // Logs
  { name: "Read Logs", slug: "logs:read", module: "logs" },
  // Contact
  { name: "Read Contact", slug: "contact:read", module: "contact" },
  { name: "Respond Contact", slug: "contact:respond", module: "contact" },
  // Favorites
  { name: "Read Favorites", slug: "favorites:read", module: "favorites" },
  { name: "Manage Favorites", slug: "favorites:manage", module: "favorites" },
  // CRM (Phase 10)
  { name: "Read Leads", slug: "leads:read", module: "leads" },
  { name: "Create Leads", slug: "leads:create", module: "leads" },
  { name: "Update Leads", slug: "leads:update", module: "leads" },
  { name: "Delete Leads", slug: "leads:delete", module: "leads" },
] as const;

export const ROLE_PERMISSION_MAP: Record<string, readonly string[]> = {
  SUPER_ADMIN: PERMISSIONS.map((p) => p.slug),
  ADMIN: PERMISSIONS.filter((p) => p.slug !== "users:delete").map((p) => p.slug),
  EDITOR: [
    "properties:read",
    "properties:create",
    "properties:update",
    "properties:publish",
    "blog:read",
    "blog:create",
    "blog:update",
    "blog:publish",
    "media:read",
    "media:upload",
    "favorites:read",
  ],
  AGENT: [
    "properties:read",
    "properties:create",
    "properties:update",
    "blog:read",
    "media:read",
    "media:upload",
    "favorites:read",
    "favorites:manage",
    "contact:read",
    "leads:read",
    "leads:create",
    "leads:update",
  ],
  VIEWER: [
    "properties:read",
    "blog:read",
    "media:read",
    "favorites:read",
  ],
};

export const PROPERTY_STATUSES = [
  { name: "Draft", slug: "draft", description: "Property is being prepared", color: "#6B7280", sortOrder: 1, isDefault: true },
  { name: "Active", slug: "active", description: "Property is live and available", color: "#10B981", sortOrder: 2, isDefault: false },
  { name: "Pending", slug: "pending", description: "Awaiting approval or verification", color: "#F59E0B", sortOrder: 3, isDefault: false },
  { name: "Sold", slug: "sold", description: "Property has been sold", color: "#3B82F6", sortOrder: 4, isDefault: false },
  { name: "Rented", slug: "rented", description: "Property has been rented", color: "#8B5CF6", sortOrder: 5, isDefault: false },
  { name: "Archived", slug: "archived", description: "Property is no longer active", color: "#9CA3AF", sortOrder: 6, isDefault: false },
] as const;

export const PROPERTY_CATEGORIES = [
  { name: "Konut", slug: "konut", description: "Daire ve apartman daireleri", sortOrder: 1 },
  { name: "Villa", slug: "villa", description: "Müstakil villalar", sortOrder: 2 },
  { name: "Rezidans", slug: "rezidans", description: "Lüks rezidans projeleri", sortOrder: 3 },
  { name: "Arsa", slug: "arsa", description: "İmarlı ve imarsız arsalar", sortOrder: 4 },
  { name: "İşyeri", slug: "isyeri", description: "Ofis, dükkan ve ticari alanlar", sortOrder: 5 },
  { name: "Devren", slug: "devren", description: "Devren satılık işletmeler", sortOrder: 6 },
] as const;

export const PROPERTY_FEATURES = [
  { name: "Otopark", slug: "otopark", valueType: "BOOLEAN" as const, sortOrder: 1 },
  { name: "Asansör", slug: "asansor", valueType: "BOOLEAN" as const, sortOrder: 2 },
  { name: "Güvenlik", slug: "guvenlik", valueType: "BOOLEAN" as const, sortOrder: 3 },
  { name: "Havuz", slug: "havuz", valueType: "BOOLEAN" as const, sortOrder: 4 },
  { name: "Balkon", slug: "balkon", valueType: "BOOLEAN" as const, sortOrder: 5 },
  { name: "Eşyalı", slug: "esyali", valueType: "BOOLEAN" as const, sortOrder: 6 },
  { name: "Site İçinde", slug: "site-icinde", valueType: "BOOLEAN" as const, sortOrder: 7 },
  { name: "Deniz Manzaralı", slug: "deniz-manzarali", valueType: "BOOLEAN" as const, sortOrder: 8 },
] as const;

export const BLOG_CATEGORIES = [
  { name: "Emlak Haberleri", slug: "emlak-haberleri", description: "Sektör haberleri ve güncellemeler", sortOrder: 1 },
  { name: "Yatırım Rehberi", slug: "yatirim-rehberi", description: "Emlak yatırım ipuçları", sortOrder: 2 },
  { name: "Bölge Analizi", slug: "bolge-analizi", description: "Bölgesel emlak analizleri", sortOrder: 3 },
  { name: "Dekorasyon", slug: "dekorasyon", description: "Ev dekorasyon ve tasarım", sortOrder: 4 },
  { name: "Hukuk & Mevzuat", slug: "hukuk-mevzuat", description: "Emlak hukuku ve yasal bilgiler", sortOrder: 5 },
] as const;

export const LEAD_STATUSES = [
  { name: "New", slug: "new", description: "Newly created lead", color: "#3B82F6", sortOrder: 1, isDefault: true },
  { name: "Contacted", slug: "contacted", description: "Initial contact made", color: "#F59E0B", sortOrder: 2, isDefault: false },
  { name: "Qualified", slug: "qualified", description: "Lead is qualified", color: "#8B5CF6", sortOrder: 3, isDefault: false },
  { name: "Negotiation", slug: "negotiation", description: "In negotiation phase", color: "#EC4899", sortOrder: 4, isDefault: false },
  { name: "Won", slug: "won", description: "Lead converted successfully", color: "#10B981", sortOrder: 5, isDefault: false },
  { name: "Lost", slug: "lost", description: "Lead lost or declined", color: "#EF4444", sortOrder: 6, isDefault: false },
] as const;

export const MEDIA_FOLDERS = [
  { name: "Properties", slug: "properties" },
  { name: "Blog", slug: "blog" },
  { name: "Team", slug: "team" },
  { name: "General", slug: "general" },
] as const;
