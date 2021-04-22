<script lang="ts">
  import { spring } from "svelte/motion";
  import { screenToWorld, Vector, squareNormalization, worldToScreen } from "../scripts/helpers";
  import {
    canvasTargetTranslation,
    canvasTargetScale,
    canvasCurrentScale,
    canvasCurrentTranslation,
  } from "../stores.js";
  import Selection from "./Selection.svelte";
  const PAN_STIFFNESS = 1;
  const PAN_DAMPING = 1;
  const ZOOM_STIFFNESS = 0.2;
  const ZOOM_DAMPING = 1;
  const MOUSE_PAN_BUTTON = 4;
  const MOUSE_SELECT_BUTTON = 1;
  const KEY_PAN_AMMOUNT = 100;
  const KEY_PAN_LEFT = "ArrowLeft";
  const KEY_PAN_RIGHT = "ArrowRight";
  const KEY_PAN_UP = "ArrowUp";
  const KEY_PAN_DOWN = "ArrowDown";

  const SCROLL_ZOOM_MULTIPLIER = 2;

  let WINDOW_PIXEL_RESOLUTION = 1;

  WINDOW_PIXEL_RESOLUTION = window.devicePixelRatio;

  document.onkeydown = function (event) {
    let char = typeof event !== "undefined" ? event.key : event.which;
    switch (char) {
      case KEY_PAN_LEFT:
        pan(-KEY_PAN_AMMOUNT, 0);
        break;
      case KEY_PAN_RIGHT:
        pan(KEY_PAN_AMMOUNT, 0);
        break;
      case KEY_PAN_UP:
        pan(0, -KEY_PAN_AMMOUNT);
        break;
      case KEY_PAN_DOWN:
        pan(0, KEY_PAN_AMMOUNT);
        break;
    }
  };

  //Send to the Store the combined spring target values for world space calculations.
  $: $canvasTargetTranslation = Vector.addEach(panTarget, {
    x: zoomTarget.x,
    y: zoomTarget.y,
  });
  $: $canvasTargetScale = zoomTarget.s;

  //Define the target and spring for panning
  let panTarget = { x: 0, y: 0 };
  const panSpring = spring(
    { x: 0, y: 0 },
    {
      stiffness: PAN_STIFFNESS,
      damping: PAN_DAMPING,
      precision: 0.0000001,
    }
  );

  //Define the target and spring for zooming (including offset in the target)
  let zoomTarget = { x: 0, y: 0, s: 1 };
  const zoomSpring = spring(
    { x: 0, y: 0, s: 1 },
    {
      stiffness: ZOOM_STIFFNESS,
      damping: ZOOM_DAMPING,
      precision: 0.0000001,
    }
  );

  //Define the combined spring coordinates to be used by the canvas component's transform property
  let canvasTranslation = { x: 0, y: 0 };
  $: canvasTranslation = { x: $panSpring.x + $zoomSpring.x, y: $panSpring.y + $zoomSpring.y };
  $: canvasZoom = $zoomSpring.s;
  $: $canvasCurrentScale = canvasZoom;
  $: $canvasCurrentTranslation = canvasTranslation;

  function pan(dx: number, dy: number) {
    panTarget.x = panTarget.x + dx / WINDOW_PIXEL_RESOLUTION;
    panTarget.y = panTarget.y + dy / WINDOW_PIXEL_RESOLUTION;
    panSpring.update(($panSpring) => panTarget);
  }
  function offsetZoom(dx: number, dy: number) {
    zoomTarget.x = zoomTarget.x + dx;
    zoomTarget.y = zoomTarget.y + dy;
    zoomSpring.update(($zoomSpring) => zoomTarget);
  }
  function zoom(ds: number) {
    zoomTarget.s = zoomTarget.s + ds * zoomTarget.s * 0.1;
    zoomSpring.update(($zoomSpring) => zoomTarget);
  }

  //TODO: look into moving selection visuals outside of world space,
  //also look into how to avoid snapping at high zoom levels for future features,
  //as well as for the world space related calculations of this selection feature.
  let selectionStart = { x: 0, y: 0 };
  let selectionScale = { x: 1000, y: 1000 };
  let selectionPosition = { x: 0, y: 0 };
  let selecting = false;
  let selectionVisibility = "hidden";
  function startSelection(x: number, y: number) {
    selecting = true;
    selectionStart = screenToWorld(x, y);
    selectionScale = { x: 0, y: 0 };
    selectionPosition = { x: 0, y: 0 };
    selectionVisibility = "visible";
  }
  function dragSelection(cx: number, cy: number) {
    if (selecting) {
      let currentToWorld = screenToWorld(cx, cy);
      let square = squareNormalization(selectionStart, currentToWorld);
      selectionScale = { x: square.width, y: square.height };
      selectionPosition = { x: square.x, y: square.y };
    }
  }
  function endSelection() {
    selecting = false;
    selectionVisibility = "hidden";
  }

  let selectionScaleScreen = { x: 0, y: 0 };
  $: selectionPositionScreen = worldToScreen(
    selectionPosition.x,
    selectionPosition.y,
    $canvasCurrentTranslation.x,
    $canvasCurrentTranslation.y,
    $canvasCurrentScale
  );
  $: selectionScaleScreen = Vector.multiplyBoth(selectionScale, $canvasCurrentScale);
  $: console.log(selectionPositionScreen, selectionScaleScreen);

  /*    Input Handling    */
  function canvasMouseDown(e: MouseEvent) {}
  function canvasMouseUp(e: MouseEvent) {
    endSelection();
  }
  function canvasMouseMove(e: MouseEvent) {
    switch (e.buttons) {
      case MOUSE_PAN_BUTTON:
        pan(e.movementX, e.movementY);
        break;
      case MOUSE_SELECT_BUTTON:
        dragSelection(e.clientX, e.clientY);
        break;
      default:
        endSelection();
    }
  }
  function canvasMouseWheel(e: WheelEvent) {
    let scrollDirection = e.deltaY;
    let worldPositionBefore = screenToWorld(e.clientX, e.clientY);
    zoom((scrollDirection / -100) * SCROLL_ZOOM_MULTIPLIER);
    let worldPositionAfter = screenToWorld(e.clientX, e.clientY, null, null, zoomTarget.s);

    offsetZoom(
      (worldPositionAfter.x - worldPositionBefore.x) * zoomTarget.s,
      (worldPositionAfter.y - worldPositionBefore.y) * zoomTarget.s
    );
  }
  function canvasMouseLeave(e: MouseEvent) {
    //endSelection();
  }
  function backgroundMouseDown(e: MouseEvent) {
    switch (e.buttons) {
      case 1:
        startSelection(e.clientX, e.clientY);
        break;
    }
  }
