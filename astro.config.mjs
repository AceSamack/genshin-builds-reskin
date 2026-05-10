import { defineConfig } from 'astro/config';

export default defineConfig({
  output: "server",
  image: {
    domains: ['wiki.hoyolab.com', 'upload-static.hoyoverse.com'],
  },
});
