import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { en } from "../locales/en";
import { fr } from "../locales/fr";

type Lang = "en" | "fr";

type LanguageContextValue = {
  lang: Lang;
  t: typeof en;
  toggleLang: () => void;
};

const texts: Record<Lang, typeof en> = { en, fr };

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "fr") {
      return stored;
    }
  } catch {}
  return navigator.language.startsWith("fr") ? "fr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = texts[lang].meta.title;
  }, [lang]);

  function toggleLang() {
    const next = lang === "en" ? "fr" : "en";

    try {
      localStorage.setItem("lang", next);
    } catch {}

    setLang(next);
  }

  return (
    <LanguageContext.Provider value={{ lang, t: texts[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
