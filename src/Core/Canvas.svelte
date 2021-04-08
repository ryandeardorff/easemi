<script lang="ts">
  import { spring } from "svelte/motion";
  import { screenToWorld, Vector } from "../scripts/helpers";
  import {  canvasOffset, canvasScale } from "../stores.js";
  const PAN_STIFFNESS = .4;
  const PAN_DAMPING = 1;
  const ZOOM_STIFFNESS = .1;
  const ZOOM_DAMPING = 1;
  const MOUSE_PAN_BUTTON = 4;
  const KEY_PAN_AMMOUNT = 100;
  const KEY_PAN_LEFT = "ArrowLeft";
  const KEY_PAN_RIGHT = "ArrowRight";
  const KEY_PAN_UP = "ArrowUp";
  const KEY_PAN_DOWN = "ArrowDown";

  //TODO: add comments for clarity. 
  const SCROLL_ZOOM_MULTIPLIER = 2;

  document.onkeydown = function (event) {
    let char = (typeof event !== 'undefined') ? event.key : event.which
    switch (char){
      case KEY_PAN_LEFT:
        pan(-KEY_PAN_AMMOUNT, 0)
        break;
      case KEY_PAN_RIGHT:
        pan(KEY_PAN_AMMOUNT, 0)
        break;
      case KEY_PAN_UP:
        pan(0, -KEY_PAN_AMMOUNT)
        break;
      case KEY_PAN_DOWN:
        pan(0, KEY_PAN_AMMOUNT)
        break;
    }
  }

  $: console.log(Vector.subtractEach($canvasCoords,$canvasOffset));

  //TODO: Fix the stiffness and damping for position and zoom.
  const canvasCoords = spring(
    { x: 0, y: 0 },
    {
      stiffness: PAN_STIFFNESS,
      damping: PAN_DAMPING,
      precision: .0000000001
    }
  );
  const canvasZoom = spring(
    {s: 100},
    {
      stiffness: ZOOM_STIFFNESS,
      damping: ZOOM_DAMPING,
      precision: .0000000001
    })
    
  function pan(dx: number, dy:number) {
    canvasCoords.stiffness = PAN_STIFFNESS;
    $canvasOffset = {x: ($canvasOffset.x + dx), y: $canvasOffset.y + dy};
    canvasCoords.update(($canvasCoords) => ($canvasOffset));
  }
  function panTest(dx: number, dy:number) {
    canvasCoords.stiffness = ZOOM_STIFFNESS;
    $canvasOffset = {x: $canvasOffset.x + dx, y: $canvasOffset.y + dy}
    const promise = canvasCoords.update(($canvasCoords) => ($canvasOffset));
    promise.then(()=>{
      canvasCoords.stiffness = PAN_STIFFNESS
      console.log("promise solved")
    });
  }
  function zoom(ds: number) {
    $canvasScale = $canvasScale + (ds * $canvasScale * 0.1);
    canvasZoom.update(($canvasZoom) => ({s: $canvasScale}));
  }

  function canvasMouseDown(e: MouseEvent) {
  }
  function canvasMouseMove(e: MouseEvent) {
    switch(e.buttons){
      case MOUSE_PAN_BUTTON:
        pan(e.movementX, e.movementY);
        break;
    }
  }
  function canvasMouseWheel(e: WheelEvent){
    let scrollDirection = e.deltaY;
    let worldPositionBefore = screenToWorld(e.clientX, e.clientY);
    zoom((scrollDirection/-100)*SCROLL_ZOOM_MULTIPLIER);
    let worldPositionAfter = screenToWorld(e.clientX, e.clientY);
  
    panTest(
      (worldPositionAfter.x - worldPositionBefore.x)*$canvasScale, 
      (worldPositionAfter.y - worldPositionBefore.y)*$canvasScale
    )
    console.log($canvasScale, $canvasZoom)
  }
  
</script>

<div
  id="canvas"
  on:mousedown={canvasMouseDown}
  on:mousemove={canvasMouseMove}
  on:mousewheel={canvasMouseWheel}
>
  <div id="background" />

  <div
    id="contents"
    style="transform:
		translate({$canvasCoords.x}px,{$canvasCoords.y}px)scale({$canvasZoom.s},{$canvasZoom.s})"
  >
    <p>yo this is a test</p>
    <p>yo this is a test</p>
    <img
      class="selectable"
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
    transform-origin: top left;
    /* transform: translateX(var(--translateX)); */
    pointer-events: none;
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
