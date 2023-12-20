import { CanvasRenderer, Pointer, UIBaseElement, WebGLRenderer, input } from "melonjs";
import { CanvasDataUVBase } from "../data/canvas_data";
import DrawCanvas from "./draw_canvas";
import { selection } from "../data/drawing-selection";

class UvMapSelector extends DrawCanvas {

    downKeyAction = "down";
    upKeyAction = "up";
    leftKeyAction = "left";
    rightKeyAction = "right";

    downKeyActionPressed = false;
    upKeyActionPressed = false;
    leftKeyActionPressed = false;
    rightKeyActionPressed = false;


    constructor(x: number, y: number, width: number, height: number, label: any, canvasData: CanvasDataUVBase) {
        super(x, y, width, height, label, canvasData);

        input.bindKey(input.KEY.DOWN, this.downKeyAction)
        input.bindKey(input.KEY.UP, this.upKeyAction)
        input.bindKey(input.KEY.LEFT, this.leftKeyAction)
        input.bindKey(input.KEY.RIGHT, this.rightKeyAction)
    }

    override onClick(event: Pointer): boolean {
        this.drawing = false;
        let clickedPos = this.worldToArray(event.x, event.y)
        selection.selectedUVpos = clickedPos;
        return true;
    }

    override update(dt: number): boolean {
        if (input.isKeyPressed(this.leftKeyAction)) {
            if(!this.leftKeyActionPressed){
                selection.selectedUVpos[0] -= 1;
                this.leftKeyActionPressed = true;
                this.forceRedraw();
            }
        }else{
            this.leftKeyActionPressed = false;
        }

        if (input.isKeyPressed(this.rightKeyAction)) {
            if(!this.rightKeyActionPressed){
                selection.selectedUVpos[0] += 1;
                this.rightKeyActionPressed = true;
                this.forceRedraw();
            }
        }else{
            this.rightKeyActionPressed = false;
        }

        if (input.isKeyPressed(this.upKeyAction)) {
            if(!this.upKeyActionPressed){
                selection.selectedUVpos[1] -= 1;
                this.upKeyActionPressed = true;
                this.forceRedraw();
            }
        }else{
            this.upKeyActionPressed = false;
        }

        if (input.isKeyPressed(this.downKeyAction)) {
            if(!this.downKeyActionPressed){
                selection.selectedUVpos[1] += 1;
                this.downKeyActionPressed = true;
                this.forceRedraw();
            }
        }else{
            this.downKeyActionPressed = false;
        }

        return super.update(dt);
    }

    override draw(renderer: CanvasRenderer | WebGLRenderer) {
        super.draw(renderer);
        let selectedPos = selection.selectedUVpos;
        if (selectedPos.length > 0) {
            renderer.setGlobalAlpha(1); // reset the alpha for some reason setting color dosent clear
            renderer.setColor("#ffffff");
            renderer.strokeRect(0 + (selectedPos[0] * this.pixelSizeX), 0 + (selectedPos[1] * this.pixelSizeY), this.pixelSizeX, this.pixelSizeY);
        }
    }
}

export default UvMapSelector;