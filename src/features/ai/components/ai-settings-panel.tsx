import { getAiPublicConfig } from "@/config/ai";
import { AI_FEATURE_LABELS } from "@/features/ai/constants";
import { getAiUsageStats } from "@/features/ai/services";

export async function AiSettingsPanel() {
  const config = getAiPublicConfig();
  const stats = await getAiUsageStats();

  const topFeatures = stats.byFeature.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">AI Yapılandırması</h2>
          <p className="text-sm text-muted-foreground">
            Sağlayıcı ve limitler ortam değişkenleri üzerinden yönetilir. API anahtarları burada
            gösterilmez.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <Item label="Durum" value={config.enabled ? "Aktif" : "Devre dışı"} />
          <Item label="Sağlayıcı" value={config.provider} />
          <Item label="Model / Deployment" value={config.model} />
          <Item
            label="Bağlantı"
            value={config.configured ? "Yapılandırılmış" : "Eksik — .env kontrol edin"}
          />
          <Item label="Admin istek limiti / dk" value={String(config.maxRequestsPerMinute)} />
          <Item label="Public istek limiti / dk" value={String(config.publicMaxRequestsPerMinute)} />
          <Item label="Max token / istek" value={String(config.maxTokensPerRequest)} />
          <Item label="Önbellek süresi" value={`${config.cacheRevalidateSeconds}s`} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Bu Ay Kullanım</h2>
        <dl className="grid gap-3 sm:grid-cols-3 text-sm">
          <Item label="Toplam istek" value={String(stats.totalRequests)} />
          <Item label="Başarılı" value={String(stats.successfulRequests)} />
          <Item label="Token" value={stats.totalTokens.toLocaleString("tr-TR")} />
        </dl>
        {topFeatures.length > 0 ? (
          <ul className="text-sm text-muted-foreground space-y-1">
            {topFeatures.map((row) => (
              <li key={row.feature}>
                {AI_FEATURE_LABELS[row.feature]}: {row.count} istek
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Henüz kayıt yok.</p>
        )}
      </section>

      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Ortam değişkenleri</p>
        <p>AI_ENABLED, AI_PROVIDER, OPENAI_API_KEY, OPENAI_MODEL</p>
        <p>AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT</p>
        <p>AI_MAX_REQUESTS_PER_MINUTE, AI_PUBLIC_MAX_REQUESTS_PER_MINUTE, AI_CACHE_REVALIDATE_SECONDS</p>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
