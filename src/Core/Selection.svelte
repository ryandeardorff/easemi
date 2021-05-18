<script lang="ts">
  import { worldToScreen, screenToWorld, Vector } from "../scripts/helpers";
  import { compareInput, mouseButtonMap, pushInput } from "../scripts/input-management";

  import { canvasItems, CanvasItem, canvasCurrentScale, canvasCurrentTranslation, operations } from "../stores";
  let position = { x: 0, y: 0 };
  let scale = { x: 100, y: 50 };
  let initialScale = { x: 100, y: 100 };
  let visible = true;
  let visibility = "hidden";
  let bounds = { left: 0, right: 0, top: 0, bottom: 0 };
  $: if (visible) {
    visibility = "visible";
  } else {
    visibility = "hidden";
  }
  $: currentCanvasItems = $canvasItems;
  $: selectedItems = currentCanvasItems.filter((element) => element.selected);
  $: if (selectedItems.length > 0) {
    visible = true;
  } else {
    visible = false;
  }

  $: if (visible) {
    let left = selectedItems.sort((a, b) => a.position.x - b.position.x)[0].position.x;
    let rightSort = selectedItems.sort((a, b) => -a.position.x - a.scale.x + (b.position.x + b.scale.x));
    let right = rightSort[0].position.x + rightSort[0].scale.x;
    let top = selectedItems.sort((a, b) => a.position.y - b.position.y)[0].position.y;
    let bottomSort = selectedItems.sort((a, b) => -a.position.y - a.scale.y + b.position.y + b.scale.y);
    let bottom = bottomSort[0].position.y + bottomSort[0].scale.y;
    bounds = { left: left, right: right, top: top, bottom: bottom };
  }

  $: if (visible) {
    position = worldToScreen(
      bounds.left,
      bounds.top,
      $canvasCurrentTranslation.x,
      $canvasCurrentTranslation.y,
      $canvasCurrentScale
    );
  }
  $: if (visible) {
    let bottomRight = worldToScreen(bounds.right, bounds.bottom);
    let topLeft = worldToScreen(bounds.left, bounds.top);
    let difference = { x: bottomRight.x - topLeft.x, y: bottomRight.y - topLeft.y };

    scale = Vector.multiplyBoth(difference, $canvasCurrentScale);
  }

  const positionMultiplier = {
    TOP_LEFT: { x: 1, y: 1 },
    TOP_RIGHT: { x: 0, y: 1 },
    BOTTOM_LEFT: { x: 1, y: 0 },
    BOTTOM_RIGHT: { x: 0, y: 0 },
  };
  const scaleMultiplier = {
    TOP_LEFT: { x: -1, y: -1 },
    TOP_RIGHT: { x: 1, y: -1 },
    BOTTOM_LEFT: { x: -1, y: 1 },
    BOTTOM_RIGHT: { x: 1, y: 1 },
  };

  const scalePoints = {
    TOP_LEFT: { positionMultiplier: positionMultiplier.TOP_LEFT, scaleMultiplier: scaleMultiplier.TOP_LEFT },
    TOP_RIGHT: { positionMultiplier: positionMultiplier.TOP_RIGHT, scaleMultiplier: scaleMultiplier.TOP_RIGHT },
    BOTTOM_LEFT: { positionMultiplier: positionMultiplier.BOTTOM_LEFT, scaleMultiplier: scaleMultiplier.BOTTOM_LEFT },
    BOTTOM_RIGHT: {
      positionMultiplier: positionMultiplier.BOTTOM_RIGHT,
      scaleMultiplier: scaleMultiplier.BOTTOM_RIGHT,
    },
  };

  let scaling = false;
  let scalePoint = null;

  function windowMouseMove(e: MouseEvent) {
    if (compareInput(operations.ITEM.MOVE) && scaling && scalePoint != null) {
      let worldMovement = Vector.multiplyBoth({ x: e.movementX, y: e.movementY }, 1 / $canvasCurrentScale);
      let positionChange = Vector.multiplyEach(worldMovement, scalePoint.positionMultiplier);
      let scaleChange = Vector.multiplyEach(worldMovement, scalePoint.scaleMultiplier);
      for (let item of selectedItems) {
        let worldSelectScale = screenToWorld(scale.x, scale.y);
        let selectionPositionProportion = Vector.divideEach(item.position, worldSelectScale);
        let selectionScaleProportion = Vector.divideEach(item.scale, worldSelectScale);
        console.log(selectionScaleProportion, item.scale, worldSelectScale);
        let proportionalPosition = positionChange;
        let proportionalScale = Vector.multiplyEach(scaleChange, selectionScaleProportion);
        item.position = Vector.addEach(item.position, proportionalPosition);
        item.scale = Vector.addEach(item.scale, proportionalScale);
      }
      canvasItems.update((u) => u);
    }
  }

  function windowMouseUp(e: MouseEvent) {
    if (!compareInput(operations.ITEM.MOVE)) {
      scaling = false;
      scalePoint = null;
    }
  }

  function scaleMouseDown(e: MouseEvent, point: any = scalePoints.TOP_LEFT) {
    pushInput(mouseButtonMap[e.button]);
    if (compareInput(operations.ITEM.MOVE)) {
      initialScale = screenToWorld(scale.x, scale.y);
      scaling = true;
      scalePoint = point;
    }
  }
</script>

<svelte:window on:mousemove={windowMouseMove} on:mouseup={windowMouseUp} />
<div id="selection" style="--visibility:{visibility};">
  <svg>
    <line x1={position.x} y1={position.y - 1} x2={position.x + scale.x} y2={position.y - 1} />
    <rect x={position.x} y={position.y} width="{scale.x}px" height="{scale.y}px" rx={40 * $canvasCurrentScale} />
    <circle on:mousedown={(e) => scaleMouseDown(e, scalePoints.TOP_LEFT)} cx={position.x} cy={position.y} r={8} />
    <circle
      on:mousedown={(e) => scaleMouseDown(e, scalePoints.TOP_RIGHT)}
      cx={position.x + scale.x}
      cy={position.y}
      r={8}
    />
    <circle
      on:mousedown={(e) => scaleMouseDown(e, scalePoints.BOTTOM_RIGHT)}
      cx={position.x + scale.x}
      cy={position.y + scale.y}
      r={8}
    />
    <circle
      on:mousedown={(e) => scaleMouseDown(e, scalePoints.BOTTOM_LEFT)}
      cx={position.x}
      cy={position.y + scale.y}
      r={8}
    />
  </svg>
</div>

<style>
  #selection {
    z-index: 10;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    visibility: var(--visibility);
  }
  svg {
    width: 100%;
    height: 100%;
  }
  rect {
    fill: none;
    stroke: blue;
    stroke-width: 3px;
  }
  circle {
    fill: blue;
    pointer-events: all;
  }
</style>