</script>

<div
  id="canvas"
  on:mousedown={canvasMouseDown}
  on:mouseup={canvasMouseUp}
  on:mousemove={canvasMouseMove}
  on:mousewheel={canvasMouseWheel}
  on:pointerleave={canvasMouseLeave}
>
  <div id="background" on:mousedown={backgroundMouseDown} />

  <Selection
    translateX={selectionPositionScreen.x}
    translateY={selectionPositionScreen.y}
    scaleX={selectionScaleScreen.x}
    scaleY={selectionScaleScreen.y}
    visibility={selectionVisibility}
  />

  <div
    id="contents"
    style="transform: translate({canvasTranslation.x}px,{canvasTranslation.y}px)scale({canvasZoom},{canvasZoom})"
  >
    <p>yo this is a test</p>
    <p>yo this is a test</p>
    <img class="selectable" src="https://pbs.twimg.com/profile_images/1121395911849062400/7exmJEg4.png" alt="test" />
  </div>
</div>

<style>
  #canvas {
    width: 100%;
    height: 100%;
    position: fixed;
  }
  #background {
    width: 100%;
    height: 100%;
    background-color: lightgray;
    position: fixed;
  }
  #contents {
    position: absolute;
    transform-origin: top left;
    /* transform: translateX(var(--translateX)); */
    /*pointer-events: none;*/
    user-select: none;
    background-color: white;
  }
  p {
    position: relative;
    align-self: center;
    left: 50%;
  }
  img {
    position: relative;
  }
</style>
