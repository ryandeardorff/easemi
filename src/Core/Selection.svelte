<script>
  export let translateX = 0;
  export let translateY = 0;
  export let scaleX = 1;
  export let scaleY = 1;
</script>

<div>
  <div
    id="selection"
    class="selection"
    style="--translateX: {translateX}; --translateY: {translateY}; --scaleX: {scaleX}; --scaleY: {scaleY};"
  />
</div>

<style>
  #selection {
    background-color: lightskyblue;
    position: absolute;
    width: 1px;
    height: 1px;
    transform-origin: top left;
    transform: matrix(
      var(--scaleX),
      0,
      0,
      var(--scaleY),
      var(--translateX),
      var(--translateY)
    );
    pointer-events: none;
  }
</style>
