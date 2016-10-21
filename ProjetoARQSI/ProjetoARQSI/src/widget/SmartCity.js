/// <reference path="../jquery/jquery-ui.js" />
/// <reference path="Util.js" />



var SENSOR_DESIGNATION = "sensor";
var FACET_DESIGNATION = "faceta";
var APP_URL = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/";
var sensorsAPI = APP_URL + "sensores.php";
var facets_ID_link = APP_URL + "facetas.php?" + SENSOR_DESIGNATION + "=";
var facets_name_link = APP_URL + "facetasByNomeSensor.php?" + SENSOR_DESIGNATION + "=";
var facets_values_link = APP_URL + "valoresFacetadoSensor.php?";

var FACET_MIN_VALUE = APP_URL + "minFaceta.php?";
var FACET_MAX_VALUE = APP_URL + "maxFaceta.php?";
var DISCRETE_VALUES_LINK = APP_URL + "valoresFacetadoSensor.php?";
var VALUES_LINK = APP_URL + "valoresDeSensor.php?sensor=";

var RESPONSE_XML = 1;
var RESPONSE_TEXT = 2;

var sensorsArray = [];
var DISCRETE = "discreto";
var CONTINUOUS = "contínuo";
var DATATYPE = "data";
var HOURTYPE = "hora";
var NUMERICTYPE = "numérico";
var ALPHANUMERIC = "alfanumérico";



function smartCity() {
    var widget = document.getElementById("smartCity");
    if (!widget) {
        console.log("SmartCity DIV element not found. Please insert '<div id=\"smartCity\"></div>' somewhere on your webpage.");
        return;
    }
    var leftBar = createDiv("sidebarleftside", "sidebarleftside");

    /* Facets */
    var rightbar = createDiv("sidebarrightside", "sidebarrightside");
    var facetsDiv = createDiv("facetsdivision", "");
    var facetsButton = createArrowButton("facetsbutton", "buttonfacets", "showFacetsMenu()", "Pesquisa por Facetas ");
    var btn_div = createDiv("facetsbuttondiv", "buttondiv");
    btn_div.appendChild(facetsButton);
    var searchButton = createArrowButton("searchbutton", "searchbutton ui-button ui-widget ui-corner-all", "results()", "Ver Resultados");
    var btn_div2 = createDiv("searchBtnDiv", "buttondiv");
    btn_div2.appendChild(searchButton);
    facetsDiv.appendChild(btn_div);
    var facetsmenudiv = createDiv("facetsmenuid");
    facetsDiv.appendChild(facetsmenudiv);
    facetsDiv.appendChild(btn_div2);
    rightbar.appendChild(facetsDiv);

    var div = createDiv("resultsdivison", "resultsdivision");
    var resultsButton = createArrowButton("resultsbutton", "buttonresults", "toggleResults()", "Resultados ");
    var btn_div = createDiv("resultsbuttondiv", "buttondiv");
    btn_div.appendChild(resultsButton);

    var resultsDiv = createDiv("results", "resultsDiv");
    resultsDiv.appendChild(btn_div);
    div.appendChild(resultsDiv);

    rightbar.appendChild(div);
    widget.appendChild(leftBar);
    widget.appendChild(rightbar);

    listSensors();
}


function listSensors() {
    requestAJAX(sensorsAPI, createTabs, RESPONSE_XML, null);
}

function createXmlHttpRequestObject() {
    return new XMLHttpRequest();
}

function requestFacets(sensorName) {
    var uri = facets_name_link;
    uri += sensorName;
    requestAJAX(uri, createFacets, RESPONSE_XML, sensorName);
}

