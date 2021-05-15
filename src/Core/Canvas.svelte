<script lang="ts">
  import { spring } from "svelte/motion";
  import {
    screenToWorld,
    Vector,
    squareNormalization,
    worldToScreen,
    overlappingRect,
    clamp,
  } from "../scripts/helpers";
  import {
    canvasTargetTranslation,
    canvasTargetScale,
    canvasCurrentScale,
    canvasCurrentTranslation,
    canvasItems,
    activeInput,
    operations,
    mappings,
  } from "../stores";
  import BoxSelection from "./BoxSelection.svelte";
  import Selection from "./Selection.svelte";
  import CanvasItem from "./CanvasItem.svelte";
  import {
    compareInput,
    mouseButtonMap,
    processKey,
    pushInput,
    shortcutDown,
    shortcutUp,
    spliceInput,
  } from "../scripts/input-management";
  import { clearSelection } from "../scripts/selection-management";
  const PAN_STIFFNESS = 1;
  const PAN_DAMPING = 1;
  const ZOOM_STIFFNESS = 0.2;
  const ZOOM_DAMPING = 1;
  const KEY_PAN_AMMOUNT = 100;

  const SCROLL_ZOOM_MULTIPLIER = 2;

  let boxSelection: BoxSelection;

  /*   Keyboard Input   */

  document.addEventListener("keydown", keyDown);
  function keyDown(e: KeyboardEvent) {
    let processedKey = processKey(e.key);
    if (e.repeat) {
      return;
    }
    pushInput(processedKey);
    shortcutDown(e);
    panInputStart(e);
  }

  document.addEventListener("keyup", keyUp);
  function keyUp(e: KeyboardEvent) {
    e.preventDefault();
    let processedKey = processKey(e.key);
    shortcutUp(e);
    spliceInput(processedKey);
    panInputEnd();
  }

  /*   Window Focus   */
  window.addEventListener("focus", windowFocus);
  function windowFocus() {}

  window.addEventListener("blur", windowBlur);
  function windowBlur() {
    shortcutUp(null); //runs the keyup event for any given shortcut, watch for bugs with this!
    activeInput.splice(0, activeInput.length);
  }

  document.addEventListener("mousedown", mouseDown);
  function mouseDown(e: MouseEvent) {
    pushInput(mouseButtonMap[e.button]);
  }
  document.addEventListener("mouseup", mouseUp);
  function mouseUp(e: MouseEvent) {
    spliceInput(mouseButtonMap[e.button]);

    panInputEnd();
  }
  document.addEventListener("mousemove", mouseMove);
  function mouseMove(e: MouseEvent) {
    panMouseMove(e);
  }

  function backgroundMouseDown(e: MouseEvent) {
    pushInput(mouseButtonMap[e.button]);
    if (compareInput(operations.CANVAS.BOX_SELECT)) {
      boxSelection.backgroundStartBoxSelection(e.clientX, e.clientY, false);
    }
    if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
      boxSelection.backgroundStartBoxSelection(e.clientX, e.clientY, true);
    }
  }

  function canvasMouseDown(e: MouseEvent) {
    pushInput(mouseButtonMap[e.button]);
    panInputStart(e);
  }

  function canvasMouseWheel(e: WheelEvent) {
    switch (clamp(e.deltaY, -1, 1) * -1) {
      case -1:
        pushInput("scrollDown");
        break;
      case 1:
        pushInput("scrollUp");
        break;
    }
    const clientInit = screenToWorld(e.clientX, e.clientY);
    zoomInput();
    spliceInput("scrollDown");
    spliceInput("scrollUp");
    const clientNow = screenToWorld(e.clientX, e.clientY, null, null, zoomTarget.s);
    let change = Vector.multiplyBoth(Vector.subtractEach(clientNow, clientInit), zoomTarget.s);
    offsetZoom(change.x, change.y);
  }

  function panMouseMove(e: MouseEvent) {
    if (panning) {
      if (compareInput(operations.CANVAS.PAN)) {
        pan(e.movementX, e.movementY);
      }
    }
  }
  function panInputStart(e: any) {
    if (compareInput(operations.CANVAS.PAN)) {
      panStart(e.clientX, e.clientY);
      console.log("panstart");
    }
  }
  function panInputEnd() {
    if (panning) {
      if (compareInput(operations.CANVAS.PAN)) {
        panEnd();
      }
    }
  }

  function zoomInput() {
    if (compareInput(operations.CANVAS.ZOOM_IN)) {
      zoom(SCROLL_ZOOM_MULTIPLIER);
    }
    if (compareInput(operations.CANVAS.ZOOM_OUT)) {
      zoom(-SCROLL_ZOOM_MULTIPLIER);
    }
  }

  /*   Canvas Transformations   */
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
      precision: 0.0001,
    }
  );

  //Define the target and spring for zooming (including offset in the target)
  let zoomTarget = { x: 0, y: 0, s: 1 };
  const zoomSpring = spring(
    { x: 0, y: 0, s: 1 },
    {
      stiffness: ZOOM_STIFFNESS,
      damping: ZOOM_DAMPING,
      precision: 0.0001,
    }
  );

  //Define the combined spring coordinates to be used by the canvas component's transform property
  let canvasTranslation = { x: 0, y: 0 };
  $: canvasTranslation = { x: $panSpring.x + $zoomSpring.x, y: $panSpring.y + $zoomSpring.y };
  $: canvasZoom = $zoomSpring.s;
  $: $canvasCurrentScale = canvasZoom;
  $: $canvasCurrentTranslation = canvasTranslation;

  //Movement Functions
  let panning = false;
  function pan(dx: number, dy: number) {
    panTarget.x = panTarget.x + dx / devicePixelRatio;
    panTarget.y = panTarget.y + dy / devicePixelRatio;
    panSpring.update(($panSpring) => panTarget);
  }
  function panStart(cx: number, cy: number) {
    panning = true;
  }
  function panEnd() {
    panning = false;
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
</script>

<div id="canvas" on:mousedown={canvasMouseDown} on:wheel={canvasMouseWheel}>
  <div id="background" on:mousedown={backgroundMouseDown} />

  <BoxSelection bind:this={boxSelection} />

  <Selection />

  <div
    id="contents"
    style="transform: translate({canvasTranslation.x}px,{canvasTranslation.y}px)scale({canvasZoom},{canvasZoom})"
  >
    {#each $canvasItems as item, index}
      <CanvasItem itemId={item.id} itemIndex={index} on:clearselection={clearSelection}>
        <svelte:component this={item.component} />
      </CanvasItem>
    {/each}
    <!--<p>yo this is a test</p>jj
    <p>yo this is a test</p>
    <img class="selectable" src="https://pbs.twimg.com/profile_images/1121395911849062400/7exmJEg4.png" alt="test" />-->
  </div>
</div>

<style>
  #canvas {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  #background {
    position: fixed; /* could be absolute as well */
    width: 100%;
    height: 100%;
    background-color: lightgray;
  }
  #contents {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
    /* transform: translateX(var(--translateX)); */
    /*pointer-events: none;*/
    user-select: none;
    background-color: white;
  }
</style>
