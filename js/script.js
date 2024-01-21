// Importing the Three.js
import * as THREE from "../libs/three.js";

// Importing the OrbitControls.js library
import { OrbitControls } from "../libs/3D_engine/OrbitControls.js";

// Importing the renderRayCaster.js
import renderRayCaster from "../libs/3D_engine/renderRayCaster.js"

// Importing Vessels.js library
import * as Vessel from "../libs/vessel.module.min.js";

// Importing the minimum database that represents a ship
import shipSpec from "./dataBase.js";

// Importing Ship3D library
import { Ship3D } from "../libs/3D_engine/Ship3D.js";

// Basic Three.js setup
let scene, camera, renderer, block;

// Raycaster Parameters
let intersected, mouse, elementClicked;

// Vessels.js state instances
let ship, state

init();
animate();

function init() {

    // Setting up Three.js scene, camera, and renderer to the previous defined variables
    ({ scene, camera, renderer } = setUpThreeJs());
    
    // Create a sample block
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x006600 });
    // block = new THREE.Mesh(geometry, material);
    // scene.add(block);

    // Use Vessel.js to create a ship instance
    // const ship_two = new Vessel.Ship("../assets/db/barge.json"); 
    // ship_two.createShip3D(
    //     {
    //       stlPath: ".",
    //       // upperColor: 0x33aa33,
    //       // lowerColor: 0xaa3333,
    //       // hullOpacity: 1,
    //       // deckOpacity: 1,
    //       // objectOpacity: 1,
    //     },
    //     Ship3D
    //   );
    // scene.add(ship_two.ship3D)
    const ship = new Vessel.Ship(shipSpec);
    const ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    scene.add(ship3D);

    // Set up the camera
    camera.position.set( 15, 15, 15 );
    camera.lookAt( 0, 0, 0);

    // Inserting Mouse movement effect 
    mouse = new THREE.Vector2();
    window.addEventListener("mousemove", onMouseMove, false)
    window.addEventListener("dblclick", onMouseDoubleClick, false)
    

}

function setUpThreeJs () {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xa9cce3, 1);
    document.getElementById('canvas').appendChild(renderer.domElement);

    // Add orbit controls to rotate the scene
    const controls = new OrbitControls(camera, renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Adding the axesHelper
    const axesHelper = new THREE.AxesHelper( 3 );
    scene.add( axesHelper );

    return {scene, camera, renderer}

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Apply the function RayCaster only if the element clicked is undefined
    if (elementClicked === undefined) {
        intersected = renderRayCaster(mouse, camera, scene, intersected)
        console.log(intersected);
    }

    if (intersected.name === undefined || elementClicked) {
        document.body.style.cursor = "default"
    } else {
        document.body.style.cursor = "pointer"
    }

}

function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    // Transport the event client position
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseDoubleClick (event) {

    const h = document.getElementById('height')
    const l = document.getElementById('length')
    const b = document.getElementById('breadth')
    const posX = document.getElementById('posX')
    const posY = document.getElementById('posY')
    const posZ = document.getElementById('posZ')

    // In case the new element is different from the intersected
    if (elementClicked != intersected.name) {
    
        elementClicked = intersected.name
        const element = scene.getObjectByName(elementClicked)
        console.log(element.position);
        console.log(element.scale);

        h.value = element.scale.x
        l.value = element.scale.y
        b.value = element.scale.z
        posX.value = element.position.x
        posY.value = element.position.y
        posZ.value = element.position.z
        return
    
    }

    h.value = 0.0
    l.value = 0.0
    b.value = 0.0
    posX.value = 0.0
    posY.value = 0.0
    posZ.value = 0.0

    elementClicked = undefined

}

// Generic function for error shown display
function showMessage(errorMessageText) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.createElement('div');

    errorMessage.textContent = errorMessageText;
    errorMessage.className = 'bg-red-600 text-white px-4 py-2 rounded opacity-0 transition-opacity duration-3000';

    // Append the new error message to the container
    errorContainer.appendChild(errorMessage);

    // Show the error message
    setTimeout(() => {
        errorMessage.classList.replace('opacity-0', 'opacity-100');
    }, 10); // Delay to ensure the element is rendered before starting the animation

    // Hide and remove the error message after 3 seconds
    setTimeout(() => {
        errorMessage.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => errorMessage.remove(), 1000); // Remove after fade-out
    }, 3000);
}

// Event listeners for creating and deleting blocks
document.getElementById('create-block').addEventListener('click', () => {
    // Function to create blocks
    console.log("Created the block");

    showMessage("Error: The function to ADD the block is not set yet");
});

document.getElementById('delete-block').addEventListener('click', () => {
    // Function to delete blocks
    console.log("Deleted the block");

    showMessage("Error: The function to DELETE the block is not set yet");
});

// Add event listeners for input fields to update block parameters
document.getElementById('height').addEventListener('input', (event) => {
    // Update block height
    const value = parseFloat(event.target.value);
    block.scale.z = value;
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
