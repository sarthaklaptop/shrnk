import crypto from "crypto";

/**
 * Sends a signed webhook to the specified URL.
 * Uses HMAC-SHA256 for signature verification.
 *
 * @param webhookUrl - The URL to send the webhook to
 * @param webhookSecret - The secret used to sign the payload
 * @param payload - The data to send
 */
export async function sendWebhook(
  webhookUrl: string,
  webhookSecret: string,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    const body = JSON.stringify(payload);

    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shrnk-Signature": `sha256=${signature}`,
      },
      body,
      // 5 second timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        `Webhook delivery failed: ${response.status} ${response.statusText}`
      );
      return false;
    }

    console.log(`Webhook delivered successfully to ${webhookUrl}`);
    return true;
  } catch (error) {
    console.error("Webhook delivery error:", error);
    return false;
  }
}

/**
 * Webhook payload for link.clicked event
 */
export interface LinkClickedPayload {
  event: "link.clicked";
  data: {
    linkId: string;
    shortCode: string;
    originalUrl: string;
    metadata: {
      source: string;
      batchId?: string;
      userId?: string;
      emailId?: string;
    } | null;
    click: {
      timestamp: string;
      userAgent: string | null;
      country: string | null;
      city: string | null;
      deviceType: string;
      browser: string | null;
      os: string | null;
    };
  };
}

export type WebhookPayload = LinkClickedPayload;
