import { fetcher } from "@dub/utils";
import useSWR, { SWRConfiguration } from "swr";
import { ExpandedLinkProps } from "../types";
import useWorkspace from "./use-workspace";

export default function useLink(
  linkIdOrLink: string | { domain: string; slug: string },
  swrOptions?: SWRConfiguration,
) {
  const { id: workspaceId } = useWorkspace();
  let decodedDomain: string | undefined;
  if (typeof linkIdOrLink !== "string") {
    decodedDomain = decodeURIComponent(linkIdOrLink.domain);
  }

  const { data: link, error } = useSWR<ExpandedLinkProps>(
    workspaceId &&
      linkIdOrLink &&
      (typeof linkIdOrLink === "string"
        ? `/api/links/${linkIdOrLink}?workspaceId=${workspaceId}`
        : `/api/links/info?${new URLSearchParams({
            workspaceId,
            domain: decodedDomain!,
            key: linkIdOrLink.slug,
            includeUser: "true",
            includeWebhooks: "true",
          })}`),
    fetcher,
    swrOptions,
  );
  console.log(error);
  return {
    link,
    loading: !link && !error,
  };
}
