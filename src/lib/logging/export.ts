export type LogExportFormat = "csv" | "xlsx" | "pdf";

export interface LogExportPayload {
  format: LogExportFormat;
  filename: string;
  headers: string[];
  rows: string[][];
}

export function buildLogExportPayload(
  rows: Array<Record<string, string | number | null>>,
  format: LogExportFormat,
  prefix: string,
): LogExportPayload {
  if (rows.length === 0) {
    return {
      format,
      filename: `${prefix}-${Date.now()}.${format === "xlsx" ? "xlsx" : format}`,
      headers: [],
      rows: [],
    };
  }

  const firstRow = rows[0]!;
  const headers = Object.keys(firstRow);
  return {
    format,
    filename: `${prefix}-${Date.now()}.${format === "xlsx" ? "xlsx" : format}`,
    headers,
    rows: rows.map((row) => headers.map((header) => String(row[header] ?? ""))),
  };
}
