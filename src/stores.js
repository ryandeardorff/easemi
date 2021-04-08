import { writable } from 'svelte/store';

export const canvasTargetTranslation = writable({ x: 0, y: 0 });
export const canvasTargetScale = writable(1);