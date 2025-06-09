import DateTime from "../../../reexports/luxon/DateTime";

export default function formatDateLong(
  date: Date,
  timezone: string,
  locale: string
) {
  return DateTime.fromJSDate(date)
    .setZone(timezone)
    .setLocale(locale)
    .toLocaleString({
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
