import { careers, site } from "@/content/site";

/** The email to apply with: its subject and a short outline filled in. */
export function applyHref(): string {
  const { apply } = careers.role;
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(apply.subject)}&body=${encodeURIComponent(apply.body)}`;
}
