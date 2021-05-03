<script lang="ts">
  import { canvasItems } from "../stores.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let itemId = "";
  export let itemIndex = 0;
  let divclass = "";
  let position = { x: 0, y: 0 };
  let scale = { x: 1, y: 1 };
  $: canvasItem = $canvasItems[itemIndex];
  $: position = canvasItem.position;
  $: selected = canvasItem.selected;
  $: if (selected) {
    divclass = "selected";
  } else {
    divclass = "";
  }
</script>

<div
  id="root"
  style="--positionX: {position.x}px; --positionY: {position.y}px; --scaleX: {scale.x}px; --scaleY: {scale.y}px;"
  class={divclass}
  on:mousedown
  on:click
>
  <slot {itemId} {position} {scale}>This item has no type</slot>
</div>

<style>
  #root {
    position: absolute;
    transform: translate(var(--positionX), var(--positionY));
    transform-origin: top left;
  }
</style>
