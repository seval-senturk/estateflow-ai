export { auth, authConfig, handlers, signIn, signOut } from "./auth";
export {
  canAccess,
  canAccessAdminPanel,
  canAccessByRole,
  authorize,
  authorizeAdminPanel,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
  type AccessRequirements,
} from "./authorization";
export {
  enforceAdminAccess,
  enforcePermission,
  getServerSessionUser,
  requireAccess,
  requireAdminAccess,
  requireAuth,
  requirePermission,
  requireRole,
} from "./authorization/guards";
export {
  ApiError,
  AppError,
  AuthenticationError,
  AuthorizationError,
  BaseError,
  ErrorCode,
  getErrorMessage,
  isBaseError,
  NotFoundError,
  ValidationError,
} from "./errors";
export { prisma } from "./prisma";
export {
  activeOnly,
  auditCreateFields,
  auditUpdateFields,
  databaseConfig,
  generateSlug,
  restoreData,
  softDeleteData,
  toPaginatedResult,
  toPrismaPagination,
} from "./database";
export { cn } from "./utils";
