<script lang="ts">
  import { worldToScreen, screenToWorld, Vector } from "../scripts/helpers";

  import { canvasItems, CanvasItem } from "../stores";
  let position = { x: 0, y: 0 };
  let scale = { x: 100, y: 50 };
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
    position = worldToScreen(bounds.left, bounds.top);
  }
  $: if (visible) {
    scale = worldToScreen(Vector.subtractEach({ x: bounds.right, y: bounds.bottom }, position));
  }
</script>

<div id="selection" style="--visibility:{visibility};">
  <svg width="100000" height="100000">
    <rect x={position.x} y={position.y} width="{scale.x}px" height="{scale.y}px" />
  </svg>
</div>

<style>
  #selection {
    left: 0;
    top: 0;
    position: absolute;
    visibility: var(--visibility);
  }
</style>
