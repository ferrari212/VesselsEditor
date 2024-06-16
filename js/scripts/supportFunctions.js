import * as THREE from "../../libs/three.js";

// Generic function for error display
export function showMessage({
        componentText = "errorContainer",
        errorMessageText = "Error: No element selected",
        timeOut = 1000
    }) {
    const errorContainer = document.getElementById(componentText);
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
        setTimeout(() => errorMessage.remove(), timeOut); // Remove after fade-out
    }, timeOut + 2000);
}

// Function to check if a color is dark
function isColorDark(color) {

    // Input a color THREE.Color element
    // Use the luminance formula to determine brightness
    let luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

    // Return true if the color is dark
    return luminance < 0.128;

}

export function assignColorToComponent(component, valueString) {
    /*
    Function receive a component and an color string
    if the color is dark the text will appear as white and placeholder as gray
    */
    const color = new THREE.Color(valueString);
    component.style.backgroundColor = "#" + color.getHexString();

    isColorDark(color) ? component.classList.add('placeholder-gray-100') : component.classList.remove('placeholder-gray-100');
    isColorDark(color) ? component.classList.add('text-white') : component.classList.remove('text-white');

}