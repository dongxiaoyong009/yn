/**
 * Resource preloader utility
 * Preloads images, videos, and audio files with progress tracking and timeout fallback
 */

import { LEVELS } from '@/data/gameData';
import { assetPath } from '@/utils/assetPath';

export interface PreloadResult {
  loaded: number;
  failed: number;
  total: number;
}

const imageCache = new Map<string, HTMLImageElement>();
const imagePromiseCache = new Map<string, Promise<boolean>>();
const videoBlobUrlCache = new Map<string, string>();
const videoPromiseCache = new Map<string, Promise<boolean>>();

export function preloadImage(src: string, timeout = 10000): Promise<boolean> {
  if (!src) return Promise.resolve(false);

  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) {
    return cached.decode ? cached.decode().then(() => true).catch(() => true) : Promise.resolve(true);
  }

  const existingPromise = imagePromiseCache.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = new Promise<boolean>((resolve) => {
    const img = cached || new Image();
    imageCache.set(src, img);

    let settled = false;
    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      imagePromiseCache.delete(src);
      resolve(success);
    };

    const timer = window.setTimeout(() => finish(false), timeout);

    img.onload = () => {
      const decodePromise = img.decode ? img.decode() : Promise.resolve();
      decodePromise.then(() => finish(true)).catch(() => finish(true));
    };
    img.onerror = () => finish(false);

    if (img.src !== src) {
      img.src = src;
    } else if (img.complete) {
      img.onload?.(new Event('load'));
    }
  });

  imagePromiseCache.set(src, promise);
  return promise;
}

/**
 * Preload a video file using fetch to cache it in the browser
 */
export function preloadVideo(src: string, timeout = 15000): Promise<boolean> {
  if (videoBlobUrlCache.has(src)) {
    return Promise.resolve(true);
  }

  const existingPromise = videoPromiseCache.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = new Promise<boolean>((resolve) => {
    const controller = new AbortController();
    let settled = false;

    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      videoPromiseCache.delete(src);
      resolve(success);
    };

    const timer = window.setTimeout(() => {
      controller.abort();
      finish(false);
    }, timeout);

    fetch(src, {
      mode: 'cors',
      credentials: 'same-origin',
      signal: controller.signal,
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (!response.ok) {
          finish(false);
          return;
        }

        const blob = await response.blob();
        videoBlobUrlCache.set(src, URL.createObjectURL(blob));
        finish(true);
      })
      .catch(() => finish(false));
  });

  videoPromiseCache.set(src, promise);
  return promise;
}

export function getPreloadedVideoSrc(src: string): string {
  return videoBlobUrlCache.get(src) ?? src;
}

/**
 * Preload an audio file using HTMLAudioElement preload
 */
export function preloadAudio(src: string, timeout = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const timer = setTimeout(() => {
      audio.oncanplaythrough = null;
      audio.onerror = null;
      // Even on timeout, partial load is acceptable
      resolve(false);
    }, timeout);

    audio.oncanplaythrough = () => {
      clearTimeout(timer);
      resolve(true);
    };
    audio.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    audio.preload = 'auto';
    audio.src = src;
    // Trigger loading
    audio.load();
  });
}

export type ResourceType = 'image' | 'video' | 'audio';

export interface ResourceItem {
  url: string;
  type: ResourceType;
}

/**
 * Preload a single resource based on its type
 */
function preloadResource(item: ResourceItem, timeout = 10000): Promise<boolean> {
  switch (item.type) {
    case 'image':
      return preloadImage(item.url, timeout);
    case 'video':
      return preloadVideo(item.url, timeout);
    case 'audio':
      return preloadAudio(item.url, timeout);
    default:
      return preloadImage(item.url, timeout);
  }
}

/**
 * Preload multiple resources of mixed types with progress tracking
 */
export async function preloadResources(
  resources: ResourceItem[],
  onProgress?: (loaded: number, total: number) => void,
  timeout = 10000
): Promise<PreloadResult> {
  const uniqueResources = Array.from(
    new Map(resources.filter((resource) => resource.url).map((resource) => [`${resource.type}:${resource.url}`, resource])).values()
  );
  const total = uniqueResources.length;
  let loaded = 0;
  let failed = 0;

  const promises = uniqueResources.map(async (resource) => {
    const success = await preloadResource(resource, timeout);
    if (success) {
      loaded++;
    } else {
      failed++;
    }
    onProgress?.(loaded + failed, total);
  });

  await Promise.all(promises);
  return { loaded, failed, total };
}

