
/* JQUERY reference */
/// <reference path="jquery/jquery-3.1.1.min.js" />

var TOGGLE_VISIB_ANIM_DURATION = 500;

/************************
 AJAX

 *************************/
function requestAJAX(uri, handler, responseType, extraParam, extraParam2) {
    var result;
    var xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {
        xmlHttpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                if (responseType == RESPONSE_XML) {
                    if (extraParam2 == null && extraParam == null) {
                        handler(xmlHttpObj.responseXML);
                    } else if (extraParam2 == null) {
                        handler(xmlHttpObj.responseXML, extraParam);
                    } else {
                        handler(xmlHttpObj.responseXML, extraParam, extraParam2);
                    }

                } else if (responseType == RESPONSE_TEXT) {
                    if (extraParam2 == null && extraParam == null) {
                        handler(xmlHttpObj.responseText);

                    } else if (extraParam2 == null) {
                        handler(xmlHttpObj.responseText, extraParam);
                    } else {
                        handler(xmlHttpObj.responseText, extraParam, extraParam2);
                    }

                }
            }
        };
        xmlHttpObj.open("GET", uri, true);
        xmlHttpObj.send(null);

    }

}


/*******************
 DIV VISIBILTY
 ********************/

function toggleVisibility(div) {
    if (div.style.display === "none")
        $("#" + div.id).show(TOGGLE_VISIB_ANIM_DURATION);
    else
        $("#" + div.id).hide(TOGGLE_VISIB_ANIM_DURATION);
}

function showDiv(div) {
    if (div.style.display === "none")
        $("#" + div.id).show(TOGGLE_VISIB_ANIM_DURATION);
}

function hideDiv(div) {
    if (div.style.display !== "none")
        $("#" + div.id).hide(TOGGLE_VISIB_ANIM_DURATION);
}


/*************************
 ELEMENT CREATORS
 **************************/
function createCheckBox(divClass, divID, labelText, inputID, inputName, facetObj) {
    var div = document.createElement("div");
    div.className = divClass;
    div.id = divID;
    var label = document.createElement("label");
    label.htmlFor = inputID;
    label.nodeValue = labelText;
    //disables text selection on double click.
    label.addEventListener('mousedown', function (e) {
        e.preventDefault();
    }, false);
    var input = document.createElement("input");
    input.id = inputID;
    input.name = inputName;
    input.type = "checkbox";
    input.onchange = function () {
        showFacetOptions(div, facetObj);
    };
    var text = document.createTextNode(labelText);
    label.appendChild(input);
    label.appendChild(text);
    div.appendChild(label);
    return div;
}

function createDiv(id, classes) {
    var div = document.createElement("div");
    div.id = id;
    if (classes != null && classes.length > 0)
        div.className = classes;
    return div;
}

function createButton(id, classes, clickHandler, text) {
    var button = document.createElement("button");
    button.id = id;
    button.className = classes;
    button.onclick = clickHandler;
    button.setAttribute('onclick', clickHandler);
    if (text != null && text.length != 0)
        button.appendChild(document.createTextNode(text));
    return button;
}


function createArrowButton(id, classes, clickHandler, text) {
    var button = createButton(id, classes, clickHandler, "");
    var span = document.createElement("span");
    span.className = "ui-button-text";
    span.appendChild(document.createTextNode(text));
    button.appendChild(span);
    return button;
}

/***************************
 DATE UTILS
 ****************************/

function getCurrentDateForm() {
    var current = new Date();
    var d = current.getDate();
    var m = current.getMonth() + 1;
    var y = current.getFullYear();
    if (d < 10) {
        d = '0' + d
    }
    if (m < 10) {
        m = '0' + m
    }
    current = y + '-' + m + '-' + d;
    var form = document.createElement("form");
    var input = document.createElement("input");
    input.type = "date";
    input.value = current;
    form.appendChild(input);
    return form;
}

function getCurrentHourForm() {
    var current = new Date();
    var h = current.getHours();
    var m = current.getMinutes();
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    current = h + ':' + m;
    var form = document.createElement("form");
    var input = document.createElement("input");
    input.type = "time";
    input.name = "readTime";
    input.value = current;
    form.appendChild(input);
    return form;
}

/************************
 ELEMENT STYLING
 *************************/

function styleTable(div) {
    var table = div.getElementsByTagName('table');
    table[0].style.borderCollapse = 'collapse';
    table[0].style.border = '1px solid #ddd';

    var tds = div.getElementsByTagName('td');
    for (var i = 0; i < tds.length; i++) {
        var td = tds[i];
        td.style.padding = '15px';
        td.style.border = '1px solid #ddd';

    }

    var trs = div.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];

        tr.style.border = '1px solid #ddd';
    }

    var ths = div.getElementsByTagName('th');
    for (var i = 0; i < ths.length; i++) {
        var th = ths[i];
        th.style.padding = '15px';
        th.style.background = '#1F75ff';
        th.style.color = 'white';
        th.style.border = '1px solid #ddd';
    }
}

/*********************************
 *
 * BUTTON ANIMATION
 *
 **********/
function rotateButtonArrow(span) {
    if (span.className.indexOf("active") !== -1)
        span.className = span.className.replace(" active", "");
    else
        span.className += " active";
}

function resetButtonArrow(span) {
    if (span.className.indexOf("active") !== -1)
        span.className = span.className.replace(" active", "");
}