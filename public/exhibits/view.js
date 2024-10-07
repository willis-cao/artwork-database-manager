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
function setupSelectGalleryMultiple() {
    var query = "SELECT * FROM Gallery;"
    postToServer(toSQL(query), (response) => {
        var galleries = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < galleries.length; i++) {
            optionHTML += "<option value=" + galleries[i].gallery_id + ">" + galleries[i].name + "</option>"
        }
        document.getElementById("select-gallery-multiple").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
* Adds a listener to the exhibit search form.
* Validates and sanitizes inputs and displays matching results in a table.
*/
function setupForm() {
    var registerForm = document.getElementById("form-view-exhibits");
    registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    var validInput = false;
    const textSearch = document.getElementById("text-search").value;
    const selectGalleryMultiple = $('#select-gallery-multiple').val(); // Array
    alert(selectGalleryMultiple.length);
    const dateStart = document.getElementById("date-start").value;
    const dateEnd = document.getElementById("date-end").value;
    const checkboxDisplayGallery = document.getElementById("checkbox-display-gallery").checked;
    const checkboxDisplayStartDate = document.getElementById("checkbox-display-start-date").checked;
    const checkboxDisplayEndDate = document.getElementById("checkbox-display-end-date").checked;
    var args = [checkboxDisplayGallery, checkboxDisplayStartDate, checkboxDisplayEndDate];

    if (
        ((validator.isAlphanumeric(textSearch, undefined, {ignore:" -"}) && validator.isLength(textSearch, { min: 0, max: 255 })) || validator.isEmpty(textSearch))  &&
        (validator.isDate(dateStart, { format: "YYYY-MM-DD" }) || validator.isEmpty(dateStart)) &&
        (validator.isDate(dateEnd, { format: "YYYY-MM-DD" }) || validator.isEmpty(dateEnd))
        ) {
        validInput = true;
    } else {
        alert("Input is invalid.");
    }

    if (validInput) {
        var query = "";

        query += "SELECT e.exhibit_id, e.title";
        if (checkboxDisplayGallery) query += ", g.name";
        if (checkboxDisplayStartDate) query += ", e.start_date";
        if (checkboxDisplayEndDate) query += ", e.end_date";
        query += " FROM Exhibit e, Gallery g WHERE e.gallery_id = g.gallery_id";
        query += " AND (e.title LIKE '%" + sanitize(textSearch) + "%' OR e.exhibit_id LIKE '%" + sanitize(textSearch) + "%')";
        for (var i = 0; i < selectGalleryMultiple.length; i++) {
            if (selectGalleryMultiple.length == 1) {
                query += " AND g.gallery_id = " + selectGalleryMultiple[i];
            } else {
                if (i == 0) {
                    query += " AND (g.gallery_id = " + selectGalleryMultiple[i];
                } else if (i == selectGalleryMultiple.length - 1) {
                    query += " OR g.gallery_id = " + selectGalleryMultiple[i] + ")";
                } else {
                    query += " OR g.gallery_id = " + selectGalleryMultiple[i];
                }
            }              
        }
        if (dateStart != "") query += " AND start_date = '" + dateStart + "'";
        if (dateEnd != "") query += " AND end_date = '" + dateEnd + "'";
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
    var currentId = event.currentTarget.exhibitId;
    var divTextIds = event.currentTarget.divTextIds;

    var query = "DELETE FROM Exhibit WHERE exhibit_id = " + currentId + ";";
    if (confirm("Press OK to confirm exhibit deletion. This action cannot be reversed.") == true) {
        postToServer(toSQL(query), deleteSuccess, alertDatabaseError, currentId);
    }
}

/**
 * Alerts the user on successful delete.
 * @param {*} response 
 * @param {*} currentId 
 */
function deleteSuccess(response, currentId) {
    var rowIndex = document.getElementById("tr-exhibit-" + currentId).rowIndex;
    document.getElementById("table-exhibits").deleteRow(rowIndex);

    alert("Exhibit successfully deleted.");
}

/**
* Adds onclick listeners to all buttons.
* @param {*} deleteButtons 
* @param {*} args 
*/
function setupButtons(deleteButtons, args) {

    for (var i = 0; i < deleteButtons.length; i++) {
        var divTextIds = [];
        divTextIds.push("div-text-exhibit-name-" + deleteButtons[i].id);
        
        document.getElementById(deleteButtons[i].button_id).addEventListener("click", onClickDelete); 
        document.getElementById(deleteButtons[i].button_id).exhibitId = deleteButtons[i].id;
    }

}

/**
* Callback function to load the table after a successful database retrieval.
* @param {*} response 
* @param {*} args 
* @returns 
*/
function loadTable(response, args) {
    document.getElementById("tr-exhibits-colnames").innerHTML = null;
    document.getElementById("tbody-exhibits").innerHTML = null;

    var data = JSON.parse(response);
    if (data.length == 0) {
        document.getElementById("tbody-exhibits").innerHTML = "No results found matching the provided query.";
        return;
    }

    var colnamesHTML = "<th>ID #</th><th>Title</th>";
    if (args[0]) colnamesHTML += "<th>Gallery Name</th>";
    if (args[1]) colnamesHTML += "<th>Start Date</th>";
    if (args[2]) colnamesHTML += "<th>End Date</th>";
    colnamesHTML += "<th>Actions</th>";

    document.getElementById("tr-exhibits-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    var deleteButtons = [];
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].exhibit_id;
        tableHTML += "<tr id='tr-exhibit-" + currentId + "'>" +
                     "<td id='td-exhibit-id-" + currentId + "'>" + data[i].exhibit_id + "</td>" +
                     "<td id='td-exhibit-title-" + currentId + "'>" + data[i].title + "</td>";
        if (args[0]) tableHTML += "<td id='td-exhibit-gallery-name-" + currentId + "'><div id='div-text-exhibit-gallery-name-" + currentId + "'>" + replaceUndefined(data[i].name) + "</div></td>";
        if (args[1]) tableHTML += "<td id='td-exhibit-start-date-" + currentId + "'><div id='div-text-exhibit-start-date-" + currentId + "'>" + replaceUndefined(data[i].start_date) + "</div></td>";
        if (args[2]) tableHTML += "<td id='td-exhibit-end-date-" + currentId + "'><div id='div-text-exhibit-end-date-" + currentId + "'>" + replaceUndefined(data[i].end_date) + "</div></td>";
        tableHTML += "<td style='width: 150px' id='td-edit-delete-" + currentId + "'>" +
                    "<button class='btn btn-danger' id='button-delete-" + currentId + "'>Delete</button>" +
                    "</td>" +
                    "</tr>"; 
        deleteButtons.push({button_id: "button-delete-" + currentId, id: currentId});
    }

    document.getElementById("tbody-exhibits").innerHTML = tableHTML;

    setupButtons(deleteButtons, args);
}

/** 
* Call function to setup search form on page load.
*/
$(function() {
    setupSelectGalleryMultiple();
    setupForm();
});