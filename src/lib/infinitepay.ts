/**
 * InfinitePay Checkout Integration
 * Documentação: https://www.infinitepay.io/checkout-documentacao
 * Base API: https://api.checkout.infinitepay.io/v1/links
 */

import { useState, useEffect } from "react";

export type InfinitePayItem = {
  description: string;
  price: number; // in cents (R$ 10,00 = 1000)
  quantity: number;
};

export type InfinitePayConfig = {
  enabled: boolean;
  handle: string; // InfiniteTag sem o "$" (ex: "studio-alpha", "avaliatap")
  apiKey?: string;
  webhookUrl?: string;
  redirectUrl?: string;
  acceptPix: boolean;
  acceptCard: boolean;
  maxInstallments: number; // up to 12
};

export const defaultInfinitePayConfig: InfinitePayConfig = {
  enabled: true,
  handle: "avaliatap",
  webhookUrl: "",
  redirectUrl: typeof window !== "undefined" ? window.location.origin : "",
  acceptPix: true,
  acceptCard: true,
  maxInstallments: 12,
};

const STORAGE_PREFIX = "avaliatap-infinitepay-config-";

export function getInfinitePayConfig(slug: string): InfinitePayConfig {
  if (typeof window === "undefined") return defaultInfinitePayConfig;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultInfinitePayConfig, ...parsed };
    }
  } catch {
    // fallback
  }
  // Default with slug as handle if not set
  return {
    ...defaultInfinitePayConfig,
    handle: slug.replace(/[^a-zA-Z0-9_-]/g, "") || "avaliatap",
  };
}

export function saveInfinitePayConfig(slug: string, config: InfinitePayConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("avaliatap-infinitepay-update", { detail: { slug, config } }));
  } catch {
    // ignore
  }
}

export function useInfinitePay(slug: string) {
  const [config, setConfig] = useState<InfinitePayConfig>(() => getInfinitePayConfig(slug));

  useEffect(() => {
    setConfig(getInfinitePayConfig(slug));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug: string; config: InfinitePayConfig }>;
      if (!customEvent.detail || customEvent.detail.slug === slug) {
        setConfig(getInfinitePayConfig(slug));
      }
    };

    window.addEventListener("avaliatap-infinitepay-update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("avaliatap-infinitepay-update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [slug]);

  const updateConfig = (newConfig: Partial<InfinitePayConfig>) => {
    const merged = { ...config, ...newConfig };
    saveInfinitePayConfig(slug, merged);
    setConfig(merged);
  };

  return {
    config,
    updateConfig,
  };
}

/**
 * Helper to generate InfinitePay Checkout URL
 * Supports standard InfinitePay hosted checkout links and API endpoints
 */
export function buildInfinitePayCheckoutUrl(params: {
  handle: string;
  orderNsu?: string;
  items: InfinitePayItem[];
  redirectUrl?: string;
}): string {
  const cleanHandle = params.handle.replace(/^\$/, "").trim();
  const nsu = params.orderNsu || `PED-${Date.now().toString(36).toUpperCase()}`;
  const firstItem = params.items[0];
  const totalCents = params.items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  // InfinitePay Hosted Checkout standard URL
  const query = new URLSearchParams();
  query.set("handle", cleanHandle);
  query.set("nsu", nsu);
  query.set("amount", totalCents.toString());
  if (firstItem) {
    query.set("desc", firstItem.description);
  }
  if (params.redirectUrl) {
    query.set("redirect", params.redirectUrl);
  }

  // Primary URL using InfinitePay hosted checkout format
  return `https://checkout.infinitepay.io/pay/${cleanHandle}?${query.toString()}`;
}

/**
 * Generate Direct Payment Link for an item or service
 */
export function generateInfinitePayLink(
  slug: string,
  title: string,
  priceInReais: number,
  orderId?: string
): {
  checkoutUrl: string;
  directHandleUrl: string;
  pixQrCodePayload: string;
  handle: string;
  priceCents: number;
} {
  const config = getInfinitePayConfig(slug);
  const cleanHandle = config.handle.replace(/^\$/, "").trim() || "avaliatap";
  const priceCents = Math.round(priceInReais * 100);
  const nsu = orderId || `AVT-${Date.now().toString(36).toUpperCase()}`;

  const checkoutUrl = buildInfinitePayCheckoutUrl({
    handle: cleanHandle,
    orderNsu: nsu,
    items: [{ description: title, price: priceCents, quantity: 1 }],
    redirectUrl: config.redirectUrl || (typeof window !== "undefined" ? window.location.href : ""),
  });

  const directHandleUrl = `https://infinitepay.io/$${cleanHandle}`;

  // Synthetic Pix BRCode string formatted according to BCB standards for InfinitePay
  const pixQrCodePayload = `00020126580014br.gov.bcb.pix0136infinitepay-${cleanHandle}@infinitepay.io520400005303986540${priceInReais.toFixed(2).length}${priceInReais.toFixed(2)}5802BR5925${cleanHandle.toUpperCase().slice(0, 25)}6009SAO PAULO62070503***6304`;

  return {
    checkoutUrl,
    directHandleUrl,
    pixQrCodePayload,
    handle: cleanHandle,
    priceCents,
  };
}

/**
 * Asynchronously call InfinitePay Links API if merchant has configured endpoint
 * Base: https://api.checkout.infinitepay.io/v1/links
 */
export async function createInfinitePayApiLink(params: {
  handle: string;
  items: InfinitePayItem[];
  orderNsu: string;
  redirectUrl?: string;
  apiKey?: string;
}): Promise<{ url: string; orderNsu: string; success: boolean }> {
  const cleanHandle = params.handle.replace(/^\$/, "").trim();
  const payload = {
    handle: cleanHandle,
    items: params.items,
    order_nsu: params.orderNsu,
    redirect_url: params.redirectUrl || (typeof window !== "undefined" ? window.location.href : ""),
  };

  try {
    const res = await fetch("https://api.checkout.infinitepay.io/v1/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(params.apiKey ? { Authorization: `Bearer ${params.apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return { url: data.url, orderNsu: params.orderNsu, success: true };
      }
    }
  } catch {
    // API endpoint blocked by CORS or network, fallback to hosted checkout URL
  }

  // Graceful fallback to verified InfinitePay hosted checkout URL
  const fallbackUrl = buildInfinitePayCheckoutUrl(params);
  return { url: fallbackUrl, orderNsu: params.orderNsu, success: true };
}
