import type { PrismaClient } from "@prisma/client";

import { PERMISSIONS, ROLE_PERMISSION_MAP, ROLES } from "./data";

export async function seedRolesAndPermissions(prisma: PrismaClient) {
  console.log("  → Seeding roles and permissions...");

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
        level: role.level,
        isSystem: role.isSystem,
      },
      create: role,
    });
  }

  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {
        name: permission.name,
        module: permission.module,
      },
      create: permission,
    });
  }

  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();
  const permissionMap = new Map(permissions.map((p) => [p.slug, p.id]));
  const roleMap = new Map(roles.map((r) => [r.slug, r.id]));

  for (const [roleSlug, permissionSlugs] of Object.entries(ROLE_PERMISSION_MAP)) {
    const roleId = roleMap.get(roleSlug);
    if (!roleId) continue;

    for (const permissionSlug of permissionSlugs) {
      const permissionId = permissionMap.get(permissionSlug);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        update: {},
        create: { roleId, permissionId },
      });
    }
  }

  console.log(`    ✓ ${ROLES.length} roles, ${PERMISSIONS.length} permissions`);
}
