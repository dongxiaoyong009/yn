const ABSOLUTE_URL_RE = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function assetPath(path: string): string {
  if (!path || ABSOLUTE_URL_RE.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (normalizedBase === './') {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/' || base === './') {
    return undefined;
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
}
