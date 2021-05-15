<script lang="ts">
  import { overlappingRect, screenToWorld, squareNormalization, Vector, worldToScreen } from "../scripts/helpers";
  import { compareInput } from "../scripts/input-management";
  import { clearSelection } from "../scripts/selection-management";
  import {
    activeInput,
    canvasCurrentScale,
    canvasCurrentTranslation,
    canvasItems,
    mappings,
    operations,
  } from "../stores";

  export let visibility = "hidden";

  let start = { x: 0, y: 0 };
  let scale = { x: 0, y: 0 };
  let position = { x: 0, y: 0 };
  let selecting = false;

  export const backgroundStartBoxSelection = (x: number, y: number, additive: boolean) =>
    startBoxSelection(x, y, additive);

  function windowMouseMove(e: MouseEvent) {
    boxSelectMouseMove(e);
  }
  function windowMouseUp(e: MouseEvent) {
    boxSelectMouseUp(e);
  }

  function boxSelectMouseMove(e: MouseEvent) {
    if (selecting) {
      if (compareInput(operations.CANVAS.BOX_SELECT)) {
        dragBoxSelection(e.clientX, e.clientY, false);
      } else if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
        dragBoxSelection(e.clientX, e.clientY, true);
      } else {
        endBoxSelection();
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
      endBoxSelection();
    }
  }

  function startBoxSelection(x: number, y: number, additive: boolean) {
    selecting = true;
    start = screenToWorld(x, y);
    scale = { x: 0, y: 0 };
    position = { x: 0, y: 0 };
    visibility = "hidden";
    if (!additive) {
      clearSelection();
    }
  }
  function dragBoxSelection(cx: number, cy: number, additive: boolean) {
    let currentToWorld = screenToWorld(cx, cy);
    let square = squareNormalization(start, currentToWorld);
    scale = { x: square.width, y: square.height };
    position = { x: square.x, y: square.y };
    visibility = "visible";
    compareSelection(additive);
  }
  function endBoxSelection() {
    for (let item of $canvasItems) {
      if (item.inSelectionRange) {
        item.selected = true;
        item.inSelectionRange = false;
      }
    }
    canvasItems.update((u) => u);
    selecting = false;
    visibility = "hidden";
  }

  let scaleScreen = { x: 0, y: 0 };
  $: positionScreen = worldToScreen(
    position.x,
    position.y,
    $canvasCurrentTranslation.x,
    $canvasCurrentTranslation.y,
    $canvasCurrentScale
  );
  $: scaleScreen = Vector.multiplyBoth(scale, $canvasCurrentScale);

  //Function that compares elements to the boxSelection box.
  function compareSelection(additive: boolean) {
    for (let item of $canvasItems) {
      if (
        overlappingRect(
          new DOMRect(position.x, position.y, scale.x, scale.y),
          new DOMRect(item.position.x, item.position.y, item.scale.x, item.scale.y)
        )
      ) {
        //TODO: split element boxSelection into a separate function that could be called by a mouse events.
        item.inSelectionRange = true;
      } else {
        item.inSelectionRange = false;
      }
    }
    canvasItems.update((u) => u);
  }
</script>

<svelte:window on:mousemove={windowMouseMove} on:mouseup={windowMouseUp} />
<svg
  id="selection"
  width={Math.max(6, scaleScreen.x)}
  height={Math.max(6, scaleScreen.y)}
  style="
    transform:translate({positionScreen.x}px, {positionScreen.y}px);
    visibility:{visibility};
  "
>
  <defs>
    <filter id="selection-glow" x="-10" y="-10" width="200" height="200">
      <feGaussianBlur result="blurOut" stdDeviation="10" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs>
  <rect
    id="selection-box"
    x="3"
    y="3"
    width={Math.max(3, scaleScreen.x - 6)}
    height={Math.max(3, scaleScreen.y - 6)}
    rx="5"
    filter="url(#selection-glow)"
  />
</svg>

<style>
  #selection {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
    pointer-events: none;
    z-index: 10;
  }
  #selection-box {
    fill: rgba(0, 183, 255, 0.295);
    stroke-width: 3;
    stroke: rgb(21, 189, 255);
  }
</style>
