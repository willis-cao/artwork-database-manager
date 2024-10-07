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
function setupSelectArtistMultiple() {
    var query = "SELECT * FROM Artist;"
    postToServer(toSQL(query), (response) => {
        var artists = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < artists.length; i++) {
            optionHTML += "<option value=" + artists[i].artist_id + ">" + artists[i].name + "</option>"
        }
        document.getElementById("select-artist-multiple").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Loads a list of all owners into the select (dropdown) menu.
 */
function setupSelectOwnerMultiple() {
    var query = "SELECT * FROM Owner;"
    postToServer(toSQL(query), (response) => {
        var owners = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < owners.length; i++) {
            optionHTML += "<option value=" + owners[i].owner_id + ">" + owners[i].name + "</option>"
        }
        document.getElementById("select-owner-multiple").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Loads a list of all exhibits into the select (dropdown) menu.
 */
function setupSelectExhibitMultiple() {
    var query = "SELECT * FROM Exhibit;"
    postToServer(toSQL(query), (response) => {
        var exhibits = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < exhibits.length; i++) {
            optionHTML += "<option value=" + exhibits[i].exhibit_id + ">" + exhibits[i].title + "</option>"
        }
        document.getElementById("select-exhibit-multiple").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
* Adds a listener to the exhibit search form.
* Validates and sanitizes inputs and displays matching results in a table.
*/
function setupForm() {
    var registerForm = document.getElementById("form-view-artworks");
    registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    var validInput = false;
    const textSearch = document.getElementById("text-search").value;
    const yearCreated = document.getElementById("text-year-created").value;
    const selectArtistMultiple = $('#select-artist-multiple').val(); // Array
    const selectOwnerMultiple = $('#select-owner-multiple').val(); // Array
    const selectExhibitMultiple = $('#select-exhibit-multiple').val(); // Array
    const checkboxDisplayArtworkTitle = document.getElementById("checkbox-display-artwork-title").checked;
    const checkboxDisplayArtworkYear = document.getElementById("checkbox-display-artwork-year").checked;
    const checkboxDisplayArtworkDescription = document.getElementById("checkbox-display-artwork-description").checked;
    const checkboxDisplayArtworkOwner = document.getElementById("checkbox-display-artwork-owner").checked;
    const checkboxDisplayArtistName = document.getElementById("checkbox-display-artist-name").checked;
    const checkboxDisplayArtistBirthYear = document.getElementById("checkbox-display-artist-birth-year").checked;
    const checkboxDisplayArtistDeathYear = document.getElementById("checkbox-display-artist-death-year").checked;
    const checkboxDisplayExhibitTitle = document.getElementById("checkbox-display-exhibit-title").checked;
    const checkboxDisplayExhibitGallery = document.getElementById("checkbox-display-exhibit-gallery").checked;
    const checkboxDisplayExhibitStartDate = document.getElementById("checkbox-display-exhibit-start-date").checked;
    const checkboxDisplayExhibitEndDate = document.getElementById("checkbox-display-exhibit-end-date").checked;

    var args = [checkboxDisplayArtworkTitle, checkboxDisplayArtworkYear, checkboxDisplayArtworkDescription, checkboxDisplayArtworkOwner,
                checkboxDisplayArtistName, checkboxDisplayArtistBirthYear, checkboxDisplayArtistDeathYear,
                checkboxDisplayExhibitTitle, checkboxDisplayExhibitGallery, checkboxDisplayExhibitStartDate, checkboxDisplayExhibitEndDate];

    if (
        ((validator.isAlphanumeric(textSearch, undefined, {ignore:" -"}) && validator.isLength(textSearch, { min: 0, max: 255 })) || validator.isEmpty(textSearch))  &&
        (validator.isDate(yearCreated, { format: "YYYY" }) || validator.isEmpty(yearCreated))
        ) {
        validInput = true;
    } else {
        alert("Input is invalid.");
    }

    if (validInput) {
        var query = "";

        // PART 1: Artworks in exhibits
        query += "SELECT art1.art_id";
        if (checkboxDisplayArtworkTitle) query += ", art1.title AS art_title";
        if (checkboxDisplayArtworkYear) query += ", art1.year_created";
        if (checkboxDisplayArtworkDescription) query += ", art1.description";
        if (checkboxDisplayArtworkOwner) query += ", owner1.name AS owner_name";
        if (checkboxDisplayArtistName) query += ", artist1.name AS artist_name";
        if (checkboxDisplayArtistBirthYear) query += ", artist1.birth_year";
        if (checkboxDisplayArtistDeathYear) query += ", artist1.death_year";
        if (checkboxDisplayExhibitTitle) query += ", exhibit1.title AS exhibit_title";
        if (checkboxDisplayExhibitGallery) query += ", gallery1.name AS gallery_name";
        if (checkboxDisplayExhibitStartDate) query += ", exhibit1.start_date";
        if (checkboxDisplayExhibitEndDate) query += ", exhibit1.end_date";
        query += " FROM Art art1, Artist artist1, Owner owner1, Exhibit exhibit1, Gallery gallery1" +
                 " WHERE art1.artist_id = artist1.artist_id" +
                 " AND art1.owner_id = owner1.owner_id" +
                 " AND art1.exhibit_id = exhibit1.exhibit_id" +
                 " AND exhibit1.gallery_id = gallery1.gallery_id";
        query += " AND (art1.title LIKE '%" + sanitize(textSearch) + "%' OR art1.art_id LIKE '%" + sanitize(textSearch) + "%')";
        for (var i = 0; i < selectArtistMultiple.length; i++) {
            if (selectArtistMultiple.length == 1) {
                query += " AND art1.artist_id = " + selectArtistMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.artist_id = " + selectArtistMultiple[i];
                } else if (i == selectArtistMultiple.length - 1) {
                    query += " OR art1.artist_id = " + selectArtistMultiple[i] + ")";
                } else {
                    query += " OR art1.artist_id = " + selectArtistMultiple[i];
                }
            }              
        }
        for (var i = 0; i < selectOwnerMultiple.length; i++) {
            if (selectOwnerMultiple.length == 1) {
                query += " AND art1.owner_id = " + selectOwnerMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.owner_id = " + selectOwnerMultiple[i];
                } else if (i == selectOwnerMultiple.length - 1) {
                    query += " OR art1.owner_id = " + selectOwnerMultiple[i] + ")";
                } else {
                    query += " OR art1.owner_id = " + selectOwnerMultiple[i];
                }
            }              
        }
        for (var i = 0; i < selectExhibitMultiple.length; i++) {
            if (selectExhibitMultiple.length == 1) {
                query += " AND art1.exhibit_id = " + selectExhibitMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.exhibit_id = " + selectExhibitMultiple[i];
                } else if (i == selectExhibitMultiple.length - 1) {
                    query += " OR art1.exhibit_id = " + selectExhibitMultiple[i] + ")";
                } else {
                    query += " OR art1.exhibit_id = " + selectExhibitMultiple[i];
                }
            }              
        }
        

        //PART 2: Artworks not in exhibits
        query += " UNION ";
        query += "SELECT art1.art_id";
        if (checkboxDisplayArtworkTitle) query += ", art1.title AS art_title";
        if (checkboxDisplayArtworkYear) query += ", art1.year_created";
        if (checkboxDisplayArtworkDescription) query += ", art1.description";
        if (checkboxDisplayArtworkOwner) query += ", owner1.name AS owner_name";
        if (checkboxDisplayArtistName) query += ", artist1.name AS artist_name";
        if (checkboxDisplayArtistBirthYear) query += ", artist1.birth_year";
        if (checkboxDisplayArtistDeathYear) query += ", artist1.death_year";
        if (checkboxDisplayExhibitTitle) query += ", NULL as exhibit_title";
        if (checkboxDisplayExhibitGallery) query += ", NULL as gallery_name";
        if (checkboxDisplayExhibitStartDate) query += ", NULL as start_date";
        if (checkboxDisplayExhibitEndDate) query += ", NULL as end_date";
        query += " FROM Art art1, Artist artist1, Owner owner1" +
                 " WHERE art1.artist_id = artist1.artist_id" +
                 " AND art1.owner_id = owner1.owner_id" +
                 " AND art1.exhibit_id IS NULL";
                //  " AND exhibit1.gallery_id = gallery1.gallery_id";
        query += " AND (art1.title LIKE '%" + sanitize(textSearch) + "%' OR art1.art_id LIKE '%" + sanitize(textSearch) + "%')";
        for (var i = 0; i < selectArtistMultiple.length; i++) {
            if (selectArtistMultiple.length == 1) {
                query += " AND art1.artist_id = " + selectArtistMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.artist_id = " + selectArtistMultiple[i];
                } else if (i == selectArtistMultiple.length - 1) {
                    query += " OR art1.artist_id = " + selectArtistMultiple[i] + ")";
                } else {
                    query += " OR art1.artist_id = " + selectArtistMultiple[i];
                }
            }              
        }
        for (var i = 0; i < selectOwnerMultiple.length; i++) {
            if (selectOwnerMultiple.length == 1) {
                query += " AND art1.owner_id = " + selectOwnerMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.owner_id = " + selectOwnerMultiple[i];
                } else if (i == selectOwnerMultiple.length - 1) {
                    query += " OR art1.owner_id = " + selectOwnerMultiple[i] + ")";
                } else {
                    query += " OR art1.owner_id = " + selectOwnerMultiple[i];
                }
            }              
        }
        for (var i = 0; i < selectExhibitMultiple.length; i++) {
            if (selectExhibitMultiple.length == 1) {
                query += " AND art1.exhibit_id = " + selectExhibitMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (art1.exhibit_id = " + selectExhibitMultiple[i];
                } else if (i == selectExhibitMultiple.length - 1) {
                    query += " OR art1.exhibit_id = " + selectExhibitMultiple[i] + ")";
                } else {
                    query += " OR art1.exhibit_id = " + selectExhibitMultiple[i];
                }
            }              
        }
        query += ";";
        postToServer(toSQL(query), loadTable, undefined, args);
    }

  });
}

