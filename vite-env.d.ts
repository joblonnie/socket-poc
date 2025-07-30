/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_HOST: string;
  readonly VITE_WS_PORT: string;
  readonly VITE_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
