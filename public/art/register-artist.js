import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Alerts the user when an artist is successfully registered.
 * @param {*} response
 * @param {*} artistName 
 */
function registerSuccess(response, artistName) {
    alert(artistName + " successfully registered!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Register Artist", the form validates and sanitizes all inputs
 * and sends SQL queries to add the artist to the Artist table.
 */
function setupForm() {
    var registerForm = document.getElementById("form-register-an-artist");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;

        const textName = document.getElementById("text-name").value;
        const textBirthYear = document.getElementById("text-birth-year").value;
        const textDeathYear = document.getElementById("text-death-year").value;
        if (
            validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 })
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        const inputArray = [textBirthYear, textDeathYear, textName];

        if (validInput) {
            var query = "INSERT INTO Artist (birth_year, death_year, name) VALUES(" + 
                         inputArrayToString(inputArray) + ");";

            postToServer(toSQL(query), 
                         registerSuccess, 
                         alertDatabaseError, 
                         textName);
        }

      });
}

/**
 * Sets up page and calls function to setup form on load.
 */
$(function() {
    setupForm();
});