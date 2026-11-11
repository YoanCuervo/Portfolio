import "@fontsource/cormorant/400.css";
import "@fontsource/cormorant/600.css";
import "@fontsource/cormorant/400-italic.css";
import "@fontsource/cormorant/500-italic.css";
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// On reload, the browser would put the visitor back where they left the page:
// the site always opens at the top instead.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo({ top: 0, behavior: "instant" });

const root = document.getElementById("root");

if (!root) {
  throw new Error("Element #root not found in index.html");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
