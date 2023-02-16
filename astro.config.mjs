import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import svelte from "@astrojs/svelte"
import vercel from "@astrojs/vercel/serverless"
import sitemap from "@astrojs/sitemap"
import prefetch from "@astrojs/prefetch"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), sitemap(), prefetch()],
  output: "server",
  site: "https://www.noquarter.co",
  adapter: vercel(),
})
