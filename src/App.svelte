<script lang="ts">
  import Canvas from "./Canvas.svelte";
  import { canvasOffset, canvasScale } from "./stores.js";
</script>

<main>
  <!-- <input type="number" bind:value={$canvasOffset.x} />
  <input type="number" bind:value={$canvasOffset.y} />
  <input type="number" bind:value={$canvasScale} />
  <div id="titleBar">
    <h2>This is where the title bar would be!</h2>
  </div> -->
  <Canvas />
</main>

<style>
  /* #titleBar {
    background-color: lightgray;
    height: fit-content;
    padding: 10px;
  }
  h2 {
    margin: 0;
  } */
</style>
