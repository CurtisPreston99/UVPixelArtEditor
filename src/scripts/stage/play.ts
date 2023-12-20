import { Stage, game, ColorLayer, BitmapText,level, Color  } from "melonjs";
import DrawCanvas from "../renderables/draw_canvas";
import { CanvasDataSpriteMap, CanvasDataUVBase } from "../data/canvas_data";
import UvMapSelector from "../renderables/uv_map_selector";
import { selection } from "../data/drawing-selection";

class PlayScreen extends Stage {
    res = [32,64]
    resUv = [64,64]

    /**
     *  action to perform on state change
     */
    onResetEvent() {

        // add a gray background to the default Stage
        let baseDataUv = new CanvasDataUVBase(this.resUv);
        let r = 0;
        let g = 255;
        let dH = (255/baseDataUv.getXSize() );
        console.log(dH);
        for (let x = 0; x < baseDataUv.getXSize(); x++) {
            r+=dH;
            for (let y = 0; y < baseDataUv.getYSize(); y++) {
                g-=dH;
                selection.selectedColor = new Color().setColor(r,g,1)
                baseDataUv.setColor(x,y)
            }
        }

        let drawingData = new CanvasDataSpriteMap(this.res,baseDataUv);

        game.world.addChild(new ColorLayer("background", "#202020"));

        game.world.addChild(new UvMapSelector(0,0,400,400,"",baseDataUv))
        game.world.addChild(new DrawCanvas(game.viewport.width / 2, 0,320,640,'a',drawingData))
        // game.world.addChild(new DrawCanvas(0, 0,game.viewport.height/2,game.viewport.height/2,'a'))
    }
};

export default PlayScreen;
