import { Sparkles } from "lucide-react";

import { AI_FEATURE_LABELS } from "../constants";
import type { AiUsageStats } from "../types";

interface AiUsageWidgetProps {
  stats: AiUsageStats;
}

export function AiUsageWidget({ stats }: AiUsageWidgetProps) {
  const topFeature = stats.byFeature[0];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h3 className="font-semibold">AI Kullanımı</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Toplam İstek" value={stats.totalRequests} />
        <Stat label="Başarılı" value={stats.successfulRequests} />
        <Stat label="Token" value={stats.totalTokens} />
      </div>
      {topFeature ? (
        <p className="text-xs text-muted-foreground">
          En çok kullanılan: {AI_FEATURE_LABELS[topFeature.feature]} ({topFeature.count})
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Henüz AI kullanım kaydı yok.</p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value.toLocaleString("tr-TR")}</p>
    </div>
  );
}
