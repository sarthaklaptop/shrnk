export type Link = {
  id: string;
  longLink: string;
  shortLink: string;
  fullShortLink: string;
  createdAt: string;
  clickCount: number;
  password?: string | null;
  clickLimit: number;
  expiresAt: string;
  userId?: string | null;
};

export type CreateLinkInput = {
  longLink: string;
  password?: string;
};

export async function fetchLinks(): Promise<Link[]> {
  const res = await fetch("/api/userLinks", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to fetch links");
  }

  const data = await res.json();
  return data.data || [];
}

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const res = await fetch("/api/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to create link" }));
    throw new Error(errorData.error || "Failed to create link");
  }

  const data = await res.json();
  return data.data;
}

