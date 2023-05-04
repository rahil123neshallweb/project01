
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xA3A3A3);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 4, -4);
  controls.update();


const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// const ambientLight = new THREE.AmbientLight(0x3f3f3f, 0.8);
// scene.add(ambientLight);

// const DirectionalLight = new THREE.DirectionalLight(0xafafaf, 0.5);
// scene.add(DirectionalLight);
// DirectionalLight.position.set(10,11, 7);

// const DirectionalLight2 = new THREE.DirectionalLight(0xafafaf, 0.5);
// scene.add(DirectionalLight2);
// DirectionalLight2.position.set(-10, -11, -7);

const gltfLoader = new GLTFLoader();

const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let car;

rgbeLoader.load('hdr-light/01.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('car01.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        car = model;
        car.position.set(0,0,0)
        // car.rotation.y = Math.PI / 3;
    });

});

// 
// 
// 
// 
// 
//
// Set up the arrow key and mouse click event listeners
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("mousedown", onDocumentMouseDown, false);

// Handle arrow key events
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) { // up arrow
        var forwardVector = new THREE.Vector3(0, 0, -1);
        forwardVector.applyEuler(car.rotation);
        car.position.sub(forwardVector.multiplyScalar(0.1));
        camera.position.sub(forwardVector.multiplyScalar(1));
      } else if (keyCode == 40) { // down arrow
        var forwardVector = new THREE.Vector3(0, 0, -1);
        forwardVector.applyEuler(car.rotation);
        car.position.add(forwardVector.multiplyScalar(0.1));
        camera.position.add(forwardVector.multiplyScalar(1));

      } else if (keyCode == 37) { // left arrow
        // car.rotation.y += 0.1;
        grid.rotation.y += 0.1;
      } else if (keyCode == 39) { // right arrow
        car.rotation.y -= 0.1;
      }
  }

  // Handle mouse click events
function onDocumentMouseDown(event) {
    // Calculate the mouse position in normalized device coordinates
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Raycast from the camera to the mouse position
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    // Find the intersection between the ray and the cube
    var intersects = raycaster.intersectObjects([car]);
  
    // If the ray intersects the cube, move it up
    if (intersects.length > 0) {
      car.position.z += 0.1;
    }
  }
// 
//
// 
// 
// 


function animate(time) {
    requestAnimationFrame(animate);
        renderer.render(scene, camera);

    // if (car)
        // car.rotation.y = -time / 3000;
        // renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
