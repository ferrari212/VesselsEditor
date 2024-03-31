// This function creates a start generic ship to be used in the library
// The object contains the minimum acceptable object to make the Vessel function works
// this ship spec must be modified to accommodate the ship State class.
export let stateDb = {
    "attributes": {},
    "designState": {},
} 

// Defining Design States
stateDb["designState"] = {
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
stateDb["structure"] = {
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
