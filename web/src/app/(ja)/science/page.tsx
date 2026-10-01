import type { Metadata } from "next";
import SectionHome from "@/components/SectionHome";
import { PORTAL_CARDS, SECTION_PAGES } from "@/lib/sectionPages";

export const metadata: Metadata = {
  title: `科学を学ぶ — ${SECTION_PAGES.science!.h1.replace(/。$/, "")}`,
  description: PORTAL_CARDS.science.desc,
  alternates: { canonical: "/science" },
};

export default function Page() {
  return <SectionHome section="science" />;
}
