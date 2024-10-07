import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Loads a list of all galleries into the select (dropdown) menu.
 */
function setupSelectGallery() {
    var query = "SELECT * FROM Gallery;"
    postToServer(toSQL(query), (response) => {
        document.getElementById("select-gallery").innerHTML = "<option selected>Select a Gallery</option>";
        var galleries = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < galleries.length; i++) {
            optionHTML += "<option value=" + galleries[i].gallery_id + ">" + galleries[i].name + "</option>"
        }
        optionHTML += "<option value=0 selected>Select a Gallery</option>";
        document.getElementById("select-gallery").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Alerts the user when a exhibit is successfully registered to a gallery.
 * @param {*} response
 * @param {*} exhibitName
 * @param {*} galleryName 
 */
function registerSuccess(response, exhibitName, galleryName) {
    alert(exhibitName + " successfully registered to " + galleryName + "!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Register Exhibit", the form validates and sanitizes all inputs
 * and sends SQL queries to add the exhibit to the Exhibit table.
 */
function setupForm() {
    var registerForm = document.getElementById("form-register-an-exhibit");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;

        const textTitle = document.getElementById("text-title").value;
        const selectGallery = document.getElementById("select-gallery").value;
        const dateStart = document.getElementById("date-start").value;
        const dateEnd = document.getElementById("date-end").value;
        if (
            validator.isAlphanumeric(textTitle, undefined, {ignore:" -"}) && validator.isLength(textTitle, { min: 0, max: 255 }) &&
            (selectGallery != 0) &&
            (validator.isDate(dateStart, { format: "YYYY-MM-DD" }) || validator.isEmpty(dateStart)) &&
            (validator.isDate(dateEnd, { format: "YYYY-MM-DD" }) || validator.isEmpty(dateEnd))
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        const inputArray = [textTitle, dateStart, dateEnd];

        if (validInput) {
            var query = "INSERT INTO Exhibit (gallery_id, title, start_date, end_date) VALUES(" + 
                         selectGallery + ", " +
                         inputArrayToString(inputArray) + ");";

            var selectGalleryElement = document.getElementById("select-gallery");
            postToServer(toSQL(query), 
                         registerSuccess, 
                         alertDatabaseError, 
                         textTitle, 
                         selectGalleryElement.options[selectGalleryElement.selectedIndex].text);
        }

      });
}

/**
 * Sets up page and calls function to setup form on load.
 */
$(function() {
    setupSelectGallery();
    setupForm();
});