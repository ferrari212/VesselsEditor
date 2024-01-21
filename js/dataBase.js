// This function creates a start generic ship to be used in the library
// The object contains the minimum acceptable object to make the Vessel function works


const shipSpec = {
    "attributes": {},
    "designState": {},
} 

// Defining Design States
shipSpec["designState"] = {
    "calculationParameters": {
        "LWL_design": 22.5,
        "BWL": 10,
        "Draft_design": 2,
        "Cb_design": 1,
        "speed": 12,
    "crew" : 20,
        "K" : 0.032,
        "MCR" : 10000,
        "SFC" : 0.000215,
        "Co" : 0.3,
        "tripDuration": 40
    },
    "objectOverrides": {
        "derivedByGroup": {
          "cargo tanks": {
            "fullness": 0
          },
        }
      }
}


// Defining Structure
shipSpec["structure"] = {
    "hull": {
        "attributes": {
            "LOA": 22.5,
            "BOA": 10,
            "Depth": 2.5,
            "APP": 0
        },
        "halfBreadths": {
            "waterlines": [0, 0, 1],
            "stations": [0, 1],
            "table": [[0, 0], [1, 1], [1, 1]]
        },
    },
    "decks": {},
   "bulkheads": {}
}

// Defining specifications
shipSpec["baseObjects"] = [
    {
        "id": "Cargo", 
        "affiliations": {},
        "boxDimensions": {
            "length": 10.25,
            "breadth": 9,
            "height": 10
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

// Defining derived objects
shipSpec["derivedObjects"] = [
    {
        "id": "Tank1", 
        "baseObject": "Cargo", 
        "affiliations": {
            "group": "cargo tanks",
        },
        "referenceState": {
            "xCentre": 10.0,
            "yCentre": 0.0,
            "zBase": 0.0
        },
    }
]

export default shipSpec