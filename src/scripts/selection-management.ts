import { get } from "svelte/store";
import { canvasItems } from "../stores";

export function clearSelection() {
  for (let item of get(canvasItems).filter((item) => item.selected == true)) {
    item.selected = false; //TODO: Split element deselection into a separate function
  }
  canvasItems.update((u) => u);
}
