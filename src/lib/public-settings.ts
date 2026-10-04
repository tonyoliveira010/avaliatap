import { useEffect, useState } from "react";
import { defaultMerchantSlug } from "@/lib/merchants";

export type PublicSettings = {
  referrals: boolean;
  benefits: boolean;
  club: boolean;
  polls: boolean;
  products: boolean;
  coupons: boolean;
  booking: boolean;
};

export const defaultSettings: PublicSettings = {
  referrals: true,
  benefits: true,
  club: true,
  polls: true,
  products: true,
  coupons: true,
  booking: true,
};

export const settingsKey = (slug = defaultMerchantSlug) => `avaliatap-public-settings-${slug}`;

export function usePublicSettings(slug = defaultMerchantSlug) {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  useEffect(() => {
    try {
      setSettings({ ...defaultSettings, ...JSON.parse(localStorage.getItem(settingsKey(slug)) ?? "{}") });
    } catch {
      setSettings(defaultSettings);
    }
  }, [slug]);

  const update = (next: PublicSettings) => {
    setSettings(next);
    localStorage.setItem(settingsKey(slug), JSON.stringify(next));
  };

  return { settings, update };
}
