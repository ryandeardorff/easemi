<script lang="ts">
  import { canvasCurrentScale, canvasItems, operations } from "../stores";
  import { createEventDispatcher } from "svelte";
  import { compareInput, mouseButtonMap, pushInput } from "../scripts/input-management";
  import { Vector } from "../scripts/helpers";
  import { clearSelection } from "../scripts/selection-management";

  const dispatch = createEventDispatcher();
  const DRAG_THRESHOLD = 20; //TODO: Build out a settings store (maybe multiple stores for different things)

  export let itemId = "";
  export let itemIndex = 0;
  let divclass = "";
  let position = { x: 0, y: 0 };
  let scale = { x: 1, y: 1 };
  let canvasZoom = 1;
  $: canvasZoom = $canvasCurrentScale;
  $: canvasItem = $canvasItems[itemIndex];
  $: position = canvasItem.position;
  $: scale = canvasItem.scale;
  $: selected = canvasItem.selected;
  $: if (selected) {
    divclass = "selected";
  } else {
    divclass = "";
  }

  let selectPressed = false;
  let movePressed = false;
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  function mouseDown(e: MouseEvent) {
    pushInput(mouseButtonMap[e.button]);
    if (compareInput(operations.ITEM.SELECT)) {
      selectInputDown();
    }
    if (compareInput(operations.ITEM.MOVE)) {
      if (!selected) {
        clearSelection();
        canvasItem.selected = true;
      }
      movePressed = true;
      dragStart = { x: e.clientX, y: e.clientY };
    }
  }
  function windowMouseMove(e: MouseEvent) {
    if (!dragging) {
      let difference = Vector.subtractEach({ x: e.clientX, y: e.clientY }, dragStart);
      let distance = Vector.getLength(difference);
      if (distance > DRAG_THRESHOLD) {
        dragging = true;
      }
    }
    if (compareInput(operations.ITEM.MOVE) && movePressed && dragging) {
      dragItems(e.movementX, e.movementY);
      selectPressed = false;
    }
  }
  function windowMouseUp(e: MouseEvent) {
    if (!compareInput(operations.ITEM.MOVE)) {
      movePressed = false;
      dragging = false;
    }
    if (!compareInput(operations.ITEM.SELECT) && selectPressed) {
      selectInputUp();
    }
  }

  function selectInputDown() {
    selectPressed = true;
  }
  function selectInputUp() {
    if (selectPressed) {
      clearSelection();
      canvasItem.selected = true;
      canvasItems.update((u) => u);
    }
    selectPressed = false;
  }

  function dragItems(dx: number, dy: number) {
    for (let item of $canvasItems.filter((item) => item.selected == true)) {
      let transformVector = Vector.multiplyBoth({ x: dx, y: dy }, 1 / $canvasCurrentScale);
      item.position = Vector.addEach(item.position, transformVector);
    }
    canvasItems.update((u) => u);
  }
</script>

<svelte:window on:mousemove={windowMouseMove} on:mouseup={windowMouseUp} />
<div
  id="root"
  style="--positionX: {position.x}px; --positionY: {position.y}px; --scaleX: {scale.x}px; --scaleY: {scale.y}px; --canvasZoom: {canvasZoom}"
  class={divclass}
  on:mousedown={mouseDown}
  on:mouseup
  on:mouseover
>
  <slot class="slot" {itemId} {position} {scale}>This item has no type</slot>
</div>

<style>
  #root {
    position: absolute;
    transform: translate(var(--positionX), var(--positionY));
    transform-origin: top left;
    width: var(--scaleX);
    height: var(--scaleY);
  }
  .selected {
    --test: calc(8px / var(--canvasZoom));
    overflow: hidden;
    border-radius: 20px;
    box-shadow: 0px 2px var(--test) rgba(0, 0, 0, 0.3);
  }
</style>
