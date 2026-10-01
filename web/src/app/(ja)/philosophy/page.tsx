import type { Metadata } from "next";
import SectionHome from "@/components/SectionHome";
import { PORTAL_CARDS, SECTION_PAGES } from "@/lib/sectionPages";

export const metadata: Metadata = {
  title: `哲学を学ぶ — ${SECTION_PAGES.philosophy!.h1.replace(/。$/, "")}`,
  description: PORTAL_CARDS.philosophy.desc,
  alternates: { canonical: "/philosophy" },
};

export default function Page() {
  return <SectionHome section="philosophy" />;
}
