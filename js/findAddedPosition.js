export function findAddedPosition (ship3D, newBlock) {
    // The function receive the scene elements and try to 
    //  find the position for the new added box
    // The new position always would be outside an existing compartment
    // The new file is moved in the x span direction every time the position is conflicting 
    // with the other blocks

    return undefined
}

export function findCompartmentName(state){
    
    const derivedObjectsArray = state["derivedObjects"]

    if(derivedObjectsArray.length == 0) {
        return "Tank_1"
    }

    // Takes the seccond character after splitting with the _ and transform it into integer
    const number_arrays = derivedObjectsArray.map( (obj) => parseInt(obj.id.split("_")[1]) )
    const max_index = Math.max(...number_arrays) + 1;
    return "Tank_" + max_index

}