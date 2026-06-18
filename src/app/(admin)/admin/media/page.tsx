import Link from "next/link";
import { Suspense } from "react";

import { LoadingState } from "@/components/admin/ui/loading-state";
import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { MediaLibraryLazy as MediaLibrary } from "@/features/media/components/media-library-lazy";
import { mediaService } from "@/features/media/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface AdminMediaPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const user = await enforcePermission(permissions.media.read);
  const params = await searchParams;

  const [listResult, folders] = await Promise.all([
    mediaService.list({
      search: getParam(params, "search"),
      folderId: getParam(params, "folderId"),
      mediaType: getParam(params, "mediaType") as "IMAGE" | "VIDEO" | undefined,
      page: Number(getParam(params, "page") ?? "1"),
      pageSize: Number(getParam(params, "pageSize") ?? "24"),
    }),
    mediaService.getFolders(),
  ]);

  const canUpload = user.permissions.includes(permissions.media.upload);
  const canDelete = user.permissions.includes(permissions.media.delete);

  const result = listResult.success
    ? listResult.data
    : { items: [], total: 0, page: 1, pageSize: 24, totalPages: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medya Kütüphanesi"
        description="Tüm dijital varlıklarınızı merkezi olarak yönetin, organize edin ve modüllere atayın."
        actions={
          canUpload ? (
            <Link
              href="#upload"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
            >
              Yükleme Alanına Git
            </Link>
          ) : undefined
        }
      />

      <Suspense fallback={<LoadingState label="Medya yükleniyor…" />}>
        <div id="upload">
          <MediaLibrary
            result={result}
            folders={folders.map((folder) => ({ id: folder.id, name: folder.name }))}
            canUpload={canUpload}
            canDelete={canDelete}
          />
        </div>
      </Suspense>
    </div>
  );
}
