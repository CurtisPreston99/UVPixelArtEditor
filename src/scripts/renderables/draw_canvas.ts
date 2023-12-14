import { CanvasRenderer,Application, Entity, Pointer, Renderable, UIBaseElement, WebGLRenderer, input, World } from "melonjs";
import { string } from "melonjs/dist/types/utils/utils";

class DrawCanvas extends UIBaseElement {

    ColoredPixels: string[][] = [[]];
    sizeX = 32;
    sizeY = 32;
    pixelSize = 1;
    drawing = false;

    lastUpadate: number[]|null = null;

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
        this.pixelSize = this.width / this.sizeX;
        console.log(this.pixelSize);
        for (let i = 0; i < this.sizeX; i++) {
            const row: string[] = [];
            for (let j = 0; j < this.sizeY; j++) {
                row.push('#ffffff');
            }
            this.ColoredPixels.push(row);
        }

    }

    onRelease(){
        console.log('onRelease')
        this.drawing = false;
        this.lastUpadate = null;
        return true
    }

    onClick(event: Pointer): boolean {
        this.drawing = true;
        console.log(event)
        let clickedLocalX = Math.floor((event.x - this.pos.x)/this.pixelSize);
        let clickedLocalY = Math.floor((event.y - this.pos.y)/this.pixelSize);

        let clickedPos = this.worldToArray(event.x,event.y)
        console.log(clickedLocalX, ":", clickedLocalY)

        this.ColoredPixels[clickedPos[0]][clickedPos[1]] = '#000000'
        this.lastUpadate = clickedPos;

        // input.registerPointerEvent('pointermove', this, (e: any) => this.pointerMove(e));
        // input.bindPointer
        return true;
    }

    onMove(event: Pointer){
        console.log("onMove",event)

        return false
    }
    // onOver(event: Pointer){
    //     console.log("onOver",event)


    // }

    worldToArray(x:number,y:number){
        let clickedLocalX = Math.floor((x - this.pos.x)/this.pixelSize);
        let clickedLocalY = Math.floor((y - this.pos.y)/this.pixelSize);

        return [clickedLocalX,clickedLocalY]
    }

    /**
     * update the entity
     */
    update(dt: number) {
        console.log(this.lastUpadate);
        if(this.drawing){
            let mousePos = input.globalToLocal(input.pointer.centerX,input.pointer.centerY);
            let clickedPos = this.worldToArray(input.pointer.centerX,input.pointer.centerY);
            
            this.ColoredPixels[clickedPos[0]][clickedPos[1]] = '#000000'
            
            //todo draw a line inbetweent he two points
            this.lastUpadate = clickedPos;
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
                renderer.fillRect(this.pos.x + (x *this.pixelSize), this.pos.y + (y*this.pixelSize), this.pixelSize, this.pixelSize);
            }

        }

        super.draw(renderer);
    }
};

export default DrawCanvas;
