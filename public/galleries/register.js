import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

// Stores globally the type of gallery (museum, art-gallery, or virtual-art-gallery).
var type = "museum";

/**
 * Shows and hides the proper fields when the gallery type is changed.
 * @param {*} e 
 */
function radioTypeSelected(e) {
    console.log(e);
    if (this.checked) {
        console.log(this.id);
        if (this.id == 'radio-type-museum') {
            type = "museum";
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else if (this.id == 'radio-type-art-gallery') {
            type = "art-gallery"
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else {
            type = "virtual-art-gallery"
            document.getElementById("div-physical-group").style.display = "none";
            document.getElementById("div-virtual-group").style.display = "block";
        }
    }
}

/**
 * Adds event listener to the gallery type radio buttons to call a function to change
 * the visible fields accordingly.
 */
function setupRadioType() {
    const radioButtons = document.querySelectorAll('input[name="radio-type"]');
    for(const radioButton of radioButtons){
        radioButton.addEventListener('change', radioTypeSelected);
    }   
}

/**
 * Alerts the user when a gallery is successfully registered.
 * @param {*} galleryName 
 */
function registerSuccess(response, galleryName) {
    alert(galleryName + " successfully registered!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Register Gallery", the form validates and sanitizes all inputs
 * and sends SQL queries to add the gallery to the Gallery and 
 * Museum/Art_Gallery/Virtual_Art_Gallery tables.
 */
function setupForm() {
    var registerForm = document.getElementById("form-register-a-gallery");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;
        const textName = document.getElementById("text-name").value;
        const textAddress = document.getElementById("text-address").value;
        const textCity = document.getElementById("text-city").value;
        const textStateProvince = document.getElementById("text-state-province").value;
        const textPostalCode = document.getElementById("text-postal-code").value;
        const textCountry = document.getElementById("text-country").value;
        const textURL = document.getElementById("text-url").value;
        if (type == "museum" || type == "art gallery") {
            if (
                validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 }) &&
                ((validator.isAlphanumeric(textAddress, undefined, {ignore:" -"}) && validator.isLength(textAddress, { min: 0, max: 255 })) || validator.isEmpty(textAddress)) &&
                ((validator.isAlphanumeric(textCity, undefined, {ignore:" -"}) && validator.isLength(textCity, { min: 0, max: 255 })) || validator.isEmpty(textCity)) &&
                ((validator.isAlphanumeric(textStateProvince, undefined, {ignore:" -"}) && validator.isLength(textStateProvince, { min: 0, max: 255 })) || validator.isEmpty(textStateProvince)) &&
                ((validator.isAlphanumeric(textPostalCode, undefined, {ignore:" -"}) && validator.isLength(textPostalCode, { min: 0, max: 255 })) || validator.isEmpty(textPostalCode)) &&
                ((validator.isAlphanumeric(textCountry, undefined, {ignore:" -"}) && validator.isLength(textCountry, { min: 0, max: 255 })) || validator.isEmpty(textCountry))
                ) {
                validInput = true;
            } else {
                alert("Input is invalid.");
            }
        } else if (type == "virtual-art-gallery") {
            if (
                validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 }) &&
                ((validator.isURL(textURL, undefined, {ignore:" -"}) && validator.isLength(textURL, { min: 0, max: 255 })) || validator.isEmpty(textURL))
                ) {
                validInput = true;
            } else {
                alert("Input is invalid.");
            }
        }

        if (validInput) {
            var query1 = "INSERT INTO Gallery (name) VALUES (" +
                        "'" + sanitize(textName) + "'" + ");";

            var query2 = "SET @last_id = LAST_INSERT_ID();";

            var args = [];
            if (type == "museum") {
                args = ["Museum", textAddress, textCity, textStateProvince, textPostalCode, textCountry];
            } else if (type == "art-gallery") {
                args = ["Art_Gallery", textAddress, textCity, textStateProvince, textPostalCode, textCountry];
            } else if (type == "virtual-art-gallery") {
                args = ["Virtual_Art_Gallery", textURL];
            }            

            var query3 = "INSERT INTO " + args[0] + " VALUES (@last_id, " +
                         inputArrayToString(args.slice(1)) +
                         ");";

            const queryArray = [{query: query1, func: undefined, arg1: undefined, arg2: undefined},
                                {query: query2, func: undefined, arg1: undefined, arg2: undefined},
                                {query: query3, func: registerSuccess, arg1: textName, arg2: undefined}];

            multiPostToServer("", queryArray, alertDatabaseError);
        }

      });
}

/**
 * Sets up page and calls function to setup form on load.
 */
$(function() {
    document.getElementById("div-physical-group").style.display = "block";
    document.getElementById("div-virtual-group").style.display = "none";
    setupRadioType();
    setupForm();
});