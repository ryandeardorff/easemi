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
  import Selection from "./BoxSelection.svelte";
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

  let WINDOW_PIXEL_RESOLUTION = 1;

  WINDOW_PIXEL_RESOLUTION = window.devicePixelRatio;

  /*   Keyboard Input   */
  //TODO: Investigate moving this into a module component or script in some way.
  //eventually this should be implemented somewhere for saving/storage + json parse
  //Define a basic keybindings menu, with defaults (not fully mapped yet)

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

    boxSelectMouseUp(e);
    panInputEnd();
  }
  document.addEventListener("mousemove", mouseMove);
  function mouseMove(e: MouseEvent) {
    boxSelectMouseMove(e);
    panMouseMove(e);
  }

  function backgroundMouseDown(e: MouseEvent) {
    pushInput(mouseButtonMap[e.button]);
    if (compareInput(operations.CANVAS.BOX_SELECT)) {
      startSelection(e.clientX, e.clientY, false);
    }
    if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
      startSelection(e.clientX, e.clientY, true);
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

  function boxSelectMouseMove(e: MouseEvent) {
    if (selecting) {
      if (compareInput(operations.CANVAS.BOX_SELECT)) {
        dragSelection(e.clientX, e.clientY, false);
      } else if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
        dragSelection(e.clientX, e.clientY, true);
      } else {
        endSelection();
      }
    }
  }
  function boxSelectMouseUp(e: MouseEvent) {
    if (
      selecting &&
      activeInput.toString() !=
        mappings
          .find((element) => element.operation == operations.CANVAS.BOX_SELECT || operations.CANVAS.BOX_SELECT_ADDITIVE)
          .input.toString()
    ) {
      endSelection();
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

  //Movement Functions
  let panning = false;
  function pan(dx: number, dy: number) {
    panTarget.x = panTarget.x + dx / WINDOW_PIXEL_RESOLUTION;
    panTarget.y = panTarget.y + dy / WINDOW_PIXEL_RESOLUTION;
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

  /*   Box Selections   */
  //TODO: Refactor these functions as box selections rather than just "selection"s.
  let boxSelectionStart = { x: 0, y: 0 };
  let boxSelectionScale = { x: 1000, y: 1000 };
  let boxSelectionPosition = { x: 0, y: 0 };
  let selecting = false;
  let boxSelectionVisibility = "hidden";
  function startSelection(x: number, y: number, additive: boolean) {
    selecting = true;
    boxSelectionStart = screenToWorld(x, y);
    boxSelectionScale = { x: 0, y: 0 };
    boxSelectionPosition = { x: 0, y: 0 };
    boxSelectionVisibility = "hidden";
    if (!additive) {
      clearSelection();
    }
  }
  function dragSelection(cx: number, cy: number, additive: boolean) {
    let currentToWorld = screenToWorld(cx, cy);
    let square = squareNormalization(boxSelectionStart, currentToWorld);
    boxSelectionScale = { x: square.width, y: square.height };
    boxSelectionPosition = { x: square.x, y: square.y };
    boxSelectionVisibility = "visible";
    compareSelection(additive);
  }
  function endSelection() {
    selecting = false;
    boxSelectionVisibility = "hidden";
  }

  let boxSelectionScaleScreen = { x: 0, y: 0 };
  $: boxSelectionPositionScreen = worldToScreen(
    boxSelectionPosition.x,
    boxSelectionPosition.y,
    $canvasCurrentTranslation.x,
    $canvasCurrentTranslation.y,
    $canvasCurrentScale
  );
  $: boxSelectionScaleScreen = Vector.multiplyBoth(boxSelectionScale, $canvasCurrentScale);

  //Function that compares elements to the boxSelection box.
  function compareSelection(additive: boolean) {
    for (let item of $canvasItems) {
      if (
        overlappingRect(
          new DOMRect(boxSelectionPosition.x, boxSelectionPosition.y, boxSelectionScale.x, boxSelectionScale.y),
          new DOMRect(item.position.x, item.position.y, item.scale.x, item.scale.y)
        )
      ) {
        //TODO: split element boxSelection into a separate function that could be called by a mouse events.
        item.selected = true;
      } else if (!additive) {
        item.selected = false;
      }
    }
    canvasItems.update((u) => u);
  }

  function selectItem() {}

  /*   Item Movement   */
  let dragging = false;
  function startDragging() {
    dragging = true;
  }
  function dragItems(dx: number, dy: number) {
    for (let item of $canvasItems.filter((item) => item.selected == true)) {
      let transformVector = Vector.multiplyBoth({ x: dx, y: dy }, 1 / $canvasCurrentScale);
      item.position = Vector.addEach(item.position, transformVector);
    }
    canvasItems.update((u) => u);
  }
  function stopDragging() {
    dragging = false;
  }
</script>

<div id="canvas" on:mousedown={canvasMouseDown} on:mousewheel={canvasMouseWheel}>
  <div id="background" on:mousedown={backgroundMouseDown} />

  <Selection
    translateX={boxSelectionPositionScreen.x}
    translateY={boxSelectionPositionScreen.y}
    scaleX={boxSelectionScaleScreen.x}
    scaleY={boxSelectionScaleScreen.y}
    visibility={boxSelectionVisibility}
  />

  <div
    id="contents"
    style="transform: translate({canvasTranslation.x}px,{canvasTranslation.y}px)scale({canvasZoom},{canvasZoom})"
  >
    {#each $canvasItems as item, index}
      <CanvasItem itemId={item.id} itemIndex={index} on:clearselection={clearSelection}>
        <svelte:component this={item.component} />
      </CanvasItem>
    {/each}
    <!--<p>yo this is a test</p>
    <p>yo this is a test</p>
    <img class="selectable" src="https://pbs.twimg.com/profile_images/1121395911849062400/7exmJEg4.png" alt="test" />-->
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
