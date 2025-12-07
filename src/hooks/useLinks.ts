import { useQuery } from "@tanstack/react-query";
import { fetchLinks, Link } from "@/lib/api/links";

export interface ExtendedLink extends Link {
  tags?: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
}

export function useLinks() {
  return useQuery<Link[]>({
    queryKey: ["links"],
    queryFn: fetchLinks,
  });
}

