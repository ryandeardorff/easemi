import { writable } from 'svelte/store';
import CanvasImage from './core/CanvasItems/CanvasImage.svelte';
    
export const canvasTargetTranslation = writable({ x: 0, y: 0 });
export const canvasTargetScale = writable(1);
export const canvasCurrentScale = writable(1);
export const canvasCurrentTranslation = writable({ x: 0, y: 0 });
export const canvasItems = writable([
    {
        id: "ajkefkldsuyip113", //this will be randomly generated on server or client side
        position: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        component: CanvasImage,
        selected: false,
        
        //clientComponent: null, this could be a way to track client components in a single iterable array. 
        //but it currently has no way of being assigned a value
    },
    {
        id: "ajkefkldsuyi3438902", //this will be randomly generated on server or client side
        position: { x: 200, y: 200 },
        scale: { x: 300, y: 300 },
        component: CanvasImage,
        selected: false,
        
        //clientComponent: null,
    },
]);