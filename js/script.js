// Importing the Three.js
import * as THREE from "../libs/three.js";

// Importing the OrbitControls.js library
import { OrbitControls } from "../libs/3D_engine/OrbitControls.js";

// Importing the renderRayCaster.js
import renderRayCaster from "../libs/3D_engine/renderRayCaster.js"

// Importing Vessels.js library
import * as Vessel from "../libs/vessel.module.min.js";

// Importing the minimum database that represents a ship
import state from "./dataBase.js";

// Import find compartment
import { findCompartmentName } from "./findAddedPosition.js"

// Importing Ship3D library
import { Ship3D } from "../libs/3D_engine/Ship3D.js";

// Basic Three.js setup
let scene, camera, renderer, block;

// Raycaster Parameters
let intersected, mouse, elementClicked, parametersMenu;

// Vessels.js state instances
let ship, ship3D

// Default derived objects
const defaultCompartment = {}
defaultCompartment["derivedObjects"] = [
    {
        "id": "Tank_1", 
        "baseObject": "Cargo", 
        "affiliations": {
            "group": "cargo tanks",
        },
        "referenceState": {
            "xCentre": 5.0,
            "yCentre": 0.0,
            "zBase": 0.0
        },
    }
]

function init() {

    // Setting up Three.js scene, camera, and renderer to the previous defined variables
    ({ scene, camera, renderer } = setUpThreeJs());

    Object.assign(state, defaultCompartment)
    ship = new Vessel.Ship(state);
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    scene.add(ship3D);

    console.log(state);
    console.log(ship);

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

    h.value = ""
    l.value = ""
    b.value = ""
    posX.value = ""
    posY.value = ""
    posZ.value = ""
    elementClicked = ""

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

    // Remove the Ship 3D
    scene.remove(ship3D)

    const tank_name = findCompartmentName(state)
    let compartment = JSON.parse(JSON.stringify(defaultCompartment))
    compartment.derivedObjects[0].id = tank_name
    compartment.derivedObjects[0].referenceState.xCentre = 20.0
    state.derivedObjects.push(compartment.derivedObjects[0])
    ship = new Vessel.Ship(state);
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    scene.add(ship3D);

    showMessage("Error: The function to ADD the block is not set yet");
});

document.getElementById('delete-block').addEventListener('click', () => {
    
    
    if ( !elementClicked ) {
        showMessage("Error: The function to DELETE the block is not set yet");
        return
    }    
    
    // Remove the Ship 3D
    scene.remove(ship3D)
  
    // Delete the derived object
    ship.deleteDerivedObjectById(elementClicked)

    // Reconstruct the Ship3D
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });

    // Maintain the derived objects that does not have the same element clicked
    state.derivedObjects = state.derivedObjects.filter(obj => obj.id != elementClicked)
    // Add once again the Ship3D in the scene
    scene.add(ship3D);

    const h = document.getElementById('height')
    const l = document.getElementById('length')
    const b = document.getElementById('breadth')
    const posX = document.getElementById('posX')
    const posY = document.getElementById('posY')
    const posZ = document.getElementById('posZ')

    // Delete Elements
    h.value = ""
    l.value = ""
    b.value = ""
    posX.value = ""
    posY.value = ""
    posZ.value = ""
    elementClicked = ""

    console.log(state);
    console.log(ship);
    // showMessage("Finish the Error");

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

// Initialize the animation
init();
animate();