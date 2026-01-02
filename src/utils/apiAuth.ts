import prisma from "./prisma";
import { NextRequest } from "next/server";

/**
 * Validates API key from Authorization header.
 *
 * Usage:
 * ```typescript
 * const apiKey = await validateApiKey(request);
 * if (!apiKey) {
 *   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * }
 * ```
 *
 * @param request - NextRequest with Authorization header
 * @returns ApiKey object if valid, null if invalid
 */
export async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  // Check for Bearer token format
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const key = authHeader.slice(7); // Remove "Bearer " prefix

  if (!key) {
    return null;
  }

  try {
    // Find active API key
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
    });

    if (!apiKey || !apiKey.isActive) {
      return null;
    }

    // Update last used timestamp (fire-and-forget)
    prisma.apiKey
      .update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(console.error);

    return apiKey;
  } catch (error) {
    console.error("API key validation error:", error);
    return null;
  }
}

/**
 * Type for the ApiKey returned by validateApiKey
 */
export type ApiKeyData = Awaited<ReturnType<typeof validateApiKey>>;
