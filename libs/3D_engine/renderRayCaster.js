// TODO: Pass this function to class, the return to the element, might bring flexibility on the function

export default function renderRayCaster( mouse, camera, scene, intersectedElement = { name: undefined }, color = "rgb(255,0,0)" ) {

	// Ray Caster Function. @ferrari212. Inspirations:
	// https://threejs.org/docs/#api/en/core/Raycaster;
	// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
	// mouse: {x: float, y: float}; position normalized from -1 to 1 of the relative position of the mouse
	// camera: THREE.js camera object (obj)
	// scene: THREE.js scene object (obj)
	// intersectedElement : Previous intersected element (obj)
	//
	// return new intersected element object

	let raycaster = new THREE.Raycaster();

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	scene.updateMatrixWorld();

	// calculate objects intersecting the picking ray
	// recursive setted to true to check all sub elements
	let intersects = raycaster.intersectObjects( scene.children, true );
	console.log(intersects);

	// Try verifies the if there is intersects[0].object error
	try {

		setNewColor();
		return intersectedElement;

	} catch {

		// Objsect touched nothing
		returnToOriginalColor();

		return { name: undefined };

	}

	function setNewColor() {

		if ( intersects[ 0 ].object.name != "" && intersects[ 0 ].object.name != undefined ) {
			// Objsect touched something
			
			if ( intersectedElement.name != intersects[ 0 ].object.name ) {
				
				// Objsect touched is different from the previeus
				
				if ( intersectedElement.name != undefined ) {
					
					// Check if there was a previeus touched object
					// Make the previous in its original color
					intersectedElement.material.color.set( intersectedElement.currentHex );
					
				}
				
				// cast name and colors of the object
				intersectedElement = intersects[ 0 ].object;
				intersectedElement.currentHex = intersectedElement.material.color.getHex();
				
				//paint element of red
				intersects[ 0 ].object.material.color.set( color );

			}

			intersectedElement.status = true;

		} else {

			returnToOriginalColor();

			// cast name and colors of the object as udefined
			intersectedElement = { name: undefined, currentHex: undefined, status: false };

		}

	}

	function returnToOriginalColor() {

		if ( intersectedElement.name != undefined  && intersectedElement.currentHex != undefined ) {

			// Check if there was a previeus touched
			// Make the previous in its original color
			intersectedElement.material.color.set( intersectedElement.currentHex );

		}

		// cast name and colors of the object as udefined
		intersectedElement = { name: undefined, currentHex: undefined, status: false };

	}

}
