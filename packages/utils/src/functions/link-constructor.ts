import { punycode } from ".";

export function linkConstructor({
  domain,
  key,
  pretty,
  searchParams,
  defaultDomain,
}: {
  domain?: string;
  key?: string;
  pretty?: boolean;
  searchParams?: Record<string, string>;
  defaultDomain?: string;
}) {
  if (!domain) {
    return "";
  }

  let url;
  if (domain.includes(defaultDomain!)) {
    url = `http://${punycode(domain)}${key && key !== "_root" ? `/${punycode(key)}` : ""}`;
  } else {
    url = `https://${punycode(domain)}${key && key !== "_root" ? `/${punycode(key)}` : ""}`;
  }

  if (searchParams) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      search.set(key, value);
    }
    url += `?${search.toString()}`;
  }

  return pretty ? url.replace(/^https?:\/\//, "") : url;
}

export function linkConstructorSimple({
  domain,
  key,
  defaultDomain,
}: {
  domain: string;
  key: string;
  defaultDomain?: string;
}) {
  if (domain.includes(defaultDomain!)) {
    return `http://${domain}${key === "_root" ? "" : `/${key}`}`;
  } else {
    return `https://${domain}${key === "_root" ? "" : `/${key}`}`;
  }
}
