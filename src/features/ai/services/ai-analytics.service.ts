import { aiService } from "./ai.service";

export async function getAiUsageStats() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  return aiService.getUsageStats(monthStart);
}
