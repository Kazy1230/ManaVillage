import { SITE_URL } from "@/lib/env";
import { OPERATOR_NAME, SOCIAL } from "@/lib/site";

const sameAs = [SOCIAL.instagram.url, SOCIAL.youtube.url];

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/operator#person`;

export const organizationLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "まなビレッジ",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  sameAs,
};

export const personLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: OPERATOR_NAME,
  url: `${SITE_URL}/operator`,
  description: "英語の勉強方法を発信する、まなビレッジの運営者",
  worksFor: { "@id": ORG_ID },
  sameAs,
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "まなビレッジ",
  url: SITE_URL,
  inLanguage: "ja",
  publisher: { "@id": ORG_ID },
};

// < を < にして、<script> を途中で閉じられないようにする
export const ldScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\u003c");
