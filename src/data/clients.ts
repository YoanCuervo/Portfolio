export type Client = {
  name: string; // proper noun, never translated
  logo: string | null; // image import, null = not provided yet (T20)
};

// Names in brackets are not provided yet (T20).
export const clientRows: [Client[], Client[]] = [
  [
    { name: "Canal+", logo: null },
    { name: "Eurosport", logo: null },
    { name: "France Télévisions", logo: null },
    { name: "When We Were Kids", logo: null },
    { name: "Studio Bagel", logo: null },
    { name: "[Agency]", logo: null },
  ],
  [
    { name: "Les Guignols", logo: null },
    { name: "Kayenta", logo: null },
    { name: "Darjeeling", logo: null },
    { name: "48 Hour Film Project", logo: null },
    { name: "[Client]", logo: null },
    { name: "[Production]", logo: null },
  ],
];
