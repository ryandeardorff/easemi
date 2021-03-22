<script lang="ts">
  import { screenToWorld, worldToScreen, Vector } from "./helpers.js";
  import { canvasOffset, canvasScale } from "./stores.js";
  import Selection from "./Core/Selection.svelte";

  const ZOOM_SENSITIVITY = 0.1;

  $: translateX = $canvasOffset.x;
  $: translateY = $canvasOffset.y;
  $: scaleX = $canvasScale;
  $: scaleY = $canvasScale;

  let initialOffset = { x: 0, y: 0 };
  let initialPanPosition = { x: 0, y: 0 };

  let selectStart = { x: 0, y: 0 };
  let selectOffset = { x: 0, y: 0 };

  function mouseDown(e: MouseEvent) {
    switch (e.button) {
      case 0:
        selectStart = screenToWorld(e.clientX, e.clientY);
        break;
      case 1:
        initialPanPosition = { x: e.clientX, y: e.clientY };
        initialOffset = $canvasOffset;
        break;
      case 2:
        break;
    }
  }
  function mouseUp(e: MouseEvent) {}
  function mouseMove(e: MouseEvent) {
    switch (e.buttons) {
      case 1:
        selectOffset = Vector.subtractEach(
          screenToWorld(e.clientX, e.clientY),
          selectStart
        );
        break;
      case 4:
        let x = initialOffset.x + (e.clientX - initialPanPosition.x);
        let y = initialOffset.y + (e.clientY - initialPanPosition.y);
        $canvasOffset = { x: x, y: y };
        break;
    }
  }
  function mouseWheel(e: WheelEvent) {
    let scrollDirection = -e.deltaY / 100;
    let initialZoomPosition = screenToWorld(e.clientX, e.clientY);
    $canvasScale += scrollDirection * ZOOM_SENSITIVITY * $canvasScale;
    let afterZoomPosition = screenToWorld(e.clientX, e.clientY);
    let zoomPositionDifference = Vector.multiplyBoth(
      Vector.subtractEach(afterZoomPosition, initialZoomPosition),
      $canvasScale
    );
    $canvasOffset = Vector.addEach($canvasOffset, zoomPositionDifference);
    console.log(zoomPositionDifference);
  }
</script>

<div
  id="canvas"
  on:mousedown={mouseDown}
  on:mouseup={mouseUp}
  on:mousemove={mouseMove}
  on:mousewheel={mouseWheel}
  on:contextmenu|preventDefault
  on:select|preventDefault
  on:drag|preventDefault
>
  <div id="background" />

  <div
    id="contents"
    style="--translateX: {translateX}; --translateY: {translateY}; --scaleX: {scaleX}; --scaleY: {scaleY};"
  >
    <Selection
      translateX={selectStart.x}
      translateY={selectStart.y}
      scaleX={selectOffset.x}
      scaleY={selectOffset.y}
    />
    <p>yo this is a test</p>
    <p>yo this is a test</p>
    <img
      src="https://pbs.twimg.com/profile_images/1121395911849062400/7exmJEg4.png"
      alt="test"
    />
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
    position: fixed;
  }
  #contents {
    position: absolute;
    width: fit-content;
    height: fit-content;
    transform-origin: top left;
    /* transform: translateX(var(--translateX)); */
    transform: matrix(
      var(--scaleX),
      0,
      0,
      var(--scaleY),
      var(--translateX),
      var(--translateY)
    );
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
