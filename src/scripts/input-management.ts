import { activeInput, mappings } from "../stores";

export const mouseButtonMap = ["leftMouse", "middleMouse", "rightMouse"];

export function pushInput(input: string, e?: InputEvent) {
  if (activeInput.includes(input)) {
    return;
  }
  activeInput.push(input);
  return;
}
export function spliceInput(input: string) {
  if (!activeInput.includes(input)) {
    return;
  }
  activeInput.splice(activeInput.indexOf(input), 1);
}

export function compareInput(operation: string, input: string[] = activeInput): boolean {
  let operationMappings = mappings.filter((element) => element.operation == operation);
  for (let mapping of operationMappings) {
    if (input.toString() == mapping.input.toString()) {
      return true;
    }
    for (let mapping of mappings.filter((element) => element.operation != operation)) {
      if (input.toString().includes(mapping.input.toString())) {
        return false;
      }
    }
    if (input.toString().includes(mapping.input.toString())) {
      return true;
    }
  }
}
export function preventDefault(input: string[], e: Event) {
  if (mappings.find((element) => element.input.toString() == activeInput.toString())) {
    try {
      e.preventDefault();
    } catch (error) {
      console.warn(
        'Error preventing default for input "',
        mappings.find((element) => element.input.toString() == activeInput.toString()).operation,
        '" this may be a bug, or may be fine',
        "\n",
        error
      );
    }
  }
}

export function shortcutDown(e: Event) {
  let shortcuts = mappings.filter((element) => element.operation.startsWith("shortcut"));
  for (let i = 0; i < shortcuts.length; i++) {
    if (shortcuts[i].input.toString() == activeInput.toString()) {
      try {
        shortcuts[i].onDown();
      } catch {
        console.error(activeInput);
      }
      preventDefault(activeInput, e);
    }
  }
}

export function shortcutUp(e: Event) {
  let shortcuts = mappings.filter((element) => element.operation.startsWith("shortcut"));
  for (let i = 0; i < shortcuts.length; i++) {
    if (shortcuts[i].input.toString() == activeInput.toString()) {
      shortcuts[i].onUp();
      preventDefault(activeInput, e);
    }
  }
}

//Processes key inputs to remove duplicate keys-- Watch for errors with toLowercase, may need to only apply it to certain key ranges
export function processKey(key: string) {
  let processedKey = key;
  processedKey = processedKey.toLowerCase();
  return processedKey;
}