function createTabs(xmlDoc) {
    var allSensors = xmlDoc.getElementsByTagName("sensor");
    var div = document.getElementById("sidebarleftside");
    var ul = document.createElement("ul");
    ul.className = "sidebarmenu nav-bar";
    var sensor;
    for (i = 0; i < allSensors.length; i++) {
        sensor = allSensors[i];

        var sensorID = sensor.id;
        var sensorName = sensor.childNodes[0].childNodes[0].nodeValue;
        var sensorDescription = sensor.childNodes[1].childNodes[0].nodeValue;

        // Create an object for in-memory storage and later reference
        var sensorObj = Sensor(sensorID, sensorName, sensorDescription);
        sensorsArray.push(sensorObj);

        var sensorNameNode = document.createTextNode(sensorName.replace(/_/g, " "));
        var a = document.createElement("a");
        a.appendChild(sensorNameNode);
        a.id = i;
        a.href = "#";
        a.className = "link";
        a.setAttribute("onclick", "showFacetsFromSensor(event, \"" + sensorName + "\")");
        var li = document.createElement("li");
        li.className = "sidebarmenulink";
        li.appendChild(a);
        ul.appendChild(li);
        div.appendChild(ul);
        // For each sensor we're adding as a tab, we need to
        // create a tabcontent DIV on the webpage which will be hidden by default
        //requestFacets(sensorName);
    }
    document.getElementsByClassName("link")[0].click();
    return allSensors.length;
}


