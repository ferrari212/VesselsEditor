// Importing the Three.js
import * as THREE from "../libs/three.js";

// Importing the OrbitControls.js library
import { OrbitControls } from "../libs/OrbitControls.js";

// Basic Three.js setup
let scene, camera, renderer, block;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xa9cce3, 1);
    document.getElementById('canvas').appendChild(renderer.domElement);

    // Add orbit controls to rotate the scene
    const controls = new OrbitControls(camera, renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Adding the axesHelper
    const axesHelper = new THREE.AxesHelper( 3 );
    scene.add( axesHelper );

    // Create a sample block
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x006600 });
    block = new THREE.Mesh(geometry, material);
    scene.add(block);

    camera.position.set( 5, 5, 5 );
    camera.lookAt( 0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Event listeners for creating and deleting blocks
document.getElementById('create-block').addEventListener('click', () => {
    // Function to create blocks
    console.log("Created the block");
});

document.getElementById('delete-block').addEventListener('click', () => {
    // Function to delete blocks
    console.log("Deleted the block");
});

// Add event listeners for input fields to update block parameters
document.getElementById('height').addEventListener('input', (event) => {
    // Update block height
    const value = parseFloat(event.target.value);
    block.scale.y = value;
});
// Add event listeners for input fields to update block parameters
document.getElementById('length').addEventListener('input', (event) => {
    // Update block length
    const value = parseFloat(event.target.value);
    block.scale.x = value;
});
// Add event listeners for input fields to update block parameters
document.getElementById('breadth').addEventListener('input', (event) => {
    // Update block breadth
    const value = parseFloat(event.target.value);
    block.scale.y = value;
});
