    import { zUpCont } from "../script.js"
    import { stateDb } from "../dataBase.js"
    import { Ship } from "../script.js";
    import { Ship3D } from "../../libs/3D_engine/Ship3D.js"
    

const toggleClass = (classList, addClass, removeClass) => {
    classList.remove(removeClass)
    classList.add(addClass)
}

document.getElementById('openForm').addEventListener('click', function() {
    const overlayElement = document.getElementById('overlay');
    const classList = overlayElement.classList

    classList.contains("hidden") ? toggleClass(classList, "block", "hidden") : toggleClass(classList, "hidden", "block")

});

document.getElementById('submitForm').addEventListener('click', function() {
    const overlayElement = document.getElementById('overlay');
    const classList = overlayElement.classList
    
    const form = document.getElementById('dataForm');
    const data = {
        // firstName: form.querySelector('input[placeholder="First Name"]').value,
        // lastName: form.querySelector('input[placeholder="Last Name"]').value,
        // email: form.querySelector('input[placeholder="Email"]').value,
    };
    
    const halfBreadths = wigley_formula(100, 5, 7)
    
    // setting up the stateDb parameters
    stateDb.baseObjects = [{}]
    stateDb.derivedObject = [{}]
    stateDb.designState.calculationParameters = {
        "BWL": 5,
        "LWL_design": 100,
        "Draft_design": 7,
    }
    stateDb.structure.hull.attributes = {
        "BOA": 5,
        "Depth": 7,
        "LOA": 100,
    }
    stateDb.structure.hull.halfBreadths = {        
        "waterlines": halfBreadths.waterlines,
        "stations": halfBreadths.stations,
        "table": halfBreadths.table,
    }
    stateDb.baseObjects = [
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
    stateDb.derivedObjects = [
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
    zUpCont.remove(...zUpCont.children)

    const ship = new Ship(stateDb);
    const ship3D = new Ship3D(ship, {
        upperColor: 0x33aa33,
        lowerColor: 0xaa3333,
        hullOpacity: 1,
        deckOpacity: 1,
        objectOpacity: 1
    });
    zUpCont.add(ship3D);

    toggleClass(classList, "hidden", "block")
    // document.getElementById('overlay').style.display = 'none';  // Hide the overlay
});

// First guess of the ship main dimensions according to the input table
function first_guess() {
    
    const vessel_parameters_guess = {};

    vessel_parameters_guess.Length_OA = parseFloat(document.getElementById("slide_length_oa_first_guess").value)
    document.getElementById("length_oa_first_guess").value = vessel_parameters_guess.Length_OA
    vessel_parameters_guess.Breadth = parseFloat(document.getElementById("slide_breadth_first_guess").value)
    document.getElementById("breadth_first_guess").value = vessel_parameters_guess.Breadth
    vessel_parameters_guess.Depth = parseFloat(document.getElementById("slide_depth_first_guess").value)
    document.getElementById("depth_first_guess").value = vessel_parameters_guess.Depth 
    vessel_parameters_guess.Draft = parseFloat(document.getElementById("slide_draft_first_guess").value)
    document.getElementById("draft_first_guess").value = vessel_parameters_guess.Draft 
    vessel_parameters_guess.Displacement = parseFloat(document.getElementById("slide_displacement_first_guess").value)
    document.getElementById("displacement_first_guess").value = vessel_parameters_guess.Displacement
    vessel_parameters_guess.Length_WL = vessel_parameters_guess.Length_OA; 
    
    // Length related variables
    vessel_parameters_guess.Length_Deck = Math.round(Math.round(10*vessel_parameters_guess.Length_OA*0.97)/10) + 0.5
    vessel_parameters_guess.Length_Aft = Math.round(Math.round(10*vessel_parameters_guess.Length_OA*0.41)/10) + 0.5
    vessel_parameters_guess.Length_Fore = Math.round(Math.round(10*vessel_parameters_guess.Length_OA*0.40)/10) + 0.5
    vessel_parameters_guess.Bow_a = Math.round(10*vessel_parameters_guess.Length_OA*0.09)/10

    // Breadth related variables
    vessel_parameters_guess.B_transom = Math.round(10*vessel_parameters_guess.Breadth*0.65)/10
    vessel_parameters_guess.Cb = Math.round(100*vessel_parameters_guess.Displacement/(vessel_parameters_guess.Length_WL*vessel_parameters_guess.Breadth*vessel_parameters_guess.Draft))/100
    vessel_parameters_guess.Cp = vessel_parameters_guess.Cb + 0.02
    
    // Derived parameters
    vessel_parameters_guess.Upturn = Math.round(vessel_parameters_guess.Length_Aft*0.50)
    vessel_parameters_guess.Depth_Transom = Math.round(10*vessel_parameters_guess.Depth*0.25)/10
    vessel_parameters_guess.H_Propeller = Math.round(10*vessel_parameters_guess.Depth*0.33)/10
    
    // Constants attributes
    vessel_parameters_guess.Cwl = 0.9
    vessel_parameters_guess.Area_Ratio = 0.15
    vessel_parameters_guess.LCB = 0
    vessel_parameters_guess.LCF = -5
    vessel_parameters_guess.Entrance_t = 3
    vessel_parameters_guess.Exit_t = 56
    vessel_parameters_guess.alphaR_wl = 0.6
    vessel_parameters_guess.alphaE_wl = 0.5
    vessel_parameters_guess.alphaE_DECK = 0.07
    vessel_parameters_guess.alphaE_deck = 110;
    vessel_parameters_guess.Entrance_Angle = 48
    vessel_parameters_guess.Exit_Angle = 35

    return

}
const first_guess_elements = [...document.getElementsByClassName("first_guess")]
first_guess_elements.forEach(input => input.addEventListener('input', first_guess));

function wigley_formula (L, B, T) {
    /*
    This is a partial and simplified approach to the water lines using
    the simplified wigley formulas.
    The main goal is to use the Tiago formula in: http://shiplab.hials.org/app/shiplines/
    However, this application would require more effort due to complex of the formulas used
    
    As a bypass for creating the features, the wigley formula as defined by:
    https://kth.diva-portal.org/smash/get/diva2:1236507/FULLTEXT01.pdf
    Chapter 2.5.1
    The formula was modified for an non dimensional format
    */

    const uSteps = 20;
    const vSteps = 40;

    const halfBreadths = {
        "waterlines": [],
        "stations": [],
        "table": [],
    }

    for (let i = 0; i <= uSteps; i++) {
        
        const u = i / uSteps;
        halfBreadths.waterlines.push(u)

        const valuesArray = []
        
        for (let j = 0; j <= vSteps; j++) {

            const v = j / vSteps;
            
    
            const y = (1 / 2) * 4 * v * (1 - v) * (u) ** 2;
    
            valuesArray.push(y)
        }

        halfBreadths.table.push(valuesArray)
    }

    // halfBreadths.stations = Array.from({length: uSteps}, (_, i) =>  i / uSteps);
    halfBreadths.stations = Array.from({length: vSteps + 1}, (_, j) => j / vSteps);

    // halfBreadths.stations.forEach((station) => {
    //     const valuesArray = []
    //     halfBreadths.waterlines.forEach((waterline) => {

    //         // Coefficients

    //         const a = (1 - Math.pow(2 * station / L, 2))
    //         const b = (1 - Math.pow(2 * waterline / T, 2))

    //         valuesArray.push( a * b /2 )

    //     })

    //     halfBreadths.table.push(valuesArray)

    // })

    return halfBreadths

}