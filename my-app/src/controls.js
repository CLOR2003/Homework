import {ExecuteCodeAction,ActionManager} from "@babylonjs/core";

var testControls = function (scene) {
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

    return inputMap;
};

export default testControls;