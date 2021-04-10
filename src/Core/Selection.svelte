<script>
  export let translateX = 0.0;
  export let translateY = 0.0;
  export let scaleX = 1.0;
  export let scaleY = 1.0;
</script>

<svg
  id="selection"
  width={Math.max(6, scaleX)}
  height={Math.max(6, scaleY)}
  style="transform:translate({translateX}px, {translateY}px)"
>
  <rect id="selection-box" x="3" y="3" width={Math.max(3, scaleX - 6)} height={Math.max(3, scaleY - 6)} rx="0" />
</svg>

<style>
  #selection {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
  }
  #selection-box {
    fill: rgba(0, 183, 255, 0.295);
    stroke-width: 3;
    stroke: rgb(21, 189, 255);
  }
</style>
