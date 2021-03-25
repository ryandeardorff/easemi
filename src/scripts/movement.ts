import { screenToWorld, worldToScreen} from "./helpers";

export function pannable(node) {
    let x: number;
    let y: number;

    function handleMouseDown(event) {
        let conversion = screenToWorld(event.clientX, event.clientY);
        x = conversion.x;
        y = conversion.y;

        node.dispatchEvent(new CustomEvent('panstart', {
            detail: {x,y}
        }))
    }
}