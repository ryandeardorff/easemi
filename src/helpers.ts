import { canvasOffset, canvasScale } from "./stores";

function getCanvasValues(): { offset: { x: number, y: number }, scale: number } {
    let canvasOffsetValue = { x: 0, y: 0 };
    let canvasScaleValue = 1;
    const unsubscribeOffset = canvasOffset.subscribe(value => {
        canvasOffsetValue = value;
    })
    unsubscribeOffset();
    const unsubscribeScale = canvasScale.subscribe(value => {
        canvasScaleValue = value;
    })
    unsubscribeScale();
    return { offset: canvasOffsetValue, scale: canvasScaleValue };
};

function screenToWorld(screenX: number, screenY: number): { x: number, y: number }{
    let canvas = getCanvasValues();
    return {
        x: (screenX - canvas.offset.x) / canvas.scale,
        y: (screenY - canvas.offset.y) / canvas.scale
    };
}
function worldToScreen(screenX: number, screenY: number): { x: number, y: number }{
    let canvas = getCanvasValues();
    return { x: (screenX + canvas.offset.x)*canvas.scale, y: (screenY + canvas.offset.y)*canvas.scale };
}

class Vector {
    static addEach(vector1: { x:number, y:number}, vector2: { x:number, y:number}):{x:number, y:number} {
        if (vector1 == null || vector2 == null) return;
        return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
    }
    static subtractEach(vector1: { x:number, y:number}, vector2: { x:number, y:number}):{x:number, y:number} {
        if (vector1 == null || vector2 == null) return;
        return { x: vector1.x - vector2.x, y: vector1.y - vector2.y };
    }
    static multiplyBoth(vector: { x: number, y: number }, multiplier: number): { x: number, y: number }{
        if (vector == null || multiplier == null) return;
        return { x: vector.x * multiplier, y: vector.y * multiplier };
    }
    static multiplyEach(vector: { x: number, y: number }, multiplier: {x:number, y:number}): { x: number, y: number }{
        if (vector == null || multiplier == null) return;
        return { x: vector.x * multiplier.x, y: vector.y * multiplier.y };
    }
}

export { screenToWorld, worldToScreen, Vector };