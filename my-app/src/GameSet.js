import { useEffect, useRef } from "react";
import { Scene, Engine, UniversalCamera, Vector3, HemisphericLight, MeshBuilder,Axis } from "@babylonjs/core";
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
    const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas,true);

    camera.speed = 0.2;

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


      if (inputMap["w"]) {
        camera.position.addInPlace(camera.getDirection(Axis.Z).scale(0.1));
      }
      if (inputMap["s"]) {
        camera.position.addInPlace(camera.getDirection(Axis.Z).scale(-0.1));
      }
      if (inputMap["a"]) {
        camera.position.addInPlace(camera.getDirection(Axis.X).scale(-0.1));
      }
      if (inputMap["d"]) {
        camera.position.addInPlace(camera.getDirection(Axis.X).scale(0.1));
      }
      if (inputMap[" "]){
        camera.position.y += 0.1;
      }
      if (inputMap["Shift"]){
        camera.position.y -= 0.1;
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