function showFacetsFromSensor(evt, sensorName) {
    var i, tabcontent, tablinks;

    if (evt.currentTarget.className.indexOf("active") !== -1)
        return;

    // Hide all currently existant tabcontent div's
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Set all tab links as inactive
    tablinks = document.getElementsByClassName("link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // set selected tab link as active
    evt.currentTarget.className += " active";

    // If theres a 'facetsmenuid' child with id=sensorName
    // lets make it visible and leave
    var sensorDiv = document.getElementById(sensorName + "_facets");
    if (sensorDiv)
        showDiv(sensorDiv);
    else
        requestFacets(sensorName);

    showHideResults();
    resetFacetButtonArrow();
}


function showFacetsMenu() {
    var facetsmenu = document.getElementById("facetsmenuid");
    rotateFacetButtonArrow();
    var btnDiv = document.getElementById("searchBtnDiv");
    toggleVisibility(btnDiv);
    toggleVisibility(facetsmenu);
}

function rotateFacetButtonArrow() {
    var span = $("#facetsbutton > span")[0];
    if (span.className.indexOf("active") !== -1)
        span.className = span.className.replace(" active", "");
    else
        span.className += " active";
}

function resetFacetButtonArrow() {
    var span = $("#facetsbutton > span")[0];
    if (span.className.indexOf("active") !== -1)
        span.className = span.className.replace(" active", "");
}

function createFacets(facetsXML, sensorName) {
    var sensorObj = findSensorByName(sensorName);
    var maindivison = document.getElementById("facetsmenuid");
    var facets = facetsXML.getElementsByTagName("Faceta");
    var sensorFacetsDiv = createDiv(sensorObj.name + "_facets", "tabcontent");
    sensorFacetsDiv.style.display = "none";

    for (var i = 0; i < facets.length; i++) {

        var id = facets[i].id;
        var dbField = facets[i].childNodes[0].childNodes[0].nodeValue;
        var name = facets[i].childNodes[1].childNodes[0].nodeValue;
        var measure = facets[i].childNodes[2].childNodes[0].nodeValue;
        var type = facets[i].childNodes[3].childNodes[0].nodeValue;
        var semantic = facets[i].childNodes[4].childNodes[0].nodeValue;

        var facetObj = Facet(sensorObj, id, dbField, name, measure, type, semantic);
        // Store facet on sensors vector
        sensorObj.facets.push(facetObj);

        var cb_Div = createCheckBox("facetsdivision", dbField, name, id, name, facetObj);
        sensorFacetsDiv.appendChild(cb_Div);
    }
    maindivison.appendChild(sensorFacetsDiv);
    showDiv(sensorFacetsDiv);
}

function showFacetOptions(div, facetObj) {
    var optionsDiv = div.getElementsByClassName("facetoptions")[0];
    if (optionsDiv) {
        if (optionsDiv.style.display === "block")
            optionsDiv.style.display = "none";
        else
            optionsDiv.style.display = "block";
    } else {
        createFacet(facetObj, div);
    }
}

function createFacet(facetObj, facetDiv) {
    var measure = facetObj.measure;
    var typeOf = facetObj.type;

    if (measure === CONTINUOUS) {
        if (typeOf === DATATYPE) {
            createReadDate(facetObj, facetDiv);
        }
        else if (typeOf === HOURTYPE) {
            createReadHour(facetObj, facetDiv);
        }
        else if (typeOf === NUMERICTYPE) {
            createReadNumericType(facetObj, facetDiv);
        }

        else if (typeOf === ALPHANUMERIC) {
            createSelectAlphaNumericType(facetObj, facetDiv);
        }

    }

    else if (measure === DISCRETE) {
        if (typeOf === ALPHANUMERIC) {
            createSelectAlphaNumericType(facetObj, facetDiv);
        }
    }
}



function getMaxPossibleValue(facetObj, div) {
    var link = FACET_MAX_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
    requestAJAX(link, getMaxLimitValue, RESPONSE_TEXT, div);
}

function getMaxLimitValue(txtDocument, div) {
    var result = JSON.parse(txtDocument);
    var max = parseFloat(result.max);
    if (isNaN(max)) {
        return;
    }
    $("#" + div.id).slider("option", "max", max);
    $("#" + div.id).slider("values", 1, max);
    $("#" + div.id + "_interval").val($("#" + div.id).slider("values", 0) +
      " - " + max);

}


function getMinPossibleValue(facetObj, div) {
    var link = FACET_MIN_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
    requestAJAX(link, getMinLimitValue, RESPONSE_TEXT, div);
}

function getMinLimitValue(txtDocument, div) {
    var result = JSON.parse(txtDocument);
    var min = parseFloat(result.min);
    if (isNaN(min)) {
        return;
    }
    $("#" + div.id).slider("option", "min", min);
    $("#" + div.id).slider("values", 0, min);
    $("#" + div.id + "_interval").val(min +
      " - " + $("#" + div.id).slider("values", 1));
}

// DATA facet
function createReadDate(facetObj, facetDiv) {
    var from = document.createTextNode("De: ");
    var to = document.createTextNode("Até: ");
    var p = document.createElement("p");
    var div = document.createElement("div");
    div.id = facetObj.id;
    div.className = "facetoptions";
    div.style.border = 'none';
    div.style.display = "block";
    div.appendChild(from);
    div.appendChild(getCurrentDateForm());
    div.appendChild(p);
    div.appendChild(to);
    div.appendChild(getCurrentDateForm());
    showDiv(div);
    facetDiv.appendChild(div);
}

// HORA facet
function createReadHour(facetObj, facetDiv) {
    var from = document.createTextNode("De: ");
    var to = document.createTextNode("Até: ");
    var p = document.createElement("p");
    var div = document.createElement("div");
    div.id = facetObj.id;
    div.className = "facetoptions";
    div.style.border = 'none';
    div.style.display = "block";
    div.appendChild(from);
    div.appendChild(getCurrentHourForm());
    div.appendChild(p);
    div.appendChild(to);
    div.appendChild(getCurrentHourForm());
    showDiv(div);
    facetDiv.appendChild(div);
}


function createReadNumericType(facetObj, facetDiv) {
    var mainDiv = document.createElement("div");
    mainDiv.id = facetObj.id;
    mainDiv.className = "facetoptions";
    mainDiv.style.border = 'none';
    mainDiv.style.display = "block";
    mainDiv.style.overflow = "hidden";
    var p = document.createElement("p");
    var label = document.createElement("label");
    label.htmlFor = "interval";
    var text = document.createTextNode("Intervalo: ");
    label.appendChild(text);
    var input = document.createElement("input");
    input.type = "text";
    input.readOnly = true;
    input.style = "border:0;width:60%;";
    p.appendChild(label);
    p.appendChild(input);
    mainDiv.appendChild(p);

    var div = document.createElement("div");
    mainDiv.appendChild(div);
    facetDiv.appendChild(mainDiv);
    div.id = facetObj.sensor.name + "_" + facetObj.id + "_slider";
    input.id = div.id + "_interval";

    // Double handle slider using JQueryUI
    $("#" + div.id).slider({
        range: true,
        min: 0,
        max: 1000,
        values: [0, 1],
        step: 0.000001,
        slide: function (event, ui) {
            $("#" + div.id + "_interval").val(ui.values[0] + " - " + ui.values[1]);
        }
    });

    $("#" + div.id + "_interval").val($("#" + div.id).slider("values", 0) +
      " - " + $("#" + div.id).slider("values", 1));

    getMinPossibleValue(facetObj, div);
    getMaxPossibleValue(facetObj, div);
}

function createSelectAlphaNumericType(facetObj, facetDiv) {
    var div = document.createElement("div");
    div.className = "facetoptions";
    div.style.border = 'none';
    div.style.display = "block";
    facetDiv.appendChild(div);
    getDiscreteValues(facetObj, div);
    //facetDiv.appendChild(div);
}

function getDiscreteValues(facetObj, div) {
    var link = DISCRETE_VALUES_LINK + SENSOR_DESIGNATION + "=" + facetObj.sensor.name + "&" + FACET_DESIGNATION + "=" + facetObj.dbField;
    console.log(link);
    requestAJAX(link, createAllOptionsInput, RESPONSE_TEXT, div);
}

function createAllOptionsInput(txtDocument, div) {
    var results = JSON.parse(txtDocument);

    for (var i = 0; i < results.length; i++) {
        var individualDiv = document.createElement("div");
        individualDiv.style.border = 'none';
        var text = document.createTextNode(results[i]);
        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = "singular";
        individualDiv.appendChild(input);
        individualDiv.appendChild(text);
        div.appendChild(individualDiv);
    }
}


//RESULTS
function results() {
    var str = "";
    showHideResults();
    var ref_array = document.getElementsByClassName("link active");
    var ref = ref_array[0];
    var n = ref.id;
    var sensor = ref.childNodes[0].nodeValue;
    var sensorName = sensor.replace(/ /g, "_");
    var str = filter(sensorName, n);

    var link = VALUES_LINK + sensorName + str;
    requestAJAX(link, handlePeriodInfo, RESPONSE_TEXT, sensorName, n);
}

/*
This method allow to filter Results by providing a portion of the link*/
function filter(sensorName, n) {
    var str = "";
    var id = sensorName + "_facets";
    var div = document.getElementById(id);
    var checkbox_array = div.getElementsByTagName("input");
    for (var i = 0; i < checkbox_array.length; i++) {
        if (checkbox_array[i].id == "1" || checkbox_array[i].id == "2") {
            continue;
        }
        if (checkbox_array[i].checked) {
            for (var t = 0; t < sensorsArray[n].facets.length; t++) {
                var checkId = sensorsArray[n].facets[t].id;
                var checkMeasure = sensorsArray[n].facets[t].measure;
                var checkType = sensorsArray[n].facets[t].type;
                //This is required because of continual alphanumerical exception.
                if ((checkbox_array[i].id == checkId && checkMeasure == DISCRETE) ||
                    (checkbox_array[i].id == checkId && checkMeasure == CONTINUOUS &&
                    checkType == ALPHANUMERIC)) {
                    var name = checkbox_array[i].name.split(" ")[0];
                    str += "&" + name + "=[";
                    var parentElem = checkbox_array[i].parentElement.parentElement; //div parent.
                    var elements = parentElem.getElementsByTagName("input");
                    for (var j = 1; j < elements.length; j++) {//ignores the first one always. It belongs to the major checkbox.
                        if (elements[j].checked) {
                            var info = elements[j].nextSibling.nodeValue;
                            str += info + ","
                        }
                    }
                    str += "]";
                } else if (checkbox_array[i].id == sensorsArray[n].facets[t].id && sensorsArray[n].facets[t].measure == CONTINUOUS) {
                    //API NOT PREPARED TO RECEIVE CONTINUOS VALUES.
                }
            }
        }
    }
    return str;
}

/*
Checks which checkbox is selected
*/
function handlePeriodInfo(txtDocument, sensorName, n) {
    var resultObj = JSON.parse(txtDocument);
    var id = sensorName + "_facets";
    var div = document.getElementById(id);
    var checkbox_array = div.getElementsByTagName("input");
    var divLocation = document.getElementById("results");
    hideDiv(divLocation); //start div as hidden.
    buildFullTable(resultObj, divLocation, n);
    for (var i = 0; i < checkbox_array.length; i++) {
        if (checkbox_array[i].checked) {
            for (var t = 0; t < sensorsArray[n].facets.length; t++) {
                var checkId = sensorsArray[n].facets[t].id;
                var checkMeasure = sensorsArray[n].facets[t].measure;
                var checkType = sensorsArray[n].facets[t].type;
                if (checkbox_array[i].id == checkId &&
                    checkMeasure == CONTINUOUS && checkType != ALPHANUMERIC) {
                    var div = checkbox_array[i].parentElement.nextElementSibling;
                    var col = t;
                    filterResults(div, divLocation, col);
                }
            }
        }
    }
    showDiv(divLocation);
}

/*
Specifies the type of Data.*/
function filterResults(div, divLocation, col) {
    var initialValue, finalValue;

    var slider = div.getElementsByClassName("ui-slider")[0];
    if (slider) {
        initialValue = $("#" + slider.id).slider("values", 0);
        finalValue = $("#" + slider.id).slider("values", 1);
    } else {
        var array = div.getElementsByTagName("input");
        initialValue = array[0].value;
        finalValue = array[1].value;
        //For when the max value is obtained first than the min value.
        if (finalValue < initialValue) {
            var temp = initialValue;
            initialValue = finalValue;
            finalValue = temp;
        }
    }
    filterContinuosValues(initialValue, finalValue, divLocation, col);
}

/*
Show results in list according to the interval passed in parameteres.*/
function filterContinuosValues(initialValue, finalValue, divLocation, col) {
    var flag, c;
    flag = 0; c = 0;
    var rows = divLocation.getElementsByTagName("tr");  //all rows.
    loop1:
        for (var i = 0; i < rows.length; i++) {
            if (flag != 0) break loop1;
            var row = rows[i];
            var row_ = row.childNodes;
            loop2:
                for (var j = 0; j < row_.length; j++) { //each cell from first row.
                    if (j == col) {
                        c = j; //saves column index to work on.
                        flag++;
                        if (col == 1) { //this is specific.
                            initialValue = initialValue + ":00";
                            finalValue = finalValue + ":00";
                        }
                        break loop2;
                    }
                }
        }
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var row_ = row.childNodes;
        var value = row_[c].childNodes[0].nodeValue;
        if (value < initialValue || value > finalValue) {
            var table = divLocation.getElementsByTagName("table")[0];
            table.removeChild(table.childNodes[i]); //deletes row in the current position.
            i--;
        }
    }
}

