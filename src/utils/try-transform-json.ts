export function tryTransformJson(e: any): string | object {
  try {
    return JSON.parse(e?.value);
  } catch {
    return e;
  }
}