/** 
* Handles click event on the Delete buttons.
* @param {*} event
*/
function onClickDelete(event) {
    var currentId = event.currentTarget.artId;
    var divTextIds = event.currentTarget.divTextIds;

    var query = "DELETE FROM Art WHERE art_id = " + currentId + ";";
    if (confirm("Press OK to confirm artwork deletion. This action cannot be reversed.") == true) {
        postToServer(toSQL(query), deleteSuccess, alertDatabaseError, currentId);
    }
}

/**
 * Alerts the user on successful delete.
 * @param {*} response 
 * @param {*} currentId 
 */
function deleteSuccess(response, currentId) {
    var rowIndex = document.getElementById("tr-artwork-" + currentId).rowIndex;
    document.getElementById("table-artworks").deleteRow(rowIndex);

    alert("Artwork successfully deleted.");
}

/**
* Adds onclick listeners to all buttons.
* @param {*} deleteButtons 
* @param {*} args 
*/
function setupButtons(deleteButtons, args) {

    for (var i = 0; i < deleteButtons.length; i++) {
        var divTextIds = [];
        divTextIds.push("div-text-artwork-name-" + deleteButtons[i].id);
        
        document.getElementById(deleteButtons[i].button_id).addEventListener("click", onClickDelete); 
        document.getElementById(deleteButtons[i].button_id).artId = deleteButtons[i].id;
    }

}

