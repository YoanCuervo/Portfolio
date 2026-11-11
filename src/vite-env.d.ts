/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Web3Forms access key (T13): .env.local in development, a GitHub repository
  // variable for the online build. Public by nature: it ends up in the bundle.
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
