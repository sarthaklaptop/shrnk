import { useQuery } from "@tanstack/react-query";
import { fetchLinks, Link } from "@/lib/api/links";

export function useLinks() {
  return useQuery<Link[]>({
    queryKey: ["links"],
    queryFn: fetchLinks,
  });
}

