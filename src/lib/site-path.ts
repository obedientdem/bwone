// Next Link adds basePath itself; plain assets and HTML forms need it explicitly.
export function sitePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
