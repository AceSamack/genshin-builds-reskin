import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://akhalaplo.github.io',
  base: '/genshin-builds',
  image: {
    domains: ['wiki.hoyolab.com', 'upload-static.hoyoverse.com'],
  },
});
