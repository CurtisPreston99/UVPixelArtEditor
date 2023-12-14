import { Stage, game, ColorLayer, BitmapText,level  } from "melonjs";
import DrawCanvas from "../renderables/draw_canvas";

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#202020"));

        game.world.addChild(new DrawCanvas(game.viewport.width / 2, 0,game.viewport.height/2,game.viewport.height/2,'a'))
        game.world.addChild(new DrawCanvas(0, 0,game.viewport.height/2,game.viewport.height/2,'a'))
    }
};

export default PlayScreen;
