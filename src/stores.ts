import { writable } from "svelte/store";
import CanvasImage from "./core/CanvasItems/CanvasImage.svelte";

export const canvasTargetTranslation = writable({ x: 0, y: 0 });
export const canvasTargetScale = writable(1);
export const canvasCurrentScale = writable(1);
export const canvasCurrentTranslation = writable({ x: 0, y: 0 });

class CanvasItem {
  id = ""; //this will be randomly generated on server or client side
  position = { x: 0, y: 0 };
  scale = { x: 10, y: 10 };
  component = CanvasImage;
  selected = false;
  constructor(id: string, position: { x: number; y: number }, scale: { x: number; y: number }, component: any) {
    this.id = id;
    this.position = position;
    this.scale = scale;
    this.component = component;
  }
}

export const canvasItems = writable([
  new CanvasItem("asdfsjakldfldsa", { x: 0, y: 0 }, { x: 100, y: 100 }, CanvasImage),
  new CanvasItem("asdfsjakldflddsaf", { x: 200, y: 200 }, { x: 300, y: 300 }, CanvasImage),
  new CanvasItem("asdfsjakldfldsa", { x: 300, y: 0 }, { x: 100, y: 100 }, CanvasImage),
  new CanvasItem("asdfsjakldfldsa", { x: 400, y: 0 }, { x: 100, y: 100 }, CanvasImage),
  new CanvasItem("asdfsjakldfldsa", { x: 500, y: 0 }, { x: 100, y: 100 }, CanvasImage),
]);

/*-----   Input System   -----*/

export let activeInput: string[] = [];

export const operations = {
  ITEM: {
    SELECT: "item.select",
    MOVE: "item.move",
  },
  CANVAS: {
    BOX_SELECT: "canvas.box_select",
    BOX_SELECT_ADDITIVE: "canvas.box_select_additive",
    PAN: "canvas.pan",
    ZOOM_IN: "canvas.zoom_in",
    ZOOM_OUT: "canvas.zoom_out",
  },
  SHORTCUT: {
    SAVE: "shortcut.save",
    TEST: "shortcut.test",
  },
};

export class Mapping {
  operation: string;
  input: string[] = [];
  onDown: Function;
  onUp: Function;
  constructor(operation: string, input: string[]) {
    this.operation = operation;
    this.input = input;
  }
  setDown(func: Function): Mapping {
    this.onDown = func;
    return this;
  }
  setUp(func: Function): Mapping {
    this.onUp = func;
    return this;
  }
}

export let mappings: Mapping[] = [
  new Mapping(operations.SHORTCUT.TEST, ["alt", "1"])
    .setDown(() => console.log("test"))
    .setUp(() => console.log("test 2")),
  new Mapping(operations.SHORTCUT.SAVE, ["alt", "2"]).setDown(() => console.log("Test 2")).setUp(() => null),
  new Mapping(operations.CANVAS.BOX_SELECT, ["leftMouse"]),
  new Mapping(operations.CANVAS.BOX_SELECT_ADDITIVE, ["shift", "leftMouse"]),
  new Mapping(operations.CANVAS.PAN, ["alt", "rightMouse"]),
  new Mapping(operations.CANVAS.PAN, ["middleMouse"]),
  new Mapping(operations.CANVAS.ZOOM_IN, ["scrollUp"]),
  new Mapping(operations.CANVAS.ZOOM_OUT, ["scrollDown"]),
  new Mapping(operations.ITEM.MOVE, ["leftMouse"]),
  new Mapping(operations.ITEM.SELECT, ["leftMouse"]),
];
