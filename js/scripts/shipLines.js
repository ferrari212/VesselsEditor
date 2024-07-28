import { zUpCont } from "../script.js"
import { stateDb } from "../dataBase.js"
import { Ship } from "../../libs/vessel.module.min.js"
// import * as Vessel from "../../libs/vessel.module.min.js"
import { Ship3D } from "../../libs/3D_engine/Ship3D.js"
import { showMessage } from "./supportFunctions.js";

const halfBreadths = wigley_formula()

const toggleClass = (classList, addClass, removeClass) => {
    classList.remove(removeClass)
    classList.add(addClass)
}

function multiplyArray(arr, multiplier) {
    return arr.map(element => 
        Array.isArray(element) ? multiplyArray(element, multiplier) : element * multiplier
    );
}

const plotFunction = (halfBreadths, L, B, T) => {

    const data_waterlines = []
    const data_station = []
    
    const stations = multiplyArray(halfBreadths.stations, L)
    const table = multiplyArray(halfBreadths.table, B/2)
    const waterlines = multiplyArray(halfBreadths.waterlines, T)

    // Middle index for returning in negative position for visualization purpose
    const middleIndex = Math.floor(stations.length / 2); 

    // Plotting Water Lines
    table.forEach( (t, i) => {

        data_waterlines.push(
            {
                x: stations,
                y: t,
                name: waterlines[i].toString(),
                mode: 'scatter',
                line: {shape: 'spline'}
            }
        )
    })

    // Plotting stations
    stations.forEach((station, i) => {

        const multiplier = middleIndex > i ? 1 : -1

        data_station.push(
            {
                x: table.map(t => {return multiplier * t[i]}),
                y: waterlines,
                name: station.toString(),
                mode: 'scatter',
                line: {shape: 'spline'}
            }
        )
    })   

    const plotConfig = {
        modeBarButtonsToRemove: ["zoom2d", "pan2d", "lasso2d", "zoomIn2d", "zoomOut2d", "resetScale2d"]
    }

    Plotly.newPlot("plots_waterline", data_waterlines, 
        {
            title: "Waterlines",
            width: 1000,
            // height: 300,
            xaxis: {
                title: 'X (m)',
                showgrid: true,
                zeroline: false,
                range: [0, L]
            },
            yaxis: {
                title: 'Y (m)',
                showline: true,
                // scaleanchor: 'x',
                // scaleratio: 1
            },
            legend: {
                title: {
                    text: 'Z (m)'
                }
            }
        }, plotConfig)
    
    Plotly.newPlot("plots_station", data_station, 
        {
            title: "Frames",
            width: 750,
            height: 750,
            xaxis: {
                title: 'Y (m)',
                showgrid: true,
                zeroline: true,
                range: [-B/2, B/2]
            },
            yaxis: {
                title: 'Z (m)',
                showline: true,
                scaleanchor: 'x',
                scaleratio: 1,
                range: [0, T]
            },
            legend: {
                title: {
                    text: 'X (m)'
                }
            }
        }, plotConfig)
    
}

document.getElementById('openForm').addEventListener('click', function() {
    const overlayElement = document.getElementById('overlay');
    const classList = overlayElement.classList
    
    read_inputs_values()
    plotFunction(halfBreadths, 100, 5, 2)

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
    
    const halfBreadths = wigley_formula()
    
    // setting up the stateDb parameters
    stateDb.baseObjects = [{}]
    stateDb.derivedObject = [{}]
   
    stateDb.structure.hull.halfBreadths = {        
        "waterlines": halfBreadths.waterlines,
        "stations": halfBreadths.stations,
        "table": halfBreadths.table,
    }
    
    stateDb.baseObjects = []
    stateDb.derivedObjects = []

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

});

// Change element Parameter
function onChangeElement (e) {

    const queryString = `input[name="${e.name}"].text_input`
        
    document.querySelector(queryString).value = slideElement.value
}


// First guess of the ship main dimensions according to the input table
function read_inputs_values() {
    
    const vessel_parameters_guess = {};

    const slideElements = [...document.getElementsByClassName("slide_input")]


    slideElements.forEach((slideElement) => {
        vessel_parameters_guess[slideElement.name] = slideElement.value

        

    })

    // TODO: Eliminate this by looping through children, insert a loop that will take the elements and modify accordingly
    // vessel_parameters_guess.Length_OA = parseFloat(document.getElementById("slide_length_oa_first_guess").value)
    // document.getElementById("length_oa_first_guess").value = vessel_parameters_guess.Length_OA
    // vessel_parameters_guess.Breadth = parseFloat(document.getElementById("slide_breadth_first_guess").value)
    // document.getElementById("breadth_first_guess").value = vessel_parameters_guess.Breadth
    // vessel_parameters_guess.Depth = parseFloat(document.getElementById("slide_depth_first_guess").value)
    // document.getElementById("depth_first_guess").value = vessel_parameters_guess.Depth 
    // vessel_parameters_guess.Draft = parseFloat(document.getElementById("slide_draft_first_guess").value)
    // document.getElementById("draft_first_guess").value = vessel_parameters_guess.Draft 
    // vessel_parameters_guess.Displacement = parseFloat(document.getElementById("slide_displacement_first_guess").value)
    // document.getElementById("displacement_first_guess").value = vessel_parameters_guess.Displacement
    // vessel_parameters_guess.Length_WL = vessel_parameters_guess.Length_OA; 
    
    // [...document.getElementsByClassName("first_guess")].forEach(e => {return e})

    console.log(vessel_parameters_guess);

    return

}
const first_guess_elements = [...document.getElementsByClassName("first_guess")]
first_guess_elements.forEach(input => input.addEventListener('input', read_inputs_values));

function wigley_formula() {
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

    const waterLineSteps = 20;
    const stationSteps = 40;

    const halfBreadths = {
        "waterlines": [],
        "stations": [],
        "table": [],
    }

    for (let i = 0; i <= waterLineSteps; i++) {
        
        const wl = i / waterLineSteps;
        halfBreadths.waterlines.push(wl)

        const valuesArray = []
        
        for (let j = 0; j <= stationSteps; j++) {

            const st = j / stationSteps;
            
            const y = (1 - ( 2 * (st - 0.5))** 2) * (1 - (wl - 1)** 2);
    
            valuesArray.push(y)
        }

        halfBreadths.table.push(valuesArray)
    }

    halfBreadths.stations = Array.from({length: stationSteps + 1}, (_, j) => j / stationSteps);


    return halfBreadths

}