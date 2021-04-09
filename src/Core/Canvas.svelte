<script lang="ts">
  import { spring } from "svelte/motion";
  import { screenToWorld, Vector, squareNormalization } from "../scripts/helpers";
  import {  canvasTargetTranslation, canvasTargetScale, canvasCurrentScale } from "../stores.js";
  import Selection from "./Selection.svelte"
  const PAN_STIFFNESS = 1;
  const PAN_DAMPING = 1;
  const ZOOM_STIFFNESS = .2;
  const ZOOM_DAMPING = 1;
  const MOUSE_PAN_BUTTON = 4;
  const MOUSE_SELECT_BUTTON = 1;
  const KEY_PAN_AMMOUNT = 100;
  const KEY_PAN_LEFT = "ArrowLeft";
  const KEY_PAN_RIGHT = "ArrowRight";
  const KEY_PAN_UP = "ArrowUp";
  const KEY_PAN_DOWN = "ArrowDown";

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

  //Send to the Store the combined spring target values for world space calculations.
  $: $canvasTargetTranslation = Vector.addEach(panTarget, {x: zoomTarget.x, y: zoomTarget.y})
  $: $canvasTargetScale = zoomTarget.s

  //Define the target and spring for panning
  let panTarget = {x: 0, y: 0}
  const panSpring = spring(
    { x: 0, y: 0 },
    {
      stiffness: PAN_STIFFNESS,
      damping: PAN_DAMPING,
      precision: .0000000000001
    }
  );

  //Define the target and spring for zooming (including offset in the target)
  let zoomTarget = {x: 0, y: 0, s: 1}
  const zoomSpring = spring(
    { x:0, y:0, s: 1},
    {
      stiffness: ZOOM_STIFFNESS,
      damping: ZOOM_DAMPING,
      precision: .000000000001
    })

  //Define the combined spring coordinates to be used by the canvas component's transform property
  let canvasTranslation = {x: 0, y: 0}
  $: canvasTranslation = {x: $panSpring.x + $zoomSpring.x, y: $panSpring.y + $zoomSpring.y}
  $: canvasZoom = $zoomSpring.s;
  $: $canvasCurrentScale = canvasZoom;
  
  function pan(dx: number, dy:number) {
    panTarget.x = panTarget.x + dx
    panTarget.y = panTarget.y + dy
    panSpring.update(($panSpring) => (panTarget));
  }
  function offsetZoom(dx: number, dy:number) {
    zoomTarget.x = zoomTarget.x + dx
    zoomTarget.y = zoomTarget.y + dy
    zoomSpring.update(($zoomSpring) => (zoomTarget))
  }
  function zoom(ds: number) {
    zoomTarget.s = zoomTarget.s + (ds * zoomTarget.s * 0.1)
    zoomSpring.update(($zoomSpring) => (zoomTarget));
  }

  //TODO: move selection visuals outside of world space, 
  //also look into how to avoid snapping at high zoom levels for future features
  let selectionStart = {x: 0, y: 0}
  let selectionScale = {x: 1000, y: 1000}
  let selectionPosition = {x: 0, y: 0}
  function startSelection(x:number, y:number){
    selectionStart = screenToWorld(x, y)
  }
  function dragSelection(cx:number, cy:number){
    let currentToWorld = screenToWorld(cx, cy)
    let square = squareNormalization(selectionStart, currentToWorld)
    selectionScale = {x: square.width, y: square.height};
    selectionPosition = {x: square.x, y: square.y};
  }

  /*    Input Handling    */
  function canvasMouseDown(e: MouseEvent) {
    switch(e.buttons) {
      case 1:
        startSelection(e.clientX, e.clientY)
        break;
    }
  }
  function canvasMouseMove(e: MouseEvent) {
    switch(e.buttons){
      case MOUSE_PAN_BUTTON:
        pan(e.movementX, e.movementY);
        break;
      case MOUSE_SELECT_BUTTON:
        dragSelection(e.clientX, e.clientY)
    }
  }
  function canvasMouseWheel(e: WheelEvent){
    let scrollDirection = e.deltaY;
    let worldPositionBefore = screenToWorld(e.clientX, e.clientY);
    zoom((scrollDirection/-100)*SCROLL_ZOOM_MULTIPLIER);
    let worldPositionAfter = screenToWorld(e.clientX, e.clientY, null, null, zoomTarget.s);
  
    offsetZoom(
      (worldPositionAfter.x - worldPositionBefore.x)*zoomTarget.s, 
      (worldPositionAfter.y - worldPositionBefore.y)*zoomTarget.s
    )
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
		translate({canvasTranslation.x}px,{canvasTranslation.y}px)scale({canvasZoom},{canvasZoom})"
  >
    <p>yo this is a test</p>
    <p>yo this is a test</p>
    <Selection translateX={selectionPosition.x} translateY={selectionPosition.y} scaleX={selectionScale.x} scaleY={selectionScale.y}/>
    <!--<img
      class="selectable"
      src="https://pbs.twimg.com/profile_images/1121395911849062400/7exmJEg4.png"
      alt="test"
    /> -->
    <img
      class="selectable"
      src="https://media.discordapp.net/attachments/746592405834170400/829981789388800000/image0.jpg"
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
