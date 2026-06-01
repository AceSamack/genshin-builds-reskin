import fs from 'fs';
import type { APIContext } from 'astro';
import {
  getCharacterAssetStaticPaths,
  resolveCharacterAssetFileFromRoute,
} from '../../utils/character-assets';

export const getStaticPaths = getCharacterAssetStaticPaths;

/**
 * Serves one hosted character WebP asset.
 *
 * @param context Astro API route context.
 * @returns The requested WebP response, or 404 when the route is invalid.
 */
export async function GET({ params }: APIContext) {
  const filePath = resolveCharacterAssetFileFromRoute(params.asset);

  if (!filePath || !fs.existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }

  return new Response(new Uint8Array(fs.readFileSync(filePath)), {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/webp',
    },
  });
}
