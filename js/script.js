// Importing the Three.js
import * as THREE from "../libs/three.js";

// Importing the OrbitControls.js library
import { OrbitControls } from "../libs/3D_engine/OrbitControls.js";

// Importing the renderRayCaster.js
import renderRayCaster from "../libs/3D_engine/renderRayCaster.js"

// Importing Vessels.js library
import * as Vessel from "../libs/vessel.module.min.js";

// Importing the minimum database that represents a ship
import stateDb from "./dataBase.js";

// Import find compartment
import { findIndexes } from "./findAddedPosition.js"

// Importing Ship3D library
import { Ship3D } from "../libs/3D_engine/Ship3D.js";

// Basic Three.js setup
let zUpCont, scene, camera, renderer;

// Raycaster Parameters
let intersected, mouse, elementClicked, parametersMenu;

// Vessels.js stateDb instances
let ship, ship3D

// Default derived objects
const defaultCompartment = {}
defaultCompartment["baseObjects"] = [
    {
        "id": "Tank_1", 
        "affiliations": {},
        "boxDimensions": {
            "length": 10.0,
            "breadth": 10.0,
            "height": 10.0
        },
        "capabilities": {},
        "baseState": {
            "fullness": 0
        },
        "weightInformation": {
            "contentDensity": 850,
            "volumeCapacity": 145,
            "lightweight": 10000,
            "fullnessCGMapping": {
            "fullnesses": [0, 0.25, 0.5, 0.75, 1],
            "cgs": [
                [0, 0, 0.8],
                [0, 0, 0.347013783],
                [0, 0, 0.455846422],
                [0, 0, 0.6195241],
                [0, 0, 0.8]
            ]
            }
        }
    }
]
defaultCompartment["derivedObjects"] = [
    {
        "id": "Tank_1", 
        "baseObject": "Tank_1", 
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

    Object.assign(stateDb, defaultCompartment)
    ship = new Vessel.Ship(stateDb);
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    scene.add(ship3D);
    
    // Adding the ship3D into the zUp function
    zUpCont.add(ship3D);

    console.log(stateDb);
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

    // Setting the Z-Up reference system.
    THREE.Object3D.DefaultUp.set(0, 0, 1);
    zUpCont = new THREE.Group();
    zUpCont.rotation.x = -0.5 * Math.PI;
    scene.add(zUpCont);

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

    // Change the cursor to the default if the element is clicked or 
    // the cursor is out of specific elements 
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

    const selectedName = document.getElementById('selectedName')
    const h = document.getElementById('height')
    const l = document.getElementById('length')
    const b = document.getElementById('breadth')
    const posX = document.getElementById('posX')
    const posY = document.getElementById('posY')
    const posZ = document.getElementById('posZ')

    // In case the new element is different from the intersected
    if (elementClicked != intersected.name) {
    
        elementClicked = intersected.name
        const element = zUpCont.getObjectByName(elementClicked)
        console.log(element.position);
        console.log(element.scale);

        selectedName.value = elementClicked
        // elements considering the zUpCont coordinates
        h.value = element.scale.z
        l.value = element.scale.x
        b.value = element.scale.y
        posX.value = element.position.x
        posY.value = element.position.y
        posZ.value = element.position.z
        return
    
    }

    selectedName.value = ""
    h.value = ""
    l.value = ""
    b.value = ""
    posX.value = ""
    posY.value = ""
    posZ.value = ""
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

    // Remove the Ship 3D
    zUpCont.remove(ship3D)

    // const tank_name = findIndexes(stateDb)
    const compartmentIndex = findIndexes(stateDb)

    // Clone the default compartment object
    const compartment = JSON.parse(JSON.stringify(defaultCompartment))

    // Set the new indexes
    const keyId = "Tank" + compartmentIndex

    const baseObjects = compartment.baseObjects[0]
    const derivedObjects = compartment.derivedObjects[0]

    baseObjects.id = keyId
    derivedObjects.id = keyId
    derivedObjects.baseObject = keyId
    derivedObjects.style = {
        "color": "#aabbcc",
        "opacity": 1
    }

    derivedObjects.referenceState.xCentre = 20.0
    stateDb.baseObjects.push(baseObjects)
    stateDb.derivedObjects.push(derivedObjects)

    ship = new Vessel.Ship(stateDb);
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    zUpCont.add(ship3D);
    
    // showMessage("Error: The function to ADD the block is not set yet");
});

