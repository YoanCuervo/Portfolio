export type SocialId = "github" | "linkedin" | "discord";

export type Social = {
  id: SocialId;
  url: string | null;
};

// null = address not provided yet (T20): the icon is shown without a link.
export const socials: Social[] = [
  { id: "github", url: "https://github.com/YoanCuervo" },
  { id: "linkedin", url: null },
  { id: "discord", url: null },
];
