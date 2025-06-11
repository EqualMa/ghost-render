import type { DependenciesT } from "@ghost-render/email-renderer";

function t(resources: TResources, key: string, context: unknown): string {
  let value = resources[key] || key;
  const opts: undefined | [string, unknown][] = context
    ? Object.entries(context)
    : undefined;
  if (opts && opts.length > 0) {
    for (const [k, v] of opts) {
      value = value.replaceAll(`{${k}}`, String(v ?? ""));
    }
  }
  return value;
}

export type TResources = Record<string, string | undefined>;

export default function makeTFromResources(
  resources: TResources
): DependenciesT {
  return t.bind(undefined, resources);
}
