import { CanvasRenderer, Application, Entity, Pointer, Renderable, UIBaseElement, WebGLRenderer, input, World } from "melonjs";
import * as me from "melonjs";
import { string } from "melonjs/dist/types/utils/utils";
import { selection } from "../data/drawing-selection";
import { pointer } from "melonjs/dist/types/input/input";
import { CanvasData } from "../data/canvas_data";

class DrawCanvas extends UIBaseElement {

    pixelSizeX = 1;
    pixelSizeY = 1;
    drawing = false;
    scrollScaler = 0.1;
    ScreenCenterX = 0;
    ScreenCenterY = 0;

    canvasData:CanvasData;

    isDraging = false;
    dragingLastCords: number[] | null = null;


    lastClickUpadate: number[] | null = null;

    /**
     * constructor
     */
    constructor(x: number, y: number, width: number, height: number, label: any, canvasData: CanvasData) {
        // call the parent constructor
        super(x, y, width, height);

        this.canvasData = canvasData;
        // this.anchorPoint.set(0, 0);
        this.isClickable = true;

        this.pixelSizeX = this.width / this.canvasData.getXSize();
        this.pixelSizeY = this.height / this.canvasData.getYSize();
        console.log(this.pixelSizeX);

        this.ScreenCenterX = x+width/2;
        this.ScreenCenterY = y+height/2;

        input.registerPointerEvent('wheel', this, (e: { deltaY: number; }) => this.zoomPixels(e.deltaY));
        me.input.registerPointerEvent('pointerdown', this, (event: {
            x: number;
            y: number; button: number
        }) => {
            if (event.button === 2) { // Check if right mouse button is clicked
                this.isDraging = true;
                this.dragingLastCords = [event.x, event.y];
            }
        });

        me.input.registerPointerEvent('pointerup', this, (event: { button: number }) => {
            if (event.button === 2) { // Check if right mouse button is clicked
                this.isDraging = false;
                this.dragingLastCords = null;
            }
        });
    }

    zoomPixels(delta: number) {
        console.log(delta)
        let amountToZoom = 1
        if (delta > 0) {
            amountToZoom = 1 + this.scrollScaler;
        }
        if (delta < 0) {
            amountToZoom = 1 - this.scrollScaler;
        }

        this.pixelSizeX = this.pixelSizeX * amountToZoom;
        this.pixelSizeY = this.pixelSizeY * amountToZoom;

        this.width = this.pixelSizeX * this.canvasData.getXSize();
        this.height = this.pixelSizeY * this.canvasData.getYSize();

        this.forceRedraw()
    }

    onRelease() {
        console.log('onRelease')
        this.drawing = false;
        this.lastClickUpadate = null;
        return true
    }

    onClick(event: Pointer): boolean {
        this.drawing = true;
        console.log(event)

        let clickedPos = this.worldToArray(event.x, event.y)

        this.setColor(clickedPos[0], clickedPos[1])

        this.lastClickUpadate = clickedPos;

        return true;
    }

    onMove(event: Pointer) {
        console.log("onMove", event)

        return false
    }
    // onOver(event: Pointer){
    //     console.log("onOver",event)


    // }

    worldToArray(x: number, y: number) {
        let clickedLocalX = Math.floor((x - this.pos.x) / this.pixelSizeX);
        let clickedLocalY = Math.floor((y - this.pos.y) / this.pixelSizeY);

        return [clickedLocalX, clickedLocalY]
    }

    /**
     * update the entity
     */
    update(dt: number) {

        // selection.selectedColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

        //left click drawing
        if (this.drawing) {
            let clickedPos = this.worldToArray(input.pointer.centerX, input.pointer.centerY);

            this.setColor(clickedPos[0], clickedPos[1])

            if (this.lastClickUpadate) {
                console.log(clickedPos, this.lastClickUpadate);

                if (this.lastClickUpadate != clickedPos) {
                    let points = this.bresenhamAlgorithm(this.lastClickUpadate[0], this.lastClickUpadate[1], clickedPos[0], clickedPos[1])
                    console.log(points)

                    points.forEach(element => {
                        this.setColor(element.x, element.y);
                    });
                    this.forceRedraw()
                }

                this.lastClickUpadate = clickedPos;
            }
        }

        //right click drag
        if (this.isDraging) {
            if (this.dragingLastCords) {
                console.log(this.dragingLastCords)
                let currentPos = [input.pointer.centerX, input.pointer.centerY];
                let Dx = this.dragingLastCords[0] - currentPos[0];
                let Dy = this.dragingLastCords[1] - currentPos[1];

                if (Math.abs(Dx) > 1 && Math.abs(Dy) > 1) {
                    this.pos.x -= Dx;
                    this.pos.y -= Dy;
                    this.dragingLastCords = currentPos;
                    this.forceRedraw()
                }
            }
        }

        return super.update(dt);
    }

    setColor(x: number, y: number) {
        console.log(x,y)
        this.canvasData.setColor(x,y);
    }

    draw(renderer: CanvasRenderer | WebGLRenderer) {
        super.draw(renderer);

        renderer.setColor('#ffffff');
        renderer.strokeRect(0, 0 , this.width, this.height);

        for (let x = 0; x < this.canvasData.getXSize(); x++) {

            for (let y = 0; y < this.canvasData.getYSize(); y++) {
                const color = this.canvasData.getColor(x,y);
                renderer.setGlobalAlpha(1); // reset the alpha for some reason setting color dosent clear
                renderer.setColor(color);
                renderer.fillRect(0 + (x * this.pixelSizeX), 0 + (y * this.pixelSizeY), this.pixelSizeX, this.pixelSizeY);
            }
        }
    }

    forceRedraw() {
        // both of these need to be in this order for the drawn updates to show up
        this.parentApp.repaint();
        this.parentApp.draw();
    }

    bresenhamAlgorithm(startX: number, startY: number, endX: number, endY: number) {

        const deltaCol = Math.abs(endX - startX) // zero or positive number
        const deltaRow = Math.abs(endY - startY) // zero or positive number

        let pointX = startX
        let pointY = startY

        const horizontalStep = (startX < endX) ? 1 : -1

        const verticalStep = (startY < endY) ? 1 : -1

        const points = []

        let difference = deltaCol - deltaRow

        while (true) {

            const doubleDifference = 2 * difference // necessary to store this value

            if (doubleDifference > -deltaRow) { difference -= deltaRow; pointX += horizontalStep }
            if (doubleDifference < deltaCol) { difference += deltaCol; pointY += verticalStep }

            if ((pointX == endX) && (pointY == endY)) { break } // doesnt include the end point

            points.push({ "x": pointX, "y": pointY })
        }

        return points
    }
};

export default DrawCanvas;
