import { CanvasRenderer, Application, Entity, Pointer, Renderable, UIBaseElement, WebGLRenderer, input, World } from "melonjs";
import { string } from "melonjs/dist/types/utils/utils";

class DrawCanvas extends UIBaseElement {

    ColoredPixels: string[][] = [[]];
    sizeX = 32;
    sizeY = 64;
    pixelSizeX = 1;
    pixelSizeY = 1;
    drawing = false;

    lastClickUpadate: number[] | null = null;

    /**
     * constructor
     */
    constructor(x: number, y: number, width: number, height: number, label: any) {
        // call the parent constructor
        super(x, y, width, height);
        // this.anchorPoint.set(0, 0);
        this.isClickable = true;
        // this.isHoldable = true;
        // this.isDraggable = true;

        this.ColoredPixels = []
        this.pixelSizeX = this.width / this.sizeX;
        this.pixelSizeY = this.height / this.sizeY;
        console.log(this.pixelSizeX);
        for (let i = 0; i < this.sizeX; i++) {
            const row: string[] = [];
            for (let j = 0; j < this.sizeY; j++) {
                row.push('#ffffff');
            }
            this.ColoredPixels.push(row);
        }

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

        this.ColoredPixels[clickedPos[0]][clickedPos[1]] = '#000000'
        this.lastClickUpadate = clickedPos;

        // input.registerPointerEvent('pointermove', this, (e: any) => this.pointerMove(e));
        // input.bindPointer
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
        if (this.drawing) {
            let clickedPos = this.worldToArray(input.pointer.centerX, input.pointer.centerY);

            this.ColoredPixels[clickedPos[0]][clickedPos[1]] = '#000000'

            if (this.lastClickUpadate) {
                console.log(clickedPos,this.lastClickUpadate);

                if(this.lastClickUpadate!=clickedPos){
                    let points = this.bresenhamAlgorithm(this.lastClickUpadate[0],this.lastClickUpadate[1], clickedPos[0], clickedPos[1])
                    console.log(points)
    
                    points.forEach(element => {
                        this.ColoredPixels[element.x][element.y] = '#000000'
                    });
                }

                this.lastClickUpadate = clickedPos;

            }


            //todo draw a line inbetweent he two points
            // both of these need to be in this order for the drawn updates to show up
            this.parentApp.repaint();
            this.parentApp.draw();
        }
        // change body force based on inputs
        //....
        // call the parent method
        return super.update(dt);
    }

    /**
      * colision handler
      * (called when colliding with other objects)
      */
    onCollision(response: any, other: any) {
        // Make all other objects solid
        return true;
    }

    draw(renderer: CanvasRenderer | WebGLRenderer) {
        renderer.setColor('#ffffff')

        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height)

        for (let x = 0; x < this.ColoredPixels.length; x++) {
            const xRow = this.ColoredPixels[x];

            for (let y = 0; y < xRow.length; y++) {
                const color = xRow[y];
                renderer.setColor(color);
                renderer.fillRect(this.pos.x + (x * this.pixelSizeX), this.pos.y + (y * this.pixelSizeY), this.pixelSizeX, this.pixelSizeY);
            }

        }

        super.draw(renderer);
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
