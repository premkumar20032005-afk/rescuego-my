import crypto from "crypto";
import { env } from "./env";

const BASE_URL = env.BILLPLZ_SANDBOX === "false" ? "https://www.billplz.com/api/v3" : "https://www.billplz-sandbox.com/api/v3";

interface CreateBillParams {
  email: string;
  name: string;
  amount: number; // in ringgit, e.g. 150.50
  description: string;
  callbackUrl: string;
  redirectUrl: string;
}

interface BillplzBill {
  id: string;
  collection_id: string;
  url: string;
  state: string;
}

export async function createBill(params: CreateBillParams): Promise<BillplzBill> {
  if (!env.BILLPLZ_API_KEY || !env.BILLPLZ_COLLECTION_ID) {
    throw new Error("Billplz is not configured.");
  }

  const auth = Buffer.from(`${env.BILLPLZ_API_KEY}:`).toString("base64");

  const res = await fetch(`${BASE_URL}/bills`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      collection_id: env.BILLPLZ_COLLECTION_ID,
      email: params.email,
      name: params.name,
      amount: Math.round(params.amount * 100).toString(), // cents
      description: params.description,
      callback_url: params.callbackUrl,
      redirect_url: params.redirectUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Billplz bill creation failed: ${text}`);
  }

  return res.json();
}

/**
 * Verifies the X-Signature Billplz sends on both the redirect query string
 * and the callback webhook body, per https://www.billplz.com/api#signature
 */
export function verifyXSignature(params: Record<string, string>, signature: string): boolean {
  if (!env.BILLPLZ_X_SIGNATURE_KEY) return false;

  const sourceString = Object.keys(params)
    .filter((key) => key !== "x_signature")
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("|");

  const expected = crypto.createHmac("sha256", env.BILLPLZ_X_SIGNATURE_KEY).update(sourceString).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);

  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
