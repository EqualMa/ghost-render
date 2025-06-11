import DateTime from "../../reexports/luxon/DateTime";

export default function formatPostPublishedAt(
  publishedAt: Date | undefined | null,
  timezone: string,
  locale: string
): string {
  return (publishedAt ? DateTime.fromJSDate(publishedAt) : DateTime.local())
    .setZone(timezone)
    .setLocale(locale)
    .toLocaleString({
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}
