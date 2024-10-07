import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Loads a list of all artists into the select (dropdown) menu.
 */
function setupSelectArtist() {
    var query = "SELECT * FROM Artist;"
    postToServer(toSQL(query), (response) => {
        document.getElementById("select-artist").innerHTML = "<option selected>Select an Artist</option>";
        var artists = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < artists.length; i++) {
            optionHTML += "<option value=" + artists[i].artist_id + ">" + artists[i].name + "</option>"
        }
        optionHTML += "<option value=0 selected>Select an Artist</option>";
        document.getElementById("select-artist").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Loads a list of all owners into the select (dropdown) menu.
 */
function setupSelectOwner() {
    var query = "SELECT * FROM Owner;"
    postToServer(toSQL(query), (response) => {
        document.getElementById("select-owner").innerHTML = "<option selected>Select an Owner</option>";
        var owners = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < owners.length; i++) {
            optionHTML += "<option value=" + owners[i].owner_id + ">" + owners[i].name + "</option>"
        }
        optionHTML += "<option value=0 selected>Select an Owner</option>";
        document.getElementById("select-owner").innerHTML = optionHTML;
    }, alertDatabaseError);
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
 * Alerts the user when an artwork is successfully registered.
 * @param {*} response
 * @param {*} artworkname 
 */
function registerSuccess(response, artworkName) {
    alert(artworkName + " successfully registered!");
}

/**
 * Adds a listener to the register form.
 * Upon clicking "Register Artwork", the form validates and sanitizes all inputs
 * and sends SQL queries to add the artwork to the Art table.
 */
function setupForm() {
    var registerForm = document.getElementById("form-register-an-artwork");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;

        const textTitle = document.getElementById("text-title").value;
        const textYearCreated = document.getElementById("text-year-created").value;
        const textareaDescription = document.getElementById("textarea-description").value;
        const selectArtist = document.getElementById("select-artist").value;
        const selectOwner = document.getElementById("select-owner").value;
        var selectExhibit = document.getElementById("select-exhibit").value;
        if (
            validator.isAlphanumeric(textTitle, undefined, {ignore:" -"}) && validator.isLength(textTitle, { min: 0, max: 255 }) &&
            (selectArtist != 0) && (selectOwner != 0)
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        if (selectExhibit == 0) selectExhibit = "";
        const inputArray = [selectOwner, textTitle, textYearCreated, textareaDescription, selectExhibit, selectArtist];

        if (validInput) {
            var query = "INSERT INTO Art (owner_id, title, year_created, description, exhibit_id, artist_id) VALUES(" + 
                         inputArrayToString(inputArray) + ");";

            postToServer(toSQL(query), 
                         registerSuccess, 
                         alertDatabaseError, 
                         textTitle);
        }

      });
}

/**
 * Sets up page and calls function to setup form on load.
 */
$(function() {
    setupSelectArtist();
    setupSelectOwner();
    setupSelectExhibit();
    setupForm();
});