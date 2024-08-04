import { useEffect, useRef } from "react";
import { Scene, Engine, UniversalCamera, Vector3, HemisphericLight, MeshBuilder,Axis,DynamicTexture,StandardMaterial,
  Ray,Color3} from "@babylonjs/core";
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

    var groundSize = 20;
    var cubeSize = 1;
    const cubes = [];

    for (var i = -groundSize / 2; i < groundSize / 2; i++) {
      for (var j = -groundSize / 2; j < groundSize / 2; j++) {
          var cube = MeshBuilder.CreateBox("cube", { size: cubeSize }, scene);
          cube.position.x = i * cubeSize;
          cube.position.z = j * cubeSize;
          cube.checkCollisions = true;
          cubes.push(cube);
      }
  }

    var inputMap=testControls(scene);

    const defaultMaterial = new StandardMaterial('defaultMaterial', scene);
    defaultMaterial.diffuseColor = new Color3(1, 1, 1);

    const highlightMaterial = new StandardMaterial('highlightMaterial', scene);
    highlightMaterial.diffuseColor = new Color3(1, 0, 0);

    const ray = new Ray(new Vector3(), new Vector3(),8);

    let highlightedCube = null;
    
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
      // Update the ray
      const origin = camera.position.clone();
      const forward = camera.getForwardRay().direction.clone();
      ray.origin = origin;
      ray.direction = forward;

      // Intersect the ray with the cubes
      const pickInfo = scene.pickWithRay(ray);
      if (pickInfo.hit && pickInfo.pickedMesh) {
        if (highlightedCube !== pickInfo.pickedMesh) {
          if (highlightedCube) {
              highlightedCube.material = defaultMaterial;
          }
          highlightedCube = pickInfo.pickedMesh;
          highlightedCube.material = highlightMaterial;
      }
      } else {
      // Reset the previously highlighted cube
      if (highlightedCube) {
          highlightedCube.material = defaultMaterial;
          highlightedCube = null;
      }
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
    crosshairPlane.isPickable = false;

    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1, 1, 1); // Adjust the ellipsoid to match the camera's bounding box
    scene.gravity = new Vector3(0, -0.9, 0); // Adjust gravity as needed
    camera._needMoveForGravity = true; // Ensure camera responds to gravity

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
