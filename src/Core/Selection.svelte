<script lang="ts">
  let position = { x: 0, y: 0 };
  let scale = { x: 100, y: 50 };
  let visible = true;
  let visibility = "hidden";
  $: if (visible) {
    visibility = "visible";
  } else {
    visibility = "hidden";
  }
</script>

<div id="selection" style="--visibility:{visibility};">
  <svg>
    <rect x={position.x} y={position.y} width="{scale.x}px" height="{scale.y}px" />
  </svg>
</div>

<style>
  #selection {
    left: 0;
    top: 0;
    position: absolute;
    background-color: black;
    visibility: var(--visibility);
  }
</style>
