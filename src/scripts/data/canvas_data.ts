import { Color } from "melonjs";
import { selection } from "./drawing-selection";

abstract class CanvasData{

    abstract getXSize():number;
    abstract getYSize():number;

    abstract getColor(x:number,y:number):Color;

    abstract setColor(x:number,y:number):void;

}

class CanvasDataUVBase extends CanvasData{
    ColoredPixels: Color[][] = [[]];
    size:number[];

    constructor(res:number[]) {
        super();
        this.size = res;
        this.ColoredPixels = [];
        for (let i = 0; i < this.size[0]; i++) {
            const row: Color[] = [];
            for (let j = 0; j < this.size[1]; j++) {
                row.push(new Color(255,255,255,0));
            }
            this.ColoredPixels.push(row);
        }
    }

    getXSize(){
        return this.size[0];
    }
    getYSize(){
        return this.size[1];
    }

    getColor(x:number,y:number){
        return this.ColoredPixels[x][y]
    }

    setColor(x:number,y:number){
        let c = selection.selectedColor;
        c.alpha = 1;
        this.ColoredPixels[x][y] = c;
    }
}


class CanvasDataSpriteMap extends CanvasData{
    lookupCords: [[[number|null,number]]];
    size:number[];
    lookupData:CanvasDataUVBase;

    constructor(res:number[], lookupData:CanvasDataUVBase) {
        super();
        this.lookupData = lookupData;
        this.size = res;
        let lookupCords = [];
        for (let i = 0; i < this.size[0]; i++) {
            const row:  number|null[][] = [];
            for (let j = 0; j < this.size[1]; j++) {
                row.push([null]);
            }
            lookupCords.push(row);
        }

        this.lookupCords = lookupCords as [[[number|null,number]]];;
        
    }
    getXSize(){
        return this.size[0];
    }
    getYSize(){
        return this.size[1];
    }

    getColor(x:number,y:number){
        if(this.lookupCords[x][y][0]){
            let cord = this.lookupCords[x][y] as [number,number];
            let color = this.lookupData.getColor(cord[0],cord[1])

            return color;
        }

        return new Color(0,0,0,0);
    }

    setColor(x:number,y:number){
        if(x > this.getXSize() || y > this.getYSize()){
            return
        }
        this.lookupCords[x][y] = selection.selectedUVpos as unknown as [number,number];
    }
}




export {CanvasData, CanvasDataUVBase, CanvasDataSpriteMap};