import type { Metadata } from "next";
import SectionHome from "@/components/SectionHome";
import { PORTAL_CARDS, SECTION_PAGES } from "@/lib/sectionPages";

export const metadata: Metadata = {
  title: `人間関係を学ぶ — ${SECTION_PAGES.relationships!.h1.replace(/。$/, "")}`,
  description: PORTAL_CARDS.relationships.desc,
  alternates: { canonical: "/relationships" },
};

export default function Page() {
  return <SectionHome section="relationships" />;
}
