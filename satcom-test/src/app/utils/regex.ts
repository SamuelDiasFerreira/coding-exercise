export function isValidRegex(str: string): boolean {
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
}