document.getElementById('delete-block').addEventListener('click', () => {
    
    
    if ( !elementClicked ) {
        showMessage("Error: No element selected");
        return
    }    
    
    // Remove the Ship 3D
    zUpCont.remove(ship3D)
  
    // Delete the derived object
    ship.deleteBaseObjectById(elementClicked)

    // Reconstruct the Ship3D
    ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });

    // Maintain the derived objects that does not have the same element clicked
    stateDb.baseObjects = stateDb.baseObjects.filter(obj => obj.id != elementClicked)
    stateDb.derivedObjects = stateDb.derivedObjects.filter(obj => obj.id != elementClicked)
    // Add once again the Ship3D in the zUpCont
    zUpCont.add(ship3D);

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
    elementClicked = undefined

    console.log(stateDb);
    console.log(ship);
    // showMessage("Finish the Error");

});

function changeVariableValue(valueString,  dimension, elementClickedName) {
    
    if(!elementClicked){
        showMessage("Error: No Element Selected");
        return
    }

    const value = parseFloat(valueString);
    const block = scene.getObjectByName(elementClickedName);

    // Verify if the dimension that needs to be updated 
    // is in the scale or position. In case the position is modified change the 
    // referenceState center, otherwise change the box dimensions
    const dimensionKey = dimension.includes("pos") ? "position" : "scale" 
    
    const modifiedDimension = block[dimensionKey]

    // Takes the last element on the string
    const cardinalReference = dimension[dimension.length - 1]
    modifiedDimension[cardinalReference] = value

    const updateObjects = {
        "scale": () => {
            ship3D.ship.changeBaseObjectById(elementClickedName, {"boxDimensions": {
                "length": modifiedDimension.x,
                "breadth": modifiedDimension.y,
                "height": modifiedDimension.z
                    }
                }
            )
            stateDb.baseObjects.forEach(obj => {
                if (obj.id === elementClickedName) {
                    obj.boxDimensions.length = modifiedDimension.x;
                    obj.boxDimensions.breadth = modifiedDimension.y;
                    obj.boxDimensions.height = modifiedDimension.z;
                }                
            });
        },
        "position": () => {
            ship3D.ship.changeDerivedObjectById(elementClickedName, {"referenceState": {
                "xCentre": modifiedDimension.x,
                "yCentre": modifiedDimension.y,
                "zCentre": modifiedDimension.z
                    }
                }
            )
            stateDb.derivedObjects.forEach(obj => {
                if (obj.id === elementClickedName) {
                    obj.referenceState.xCentre = modifiedDimension.x;
                    obj.referenceState.yCentre = modifiedDimension.y;
                    obj.referenceState.zBase = modifiedDimension.z;
                }                
            });
        }
    }
        
    // ship3D.ship.changeBaseObjectById(elementClickedName, {"boxDimensions": {
    //     "length": modifiedDimension.x,
    //     "breadth": modifiedDimension.y,
    //     "height": modifiedDimension.z
    // }})

    updateObjects[dimensionKey]()
    console.log(dimensionKey);
    console.log(ship3D.ship.baseObjects[elementClickedName].boxDimensions);
    console.log(ship3D.ship.derivedObjects[elementClickedName].referenceState);

}

document.getElementById('height').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "z", elementClicked)

});

document.getElementById('length').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "x", elementClicked)

});

document.getElementById('breadth').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "y", elementClicked)

});

document.getElementById('posX').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "pos_x", elementClicked)

});

document.getElementById('posY').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "pos_y", elementClicked)

});

document.getElementById('posZ').addEventListener('input', (event) => {
    
    changeVariableValue(event.target.value, "pos_z", elementClicked)

});

// Insert the input file
// This is under construction @FELDEO
document.getElementById('file-upload-btn').addEventListener('click', function() {
    showMessage("Json upload under construction");
    return
    
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function() {
    // Handle the file input change event here
    // For example, you can access the selected file like this:
    var file = this.files[0];
    console.log(file);
});

// Initialize the animation
init();
animate();