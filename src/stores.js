import { writable } from 'svelte/store';

//TODO: Add canvasCurrentTranslation
export const canvasTargetTranslation = writable({ x: 0, y: 0 });
export const canvasTargetScale = writable(1);
export const canvasCurrentScale = writable(1);