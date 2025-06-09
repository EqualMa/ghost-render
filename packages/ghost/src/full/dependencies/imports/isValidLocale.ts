export default function isValidLocale(locale: string) {
  try {
    // Attempt to create a DateTimeFormat with the locale
    new Intl.DateTimeFormat(locale);
    return true; // No error means it's a valid locale
  } catch (e) {
    return false; // RangeError means invalid locale
  }
}
