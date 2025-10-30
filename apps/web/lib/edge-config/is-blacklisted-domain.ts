import { getAll } from "@vercel/edge-config";

export const isBlacklistedDomain = async (domain: string): Promise<boolean> => {
  if (!process.env.NEXT_PUBLIC_IS_DUB || !process.env.EDGE_CONFIG) {
    return false;
  }

  if (!domain) {
    return false;
  }

  try {
    const {
      domains: blacklistedDomains,
      terms: blacklistedTerms,
      whitelistedDomains,
    } = await getAll(["domains", "terms", "whitelistedDomains"]);

    if (whitelistedDomains.includes(domain)) {
      console.log("Domain is whitelisted", domain);
      return false;
    }
    const blacklistedTermsRegex = new RegExp(
      blacklistedTerms
        .map((term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // replace special characters with escape sequences
        .join("|"),
    );
    console.log("blacklistedTerms", blacklistedTerms)
    console.log("blacklistedTermsRegex", blacklistedTermsRegex);
    console.log("domain", domain);
    const isBlacklisted =
      blacklistedDomains.includes(domain) ||
      (blacklistedTerms.length > 0 && blacklistedTermsRegex.test(domain));

    console.log("isBlacklisted", isBlacklisted);

    if (isBlacklisted) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};
