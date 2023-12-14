import { audio, loader, state, device, video, plugin, pool, game, timer } from "melonjs";
import TitleScreen from "./scripts/stage/title.js";
import PlayScreen from "./scripts/stage/play.js";
import PlayerEntity from "./scripts/renderables/player.js";

import DataManifest from "./manifest.js";
import "./index.scss"
import DrawCanvas from "./scripts/renderables/draw_canvas.js";

device.onReady(() => {

    // initialize the display canvas once the device/browser is ready
    if (!video.init(1280, 720, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Initialize the audio.
    audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    loader.crossOrigin = "anonymous";

    // initialize the debug plugin in development mode.
    if (process.env.NODE_ENV === 'development') {
        import("@melonjs/debug-plugin").then((debugPlugin) => {
            // automatically register the debug panel
           plugin.register(debugPlugin.DebugPanelPlugin, "debugPanel");
        });
    }

    // set and load all resources.
    loader.preload(DataManifest, function() {
        // set the user defined game stages
        state.set(state.MENU, new TitleScreen());
        state.set(state.PLAY, new PlayScreen());
        
        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);
        pool.register("drawCanvas", DrawCanvas);

        // Start the game.
        state.change(state.PLAY, false);
        // state.change(state.MENU, true);
    });

    timer.maxfps = 120;
    game.world.fps = 120;
    game.updateFrameRate();

});
