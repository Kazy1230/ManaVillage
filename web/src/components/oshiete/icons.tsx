// おしえて英語のアイコン(Artifact 版と同じ形)
const base = { "aria-hidden": true, fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconBack = () => <svg {...base} width="22" height="22" viewBox="0 0 24 24" strokeWidth="2.2"><path d="M15 5l-7 7 7 7" /></svg>;
export const IconNext = () => <svg {...base} width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.2"><path d="M9 5l7 7-7 7" /></svg>;
export const IconCheck = () => <svg {...base} width="15" height="15" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const IconBulb = () => (
  <svg {...base} width="18" height="18" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
  </svg>
);
export const IconSend = () => <svg {...base} width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.2"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>;
export const IconX = () => <svg {...base} width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.4"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>;
export const IconMsg = () => <svg {...base} width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.4"><path d="M4 6h16v10H8l-4 4z" /></svg>;
export const IconStar = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" /></svg>
);
