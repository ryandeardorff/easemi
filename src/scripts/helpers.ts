import { canvasOffset, canvasScale } from "../stores";

function getCanvasValues(): { offset: { x: number; y: number }; scale: number } {
  let canvasOffsetValue = { x: 0, y: 0 };
  let canvasScaleValue = 1;
  const unsubscribeOffset = canvasOffset.subscribe((value) => {
    canvasOffsetValue = value;
  });
  unsubscribeOffset();
  const unsubscribeScale = canvasScale.subscribe((value) => {
    canvasScaleValue = value;
  });
  unsubscribeScale();
  return { offset: canvasOffsetValue, scale: canvasScaleValue };
}

function screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
  let canvas = getCanvasValues();
  return {
    x: (screenX - canvas.offset.x) / canvas.scale,
    y: (screenY - canvas.offset.y) / canvas.scale,
  };
}
function worldToScreen(screenX: number, screenY: number): { x: number; y: number } {
  let canvas = getCanvasValues();
  return {
    x: (screenX + canvas.offset.x) * canvas.scale,
    y: (screenY + canvas.offset.y) * canvas.scale,
  };
}

class Vector {
  static addEach(vector1: { x: number; y: number }, vector2: { x: number; y: number }): { x: number; y: number } {
    if (vector1 == null || vector2 == null) return;
    return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
  }
  static subtractEach(vector1: { x: number; y: number }, vector2: { x: number; y: number }): { x: number; y: number } {
    if (vector1 == null || vector2 == null) return;
    return { x: vector1.x - vector2.x, y: vector1.y - vector2.y };
  }
  static multiplyBoth(vector: { x: number; y: number }, multiplier: number): { x: number; y: number } {
    if (vector == null || multiplier == null) return;
    return { x: vector.x * multiplier, y: vector.y * multiplier };
  }
  static multiplyEach(
    vector: { x: number; y: number },
    multiplier: { x: number; y: number }
  ): { x: number; y: number } {
    if (vector == null || multiplier == null) return;
    return { x: vector.x * multiplier.x, y: vector.y * multiplier.y };
  }
}

function overlappingRect(rect1: DOMRect, rect2: DOMRect): boolean {
  let overlap = false;
  if (rect1 && rect2) {
    overlap = !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }
  return overlap;
}

export { screenToWorld, worldToScreen, Vector, overlappingRect };

var test = 100;

test;
