import {postToServer, 
    silentPost,
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Sets up the Customer Name field to automatically determine if the email entered
 * is of a valid customer.
 * Prevents recording the visit if the email is invalid.
 */
function setupFindNameByEmail() {
    var textEmail = document.getElementById("text-email");
    textEmail.addEventListener("blur", function() {
        var query = "SELECT customer_id, name FROM Customer WHERE email = " + 
                    addSingleQuotesOrNULL(document.getElementById("text-email").value) + ";";
        silentPost(toSQL(query), (response) => {
            const result = JSON.parse(response);
            if (result.length == 0) {
                document.getElementById("text-name").value = "";
                document.getElementById("customer-not-found").validCustomer = false;
                document.getElementById("customer-not-found").customerId = null;
                document.getElementById("customer-not-found").innerHTML = "Customer not found. Please double-check the email and ensure the customer has been registered previously.";
                document.getElementById("button-record-visit").disabled = true;
            } else {
                document.getElementById("text-name").value = result[0].name;
                document.getElementById("customer-not-found").validCustomer = true;
                document.getElementById("customer-not-found").customerId = result[0].customer_id;
                document.getElementById("customer-not-found").innerHTML = "";
                document.getElementById("button-record-visit").disabled = false;
            }
        }, alertDatabaseError);
    });
}

/**
 * Loads a list of all exhibits into the select (dropdown) menu.
 */
function setupSelectExhibit() {
    var query = "SELECT * FROM Exhibit;"
    postToServer(toSQL(query), (response) => {
        document.getElementById("select-exhibit").innerHTML = "<option selected>Select an Exhibit</option>";
        var exhibits = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < exhibits.length; i++) {
            optionHTML += "<option value=" + exhibits[i].exhibit_id + ">" + exhibits[i].title + "</option>"
        }
        optionHTML += "<option value=0 selected>Select an Exhibit</option>";
        document.getElementById("select-exhibit").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Alerts the user when a visit is successfully registered.
 * @param {*} response
 * @param {*} customerName 
 */
function registerSuccess(response, customerName) {
    alert("Visit by " + customerName + " successfully registered!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Record Visit", the form validates and sanitizes all inputs
 * and sends SQL queries to add the visit to the Visits table.
 */
function setupForm() {
    var registerForm = document.getElementById("form-record-a-visit");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;

        

        const textEmail = document.getElementById("text-email").value;
        const textCustomerName = document.getElementById("text-name").value;
        const customerId = document.getElementById("customer-not-found").customerId;
        const selectExhibit = document.getElementById("select-exhibit").value;
        const dateOfVisit = document.getElementById("date-of-visit").value;
        const textPrice = document.getElementById("text-price").value;
        if (
            validator.isEmail(textEmail) && validator.isLength(textEmail, { min: 0, max: 255 }) &&
            (selectExhibit != 0)
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        const inputArray = [customerId, selectExhibit, dateOfVisit, textPrice];

        if (validInput) {

            var query1 = "INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id) VALUES(" +
                         customerId + ", " +
                         "STR_TO_DATE(" + "'" + dateOfVisit + "', '%Y-%m-%d'), " +
                         selectExhibit + "" +
                         ");"

            var query2 = "INSERT INTO Visits (customer_id, exhibit_id, date, price) VALUES(" + 
                        customerId + ", " +
                        selectExhibit + ", " +
                        "STR_TO_DATE(" + "'" + dateOfVisit + "', '%Y-%m-%d'), " +
                        addSingleQuotesOrNULL(textPrice) +
                        ");";

            const queryArray = [{query: query1, func: undefined, arg1: undefined, arg2: undefined},
                                {query: query2, func: registerSuccess, arg1: undefined, arg2: undefined}]

            multiPostToServer("", queryArray, alertDatabaseError);
        }

      });
}

/**
 * Sets up page and calls function to setup form on load.
 */
$(function() {
    setupFindNameByEmail();
    setupSelectExhibit();
    setupForm();
});