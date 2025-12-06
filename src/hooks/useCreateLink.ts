import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink, CreateLinkInput, Link } from "@/lib/api/links";

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLinkInput) => createLink(input),
    onSuccess: (newLink: Link) => {
      // Update the cache so the new link appears at the top
      queryClient.setQueryData<Link[]>(["links"], (old) => {
        if (!old) return [newLink];
        // Ensure newest on top (already sorted by backend, but double-check)
        return [newLink, ...old].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    },
  });
}