/*
This method builds full table without any filtering*/
function buildFullTable(resultObj, divLocation, n) { //id do sensor ativo.
    var count = 0;
    var order = sensorsArray[n].facets;
    divLocation.style.overflow = 'initial';
    //while (divLocation.hasChildNodes()) {
    //    divLocation.removeChild(divLocation.lastChild);
    //}
    showHideResults();
    var div = createDiv("resultsTable", "ui-table");
    var table = document.createElement("table");
    var tableHeaderRow = document.createElement("tr");
    var names = Object.getOwnPropertyNames(resultObj[0]); //allign order with names.

    for (var j = 0; j < order.length; j++) {
        for (var i = 0; i < names.length; i++) {
            if (order[j].dbField == names[i]) {
                var th = document.createElement("th");
                var text = document.createTextNode(names[i].replace(/_/g, " "));
                th.appendChild(text);
                tableHeaderRow.appendChild(th);
                break;
            }
        }
        table.appendChild(tableHeaderRow);
    }

    for (var i = 0; i < resultObj.length; i++) { //each row.
        count++;
        var tr = document.createElement("tr");
        var singleObj = resultObj[i]; // entire row content.
        for (var j = 0; j < order.length; j++) { //each facet.
            for (var p in singleObj) { //each value.
                if (order[j].dbField == p) {
                    var td = document.createElement("td");
                    var text = document.createTextNode(singleObj[p]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
            } table.appendChild(tr);
        }
    }
    div.appendChild(table);
    div.style.border = "none";
    div.style.height = "500px";
    styleTable(div);
    divLocation.appendChild(div);
    console.log("Results: " + count);
}

function showHideResults() {
    var maindiv = document.getElementById("results");
    if (maindiv.childNodes[1] != null) {
        maindiv.removeChild(maindiv.childNodes[1]);
    }
}


function findSensorByName(sensorName) {
    var sensorIdx = -1;
    for (var i = 0; i < sensorsArray.length; i++) {
        if (sensorsArray[i].name === sensorName) {
            sensorIdx = i;
            break;
        }
    }
    return sensorsArray[sensorIdx];
}


function toggleResults() {
    var resultsDiv = document.getElementById("resultsTable");
    if (resultsDiv)
        toggleVisibility(resultsDiv);
}