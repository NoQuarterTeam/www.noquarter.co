/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SLACK_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
