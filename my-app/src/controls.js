import {Scene,ExecuteCodeAction,ActionManager} from "@babylonjs/core";

var createScene = function (engine) {
    var scene = new Scene(engine);
    // Register key events
    var inputMap = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
        new ExecuteCodeAction(
            ActionManager.OnKeyDownTrigger,
            function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
            }
        )
    );
    scene.actionManager.registerAction(
        new ExecuteCodeAction(
            ActionManager.OnKeyUpTrigger,
            function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
            }
        )
    );

    return scene;
};

export default createScene;