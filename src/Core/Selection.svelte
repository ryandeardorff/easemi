<script>
  export let translateX = 0;
  export let translateY = 0;
  export let scaleX = 1.0;
  export let scaleY = 1.0;
</script>

<svg id="selection" width="{scaleX}" height="{scaleY}" style="transform:translate({translateX}px, {translateY}px)">
    <rect id="selection-box" x="3" y="3" width="{scaleX-6}" height="{scaleY-6}" rx="0"/>
 </svg>

<style>
  #selection {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
  }
  #selection-box{
    fill: rgba(0, 183, 255, 0.295);
    stroke-width: 3;
    stroke: rgb(21, 189, 255);
  }
</style>
