import { useEffect, useRef } from "react";
import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import testControls from "./controls";

export default function Game(){
  const reactCanvas = useRef(null);

  let box;
  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 1;

    // Our built-in 'ground' shape.
    MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    var inputMap=testControls(scene);

    scene.onBeforeRenderObservable.add(() => {
      if (inputMap["w"] || inputMap["ArrowUp"]) {
          camera.position.z += 0.1;
      }
      if (inputMap["s"] || inputMap["ArrowDown"]) {
          camera.position.z -= 0.1;
      }
      if (inputMap["a"] || inputMap["ArrowLeft"]) {
          camera.position.x -= 0.1;
      }
      if (inputMap["d"] || inputMap["ArrowRight"]) {
          camera.position.x += 0.1;
      }
  });

  engine.runRenderLoop(() => {
    box.rotation.x += 0.01;
    scene.render();
  });

  const resize = () => {
    engine.resize();
  };

  if (window) {
    window.addEventListener("resize", resize);
  }

  return () => {
    engine.dispose();

    if (window) {
      window.removeEventListener("resize", resize);
    }
  };
}, []);

  return <canvas ref={reactCanvas} style={{width: "100vw", height: "100vh"}}/>;
};
