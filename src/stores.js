import { writable } from 'svelte/store';

export const canvasOffset = writable({ x: 0, y: 0 });
export const canvasScale = writable(1);