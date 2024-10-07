/**
 * Sends a query to the SQL server.
 * Optionally specify callback functions for successes and failures,
 * with optional arguments.
 * Query must be in proper format (use toSQL()).
 * Query must be a single statement (i.e., only one ;).
 * @param {*} query
 * @param {*} callbackSuccess
 * @param {*} callbackFail
 * @param {*} arg1
 * @param {*} arg2
 */
function postToServer(query, callbackSuccess, callbackFail, arg1, arg2) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:3000/sql");
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 200) {
        if (callbackSuccess != undefined) {
            if (arg2 != undefined) {
                callbackSuccess(xhr.responseText, arg1, arg2);
            } else if (arg1 != undefined) {
                callbackSuccess(xhr.responseText, arg1);
            } else {
                callbackSuccess(xhr.responseText);
            }   
        }
	  } else {
        console.log(xhr.status);
        console.log(xhr.responseText);
        if (callbackFail != undefined)
            callbackFail(xhr.responseText);
	  }
	};
	xhr.send(query);
    alert("POST: " + query);
}

function silentPost(query, callbackSuccess, callbackFail, arg1, arg2) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:3000/sql");
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 200) {
        if (callbackSuccess != undefined) {
            if (arg2 != undefined) {
                callbackSuccess(xhr.responseText, arg1, arg2);
            } else if (arg1 != undefined) {
                callbackSuccess(xhr.responseText, arg1);
            } else {
                callbackSuccess(xhr.responseText);
            }   
        }
	  } else {
        console.log(xhr.status);
        console.log(xhr.responseText);
        if (callbackFail != undefined)
            callbackFail(xhr.responseText);
	  }
	};
	xhr.send(query);
    //alert("POST: " + query);
}

/**
 * Sends an multiple SQL queries in the form of an array
 * in succession, one after another.
 * @param {*} response
 * @param {*} queryArray
 * @param {*} callbackFail
 */
function multiPostToServer(response, queryArray, callbackFail) {
    // queryArray in the form
    // [{query: "", func: "", arg1: "", arg2: ""}]
    // * must have same callbackFail
    // * func(response, arg1, arg2) is only called on the last query
    if (queryArray.length == 0) return;

    if (queryArray.length == 1 && queryArray[0].func != undefined) {
        postToServer(toSQL(queryArray[0].query),
                     queryArray[0].func,
                     callbackFail,
                     queryArray[0].arg1,
                     queryArray[0].arg2);
    } else {
        postToServer(toSQL(queryArray[0].query), 
                     multiPostToServer, 
                     callbackFail, 
                     queryArray.slice(1), 
                     callbackFail);
    }
    
}

/**
 * Turns a string into JSON SQL object.
 * @param {*} str
 */
function toSQL(str) {
    return JSON.stringify({
        sql: str
    })
}

/**
 * Function to use with postToServer as callbackFail.
 * @param {*} response
 */
function alertDatabaseError(response) {
    alert(response);
}

/**
 * Adapted from 
 * Escapes all SQL characters in a string.
 * @param {*} str
 */
function sanitize(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}

/**
 * Replaces undefined strings with blank strings.
 * @param {*} str
 */
function replaceUndefined(str) {
    if (str == undefined)
        return "";
    return str;
}

/**
 * Turns a string str into NULL if empty and 'str' otherwise.
 * @param {*} str
 */
function addSingleQuotesOrNULL(str) {
    if (str == "") {
        return "NULL";
    } else {
        return "'" + sanitize(str) + "'";
    }
}

/**
 * Turns an array of inputs into a comma-separated string.
 * Strings gain single quotes.
 * Blank values turn into NULLs.
 * Sanitizes strings for SQL.
 * Use is for inserting into VALUES(str) where str is the return of this function.
 * @param {*} inputArray 
 */
function inputArrayToString(inputArray) {
    var str = "";
    for (var i = 0; i < inputArray.length; i++) {
        const currentInput = inputArray[i];
        if (typeof currentInput === "string" || currentInput instanceof String) {
            if (currentInput == "") {
                str += "NULL";
            } else {
                str += "'" + sanitize(currentInput) + "'";
            }
        } else {
            str += currentInput;
        }
        if (i != inputArray.length - 1) str += ", ";
    }
    return str;
}

export {postToServer, 
        silentPost,
        multiPostToServer, 
        toSQL, 
        alertDatabaseError, 
        sanitize, 
        replaceUndefined, 
        addSingleQuotesOrNULL,
        inputArrayToString};