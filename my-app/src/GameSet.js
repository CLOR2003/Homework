import { useEffect, useRef } from "react";
import { Scene, Engine, UniversalCamera, Vector3, HemisphericLight, MeshBuilder,Axis,DynamicTexture,StandardMaterial } from "@babylonjs/core";
import testControls from "./controls";

export default function Game(){
  const reactCanvas = useRef(null);

  let box;
  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas,{antialias:true});
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas,true);

    camera.speed = 0.2;

    canvas.addEventListener("click", () => {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
      }
    }, false);

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

    const textureSize = 256;
    const dynamicTexture = new DynamicTexture("dynamicTexture", textureSize, scene, false);
    const textureContext = dynamicTexture.getContext();
    
    // Draw the crosshair on the DynamicTexture
    const crosshairSize = 20;
    const crosshairColor = "red";
    textureContext.fillStyle = crosshairColor;
    textureContext.beginPath();
    textureContext.arc(textureSize / 2, textureSize / 2, crosshairSize / 2, 0, 2 * Math.PI);
    textureContext.fill();
    dynamicTexture.update();
    
    // Create a plane to display the crosshair
    const crosshairPlane = MeshBuilder.CreatePlane("crosshairPlane", { size: 0.02 }, scene);
    const crosshairMaterial = new StandardMaterial("crosshairMaterial", scene);
    crosshairMaterial.diffuseTexture = dynamicTexture;
    crosshairMaterial.useAlphaFromDiffuseTexture = true;

    crosshairPlane.material = crosshairMaterial;
    
    // Position the crosshair plane in front of the camera
    crosshairPlane.position = new Vector3(0, 0, 2);
    crosshairPlane.parent = camera;

    crosshairPlane.renderingGroupId = 1;
    
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
