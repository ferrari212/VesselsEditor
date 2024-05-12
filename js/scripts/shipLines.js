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

    console.log(data);  // For demonstration, logs data to the console
    toggleClass(classList, "hidden", "block")
    // document.getElementById('overlay').style.display = 'none';  // Hide the overlay
});

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
// document.getElementById("")