/**
* Callback function to load the table after a successful database retrieval.
* @param {*} response 
* @param {*} args 
* @returns 
*/
function loadTable(response, args) {
    document.getElementById("tr-artworks-colnames").innerHTML = null;
    document.getElementById("tbody-artworks").innerHTML = null;

    var data = JSON.parse(response);
    if (data.length == 0) {
        document.getElementById("tbody-artworks").innerHTML = "No results found matching the provided query.";
        return;
    }

    var colnamesHTML = "<th>ID #</th>";
    if (args[0]) colnamesHTML += "<th>Art</th>";
    if (args[1]) colnamesHTML += "<th>Year Created</th>";
    if (args[2]) colnamesHTML += "<th>Desc</th>";
    if (args[3]) colnamesHTML += "<th>Owner</th>";
    if (args[4]) colnamesHTML += "<th>Artist</th>";
    if (args[5]) colnamesHTML += "<th>Birth</th>";
    if (args[6]) colnamesHTML += "<th>Death</th>";
    if (args[7]) colnamesHTML += "<th>Exhibit</th>";
    if (args[8]) colnamesHTML += "<th>Gallery</th>";
    if (args[9]) colnamesHTML += "<th>Exhibit Start</th>";
    if (args[10]) colnamesHTML += "<th>Exhibit End</th>";
    colnamesHTML += "<th>Actions</th>";

    document.getElementById("tr-artworks-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    var deleteButtons = [];
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].art_id;
        tableHTML += "<tr id='tr-artwork-" + currentId + "'>" +
                     "<td id='td-artwork-id-" + currentId + "'>" + data[i].art_id + "</td>";
        if (args[0]) tableHTML += "<td id='td-artwork-art-title-" + currentId + "'><div id='div-text-artwork-art-title-" + currentId + "'>" + replaceUndefined(data[i].art_title) + "</div></td>";
        if (args[1]) tableHTML += "<td id='td-artwork-art-year-created-" + currentId + "'><div id='div-text-artwork-art-year-created-" + currentId + "'>" + replaceUndefined(data[i].year_created) + "</div></td>";
        if (args[2]) tableHTML += "<td id='td-artwork-art-desc-" + currentId + "'><div id='div-text-artwork-art-desc-" + currentId + "'>" + replaceUndefined(data[i].description) + "</div></td>";
        if (args[3]) tableHTML += "<td id='td-artwork-art-owner-" + currentId + "'><div id='div-text-artwork-art-owner-" + currentId + "'>" + replaceUndefined(data[i].owner_name) + "</div></td>";
        if (args[4]) tableHTML += "<td id='td-artwork-artist-name-" + currentId + "'><div id='div-text-artwork-artist-name-" + currentId + "'>" + replaceUndefined(data[i].artist_name) + "</div></td>";
        if (args[5]) tableHTML += "<td id='td-artwork-artist-birth-year-" + currentId + "'><div id='div-text-artwork-artist-birth-year-" + currentId + "'>" + replaceUndefined(data[i].birth_year) + "</div></td>";
        if (args[6]) tableHTML += "<td id='td-artwork-artist-death-year-" + currentId + "'><div id='div-text-artwork-artist-death-year-" + currentId + "'>" + replaceUndefined(data[i].death_year) + "</div></td>";
        if (args[7]) tableHTML += "<td id='td-artwork-exhibit-title-" + currentId + "'><div id='div-text-artwork-exhibit-title-" + currentId + "'>" + replaceUndefined(data[i].exhibit_title) + "</div></td>";
        if (args[8]) tableHTML += "<td id='td-artwork-exhibit-gallery-" + currentId + "'><div id='div-text-artwork-exhibit-gallery-" + currentId + "'>" + replaceUndefined(data[i].gallery_name) + "</div></td>";
        if (args[9]) tableHTML += "<td id='td-artwork-exhibit-start-date-" + currentId + "'><div id='div-text-artwork-exhibit-start-date-" + currentId + "'>" + replaceUndefined(data[i].start_date) + "</div></td>";
        if (args[10]) tableHTML += "<td id='td-artwork-exhibit-end-date-" + currentId + "'><div id='div-text-artwork-exhibit-end-date-" + currentId + "'>" + replaceUndefined(data[i].end_date) + "</div></td>";
        tableHTML += "<td style='width: 150px' id='td-edit-delete-" + currentId + "'>" +
                    "<button class='btn btn-danger' id='button-delete-" + currentId + "'>Delete</button>" +
                    "</td>" +
                    "</tr>"; 
        deleteButtons.push({button_id: "button-delete-" + currentId, id: currentId});
    }

    document.getElementById("tbody-artworks").innerHTML = tableHTML;

    setupButtons(deleteButtons, args);
}

/** 
* Call function to setup search form on page load.
*/
$(function() {
    setupSelectArtistMultiple();
    setupSelectOwnerMultiple();
    setupSelectExhibitMultiple();
    setupForm();
});