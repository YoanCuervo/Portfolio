import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const TRANSITION_MS = 200;

// The mobile browser bar (theme-color) takes the page background of the
// displayed theme, read from tokens.css so no colour is written here.
function syncThemeColor() {
  const background = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", background);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  // On load: index.html runs before the stylesheet, so it cannot read --bg.
  useEffect(syncThemeColor, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    const html = document.documentElement;

    html.classList.add("theme-transition");
    html.dataset.theme = next;
    syncThemeColor();
    setTimeout(() => html.classList.remove("theme-transition"), TRANSITION_MS);

    try {
      localStorage.setItem("theme", next);
    } catch {}

    setTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