/**
 * Legacy: Preload images only (backward compatible)
 */
export async function preloadImages(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void,
  timeout = 10000
): Promise<PreloadResult> {
  const resources: ResourceItem[] = urls.map((url) => ({ url, type: 'image' }));
  return preloadResources(resources, onProgress, timeout);
}

// Critical image assets that must be loaded before showing the app
export const CRITICAL_IMAGE_ASSETS: string[] = [
  assetPath('/assets/identity-select-design.png'),
  assetPath('/assets/main-menu-daytime-bg.jpg'),
  assetPath('/assets/main-menu-night-bg.jpg'),
  assetPath('/assets/title-banner.png'),
  assetPath('/assets/start-game-btn.png'),
  assetPath('/assets/settings-btn.png'),
  assetPath('/assets/currency-bar.png'),
  assetPath('/assets/ui-resource-bar.png'),
  assetPath('/assets/ui-baozhuang-btn.png'),
  assetPath('/assets/level-grid-ui.png'),
  assetPath('/assets/backpack-bg.png'),
  assetPath('/assets/package-icon.png'),
];

export const DIALOG_IMAGE_ASSETS: string[] = [
  assetPath('/assets/character-avatar-yingning.png'),
  assetPath('/assets/character-avatar-wangpo.png'),
  assetPath('/assets/character-avatar-wangzifu.png'),
  assetPath('/assets/character-avatar-ghost-mother.png'),
  assetPath('/assets/character-avatar-bully.png'),
  assetPath('/assets/character-avatar-lingmei.png'),
  assetPath('/assets/skip-button.png'),
];

// Critical video assets
export const CRITICAL_VIDEO_ASSETS: string[] = [
  assetPath('/assets/intro-animation.mp4'),
];

export const BACKGROUND_VIDEO_ASSETS: string[] = [
  assetPath('/assets/level1-story-progress.mp4'),
  assetPath('/assets/level2-ending.mp4'),
];

// Critical audio assets (BGM and sound effects)
export const CRITICAL_AUDIO_ASSETS: string[] = [
  'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhk5piaahia.mp3', // menuBgm
  'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhkxziaahha.mp3', // gameBgm
  'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhk7piaahgq.mp3', // itemFound SFX
];

// Combined critical resources for splash screen preloading
export function getAllCriticalResources(): ResourceItem[] {
  const resources: ResourceItem[] = [];

  // Images
  CRITICAL_IMAGE_ASSETS.forEach((url) => {
    resources.push({ url, type: 'image' });
  });

  // Only the opening CG blocks the first app render. Other videos continue in background.
  CRITICAL_VIDEO_ASSETS.forEach((url) => {
    resources.push({ url, type: 'video' });
  });

  return resources;
}

export function getBackgroundResources(): ResourceItem[] {
  const targetItemResources = LEVELS.flatMap((level) =>
    level.items
      .map((item) => item.image)
      .filter((url): url is string => Boolean(url))
      .map((url) => ({ url, type: 'image' as const }))
  );

  return [
    ...DIALOG_IMAGE_ASSETS.map((url) => ({ url, type: 'image' as const })),
    ...targetItemResources,
    ...BACKGROUND_VIDEO_ASSETS.map((url) => ({ url, type: 'video' as const })),
    ...CRITICAL_AUDIO_ASSETS.map((url) => ({ url, type: 'audio' as const })),
  ];
}

// Legacy export for backward compatibility
export const CRITICAL_ASSETS = CRITICAL_IMAGE_ASSETS;

// Get level-specific assets
export function getLevelAssets(levelId: number): ResourceItem[] {
  const level = LEVELS.find((item) => item.id === levelId);
  if (!level) return [];

  const assets: ResourceItem[] = [
    { url: level.background, type: 'image' },
    { url: assetPath('/assets/ui-back-btn.jpg'), type: 'image' },
    { url: assetPath('/assets/ui-item-list.jpg'), type: 'image' },
    ...DIALOG_IMAGE_ASSETS.map((url) => ({ url, type: 'image' as const })),
  ];

  level.items.forEach((item) => {
    if (item.image) {
      assets.push({ url: item.image, type: 'image' });
    }
  });

  return assets;
}
