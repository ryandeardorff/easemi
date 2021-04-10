import { get } from "svelte/store";
import { canvasTargetTranslation, canvasTargetScale } from "../stores";

function getCanvasValues(): { offset: { x: number; y: number }; scale: number } {
  let canvasTargetTranslationValue = { x: 0, y: 0 };
  let canvasTargetScaleValue = 1;
  canvasTargetTranslationValue = get(canvasTargetTranslation);
  canvasTargetScaleValue = get(canvasTargetScale);
  return { offset: canvasTargetTranslationValue, scale: canvasTargetScaleValue };
}

function screenToWorld(
  screenX: number,
  screenY: number,
  customX: number = null,
  customY: number = null,
  customScale: number = null
): { x: number; y: number } {
  let canvas = getCanvasValues();
  if (customX != null) {
    canvas.offset.x = customX;
  }
  if (customY != null) {
    canvas.offset.y = customY;
  }
  if (customScale != null) {
    canvas.scale = customScale;
  }
  return {
    x: (screenX - canvas.offset.x) / canvas.scale,
    y: (screenY - canvas.offset.y) / canvas.scale,
  };
}
function worldToScreen(
  screenX: number,
  screenY: number,
  customX: number = null,
  customY: number = null,
  customScale: number = null
): { x: number; y: number } {
  let canvas = getCanvasValues();
  if (customX != null) {
    canvas.offset.x = customX;
  }
  if (customY != null) {
    canvas.offset.y = customY;
  }
  if (customScale != null) {
    canvas.scale = customScale;
  }
  return {
    x: screenX * canvas.scale + canvas.offset.x,
    y: screenY * canvas.scale + canvas.offset.y,
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

function squareNormalization(
  corner1: { x: number; y: number },
  corner2: { x: number; y: number }
): { x: number; y: number; width: number; height: number } {
  let position = { x: 0, y: 0 };
  let scale = { x: 0.0, y: 0.0 };
  if (corner1.x > corner2.x) {
    position.x = corner2.x;
    scale.x = corner1.x - corner2.x;
  } else {
    position.x = corner1.x;
    scale.x = corner2.x - corner1.x;
  }
  if (corner1.y > corner2.y) {
    position.y = corner2.y;
    scale.y = corner1.y - corner2.y;
  } else {
    position.y = corner1.y;
    scale.y = corner2.y - corner1.y;
  }
  return { x: position.x, y: position.y, width: scale.x, height: scale.y };
}

export { screenToWorld, worldToScreen, Vector, overlappingRect, squareNormalization };

var test = 100;

test;
