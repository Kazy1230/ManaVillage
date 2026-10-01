import type { Metadata } from "next";
import SectionHome from "@/components/SectionHome";
import { PORTAL_CARDS, SECTION_PAGES } from "@/lib/sectionPages";

export const metadata: Metadata = {
  title: `ITを学ぶ — ${SECTION_PAGES.it!.h1.replace(/。$/, "")}`,
  description: PORTAL_CARDS.it.desc,
  alternates: { canonical: "/it" },
};

export default function Page() {
  return <SectionHome section="it" />;
}
