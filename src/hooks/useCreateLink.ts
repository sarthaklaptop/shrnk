import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink, CreateLinkInput, Link } from "@/lib/api/links";

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLinkInput) => createLink(input),
    onSuccess: (newLink: Link) => {
      queryClient.setQueryData<Link[]>(["links"], (old) => {
        if (!old) return [newLink];
        return [newLink, ...old].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}
