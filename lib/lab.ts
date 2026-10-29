import { cache } from "react";
import { cookies } from "next/headers";
import { allEntries } from "./content";
import type { Locale } from "./i18n";
import { experience } from "./profile";

import { isDesign, type DesignId } from "./designs";

export { designs, isDesign, type DesignId } from "./designs";

export const getDesign = cache(async (): Promise<DesignId> => {
  const v = (await cookies()).get("design")?.value;
  return isDesign(v) ? v : "1b";
});

/** Inline copy for lab-only strings. */
export function t(locale: Locale, en: string, pt: string) {
  return locale === "en" ? en : pt;
}

export type Company = { company: string; from: string; to?: string; roles: typeof experience };

/** Companies newest first, each with its roles oldest → newest. */
export function companies(): Company[] {
  return [...new Set(experience.map((x) => x.company))].map((company) => {
    const roles = experience.filter((x) => x.company === company).sort((a, b) => a.start.localeCompare(b.start));
    return { company, from: roles[0].start.slice(0, 4), to: roles[roles.length - 1].end?.slice(0, 4), roles };
  });
}

/** Roles newest first, flattened. */
export function rolesNewestFirst() {
  return [...experience].sort((a, b) => b.start.localeCompare(a.start));
}

export function roleName(r: (typeof experience)[number], locale: Locale) {
  return r.role[locale];
}

export function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}

/** Months between two YYYY-MM strings; open end means now. */
export function monthsBetween(start: string, end?: string, now = new Date()) {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return (ey - sy) * 12 + (em - sm);
}

/** Articles and notes as one stream, newest first: the site has a single "writing" section. */
export function writing() {
  return [...allEntries("articles"), ...allEntries("notes")].sort((a, b) => b.date.localeCompare(a.date));
}
