import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Alerts the user when a customer is successfully registered.
 * @param {*} response
 * @param {*} customerName
 */
function registerSuccess(response, customerName) {
    alert(customerName + " successfully registered!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Register Customer", the form validates and sanitizes all inputs
 * and sends SQL queries to add the customer to the Customer table.
 */
function setupForm() {
    var registerForm = document.getElementById("form-register-a-customer");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;

        const textName = document.getElementById("text-name").value;
        const textEmail = document.getElementById("text-email").value;
        const priceGroup = document.querySelector('input[name="radio-price-group"]:checked').value;
        if (
            validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 }) &&
            validator.isEmail(textEmail) && validator.isLength(textEmail, { min: 0, max: 255 })
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        const inputArray = [textName, priceGroup, textEmail];

        if (validInput) {
            var query = "INSERT INTO Customer (name, price_group, email) VALUES(" + 
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