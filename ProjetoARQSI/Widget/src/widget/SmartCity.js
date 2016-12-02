/// <reference path="../jquery/jquery-ui.js" />
/// <reference path="Util.js" />

/* DEEBUG: 1 = ON */
var DEBUG = 0;

var CANCELA_SENSORS = "https://localhost:44317/api/sensores";
var CANCELA_DISCRETE_FACET_VALUES = CANCELA_SENSORS + "/DiscreteValues?";
var CANCELA_FACET_MIN_VALUE = CANCELA_SENSORS + "/MinValue?";
var CANCELA_FACET_MAX_VALUE = CANCELA_SENSORS + "/MaxValue?";
var CANCELA_SENSOR_VALUES = CANCELA_SENSORS + "/SensorValues?";



var SENSOR_DESIGNATION = "sensor";
var FACET_DESIGNATION = "faceta";
//var APP_URL = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/";
/* IP ADDRESS INSTEAD OF DNS USED WHILE DEVELOPING USING SPLIT TUNNELING TO DEI VPN */
var APP_URL = "http://10.8.8.20/~arqsi/smartcity/";
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

var column = 0;


function smartCity() {
	var widget = document.getElementById("smartCity");
	if (!widget) {
		console.log("SmartCity DIV element not found. Please insert '<div id=\"smartCity\"></div>' somewhere on your webpage.");
		return;
	}
	var leftBar = createDiv("sidebarleftside", "sidebarleftside");
	var ul = document.createElement("ul");
	ul.className = "sidebarmenu nav-bar";
	leftBar.appendChild(ul);

	/* Facets */
	var rightbar = createDiv("sidebarrightside", "sidebarrightside");
	var facetsDiv = createDiv("facetsdivision", "facetsdivision");
	var facetsButton = createArrowButton("facetsbutton", "buttonfacets", "toggleFacetsMenu()", "Pesquisa por Facetas ");
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
	resultsDiv.style.display = "none";
	div.appendChild(resultsDiv);

	rightbar.appendChild(div);
	widget.appendChild(leftBar);
	widget.appendChild(rightbar);

	listSensors();
}


function listSensors() {
	requestAJAX(sensorsAPI, createTabs, RESPONSE_XML, null);
	requestAJAX(CANCELA_SENSORS, createTabs, RESPONSE_XML, null);
}

function createXmlHttpRequestObject() {
	return new XMLHttpRequest();
}

function requestFacets_Cancela(sensorObj) {
	var uri = CANCELA_SENSORS + "/" + sensorObj.id;
	requestAJAX(uri, createFacets, RESPONSE_TEXT, sensorObj.name);

}

function requestFacets(sensorName) {
	if (sensorName === "Meteorologia") {
		var sensorId = findSensorByName(sensorName).id;
		var uri = CANCELA_SENSORS + "/" + sensorId;
	} else {
		var uri = facets_name_link;
		uri += sensorName;
	}
	requestAJAX(uri, createFacets, RESPONSE_XML, sensorName);
}

function createTabs_Cancela(jsonDoc) {
	var div = document.getElementById("sidebarleftside");
	var ul = div.childNodes[0];
	var results = JSON.parse(jsonDoc);
	if (DEBUG === 1)
	    console.log("object: %O", results);
	var sensor;
	for (var i = 0; i < results.length; i++) {
		sensor = results[i];
		var sensorObj = Sensor(sensor.id, sensor.nome, sensor.descricao);
		sensorsArray.push(sensorObj);
		var tab = getNewTab(sensorObj);
		ul.appendChild(tab);
		requestFacets_Cancela(sensorObj);
	}
}

function createTabs(xmlDoc) {
	var allSensors = xmlDoc.getElementsByTagName("sensor");
	if (allSensors.length === 0)
		allSensors = xmlDoc.getElementsByTagName("Sensor");
	if (allSensors.length === 0)
		return;
	var div = document.getElementById("sidebarleftside");
	var ul = div.childNodes[0];
	var sensor;

	for (i = 0; i < allSensors.length; i++) {
		sensor = allSensors[i];
		var sensorID = sensor.id;
		var sensorName = sensor.childNodes[0].childNodes[0].nodeValue;
		var sensorDescription = sensor.childNodes[1].childNodes[0].nodeValue;

		// Create an object for in-memory storage and later reference
		var sensorObj = Sensor(sensorID, sensorName, sensorDescription);
		sensorsArray.push(sensorObj);
		var tab = getNewTab(sensorObj);
		ul.appendChild(tab);
	}
	// Show the first sensor's facets...
	document.getElementsByClassName("link")[0].click();
	return allSensors.length;
}

function getNewTab(sensor) {

	var sensorNameNode = document.createTextNode(sensor.name.replace(/_/g, " "));
	var a = document.createElement("a");
	a.appendChild(sensorNameNode);
	a.id = sensor.id;
	a.href = "#/";
	a.className = "link";
	a.setAttribute("onclick", "showFacetsFromSensor(event, \"" + sensor.name + "\")");
	var li = document.createElement("li");
	//		li.className = "sidebarmenulink";
	li.appendChild(a);
	return li;

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

	clearResults();
	showFacetsMenu();
}


function showFacetsMenu() {
	var facetsmenu = document.getElementById("facetsmenuid");
	var span = $("#facetsbutton > span")[0];
	resetButtonArrow(span);
	var btnDiv = document.getElementById("searchBtnDiv");
	showDiv(btnDiv);
	showDiv(facetsmenu);
}

function toggleFacetsMenu() {
	var facetsmenu = document.getElementById("facetsmenuid");
	var span = $("#facetsbutton > span")[0];
	rotateButtonArrow(span);
	var btnDiv = document.getElementById("searchBtnDiv");
	toggleVisibility(btnDiv);
	toggleVisibility(facetsmenu);
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

		var cb_Div = createCheckBox("singlefacet", dbField, name, id, name, facetObj);
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
		} else if (typeOf === HOURTYPE) {
			createReadHour(facetObj, facetDiv);
		} else if (typeOf === NUMERICTYPE) {
			createReadNumericType(facetObj, facetDiv);
		} else if (typeOf === ALPHANUMERIC) {
			createSelectAlphaNumericType(facetObj, facetDiv);
		}

	} else if (measure === DISCRETE) {
		if (typeOf === ALPHANUMERIC) {
			createSelectAlphaNumericType(facetObj, facetDiv);
		}
	}
}



function getMaxPossibleValue(facetObj, div) {
	if (facetObj.sensor.name === "Meteorologia") {
		var link = CANCELA_FACET_MAX_VALUE + "sensorId=" + facetObj.sensor.id + "&facetaId=" + facetObj.id;
	} else {
		var link = FACET_MAX_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
	}
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
	if (facetObj.sensor.name === "Meteorologia") {
		var link = CANCELA_FACET_MIN_VALUE + "sensorId=" + facetObj.sensor.id + "&facetaId=" + facetObj.id;
	} else {
		var link = FACET_MIN_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
	}
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
	facetDiv.appendChild(div);
	showDiv(div);
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
	var p = document.createElement("p");
	var label = document.createElement("label");
	label.htmlFor = "interval";
	var text = document.createTextNode("Intervalo: ");
	label.appendChild(text);
	label.style.color = 'darkgray';
	var input = document.createElement("input");
	input.type = "text";
	input.readOnly = true;
	input.style = "border:0;width:60%;font:inherit";
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
	var link;
	if (facetObj.sensor.name === "Meteorologia") {
		link = CANCELA_DISCRETE_FACET_VALUES + "sensorId=" + facetObj.sensor.id + "&facetaId=" + facetObj.id;
	} else {
		link = DISCRETE_VALUES_LINK + SENSOR_DESIGNATION + "=" + facetObj.sensor.name + "&" + FACET_DESIGNATION + "=" + facetObj.dbField;
	}
	if (DEBUG === 1)
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

	clearResults(); //Deletes table division

	/* Gathering Info required to apply filters. */
	var activeSensor_ = document.getElementsByClassName("link active"); //Active sensor.
	var sensorTab = activeSensor_[0]; //saves one & only active link tab.
	var sensorID = sensorTab.id; //Same id as the one used by API
	var sensorName_ = sensorTab.childNodes[0].nodeValue;
	var sensorName = sensorName_.replace(/ /g, "_");
	var sensorFacetsDivID = sensorName + "_facets"; //Facets Division of active Sensor.
	var sensorFacetsDiv = document.getElementById(sensorFacetsDivID);
	var checkbox_array = sensorFacetsDiv.getElementsByTagName("input");

	var str = filterPreRequestedData(checkbox_array, sensorID);
	var link;
	if (sensorName_ === "Meteorologia") {
	    link = CANCELA_SENSOR_VALUES + "sensorId=" + sensorID + str;
	    if (DEBUG === 1)
    		console.log("LINK _------> " + link);
	} else {
		var link = VALUES_LINK + sensorName + str;
	}
	requestAJAX(link, filterPostRequestedData, RESPONSE_TEXT, checkbox_array, sensorID);
}

/*
 This method allow to filter Pre Requested Data by providing a link for API*/
function filterPreRequestedData(checkbox_array, sensorID) {
	var str = "";
	for (var i = 0; i < checkbox_array.length; i++) {
		var checkbox = checkbox_array[i];
		if (checkbox.checked) {
			if (validatesCorrectCheckboxes(checkbox, sensorID) === 1) { //Discrete data.

				var name = checkbox.name.split(" ")[0];//Facet name.
				str += "&" + name + "=[";
				var parentElem = checkbox.parentElement.parentElement; //Parent Div.
				var values = getStringDiscreteValues(parentElem, str);
				if (values === null) // no options selected
					return "";
				str += values;
				str += "]";

			} else if (validatesCorrectCheckboxes(checkbox, sensorID) === 2) { //Continuos Data.

				//API NOT PREPARED TO RETRIEVE CONTINUOS VALUES.

			}
		}
	}
	return str;
}

/*
 Checks which checkbox is selected
 */
function filterPostRequestedData(txtDocument, checkbox_array, sensorID) {
	var resultsDiv = document.getElementById("results");
	//	startDisplaySetting(resultsDiv, false); //start div as hidden.
	var resultObj = JSON.parse(txtDocument);
	buildFullTable(resultObj, resultsDiv, sensorID);


	for (var i = 0; i < checkbox_array.length; i++) {
		checkbox = checkbox_array[i];
		column = 0;
		if (checkbox.checked) {
			if (validatesCorrectCheckboxes(checkbox, sensorID) === 2) {
				var div = checkbox.parentElement.nextElementSibling;
				filterResults(div, resultsDiv);
			}
		}
	}
	toggleFacetsMenu();
	showDiv(resultsDiv);
}

/*
 Returns a formated String with the Discrete Values for the Request.*/
function getStringDiscreteValues(parentElem) {
	var str = "";
	var elements = parentElem.getElementsByTagName("input"); //Discrete value checkboxes.
	var selectedCount = 0;
	for (var j = 1; j < elements.length; j++) {//ignores the first one always. It belongs to the major checkbox.
		if (elements[j].checked) {

			if (++selectedCount > 1)
				str += ",";
			str += elements[j].nextSibling.nodeValue;
		}
	}
	if (str.length === 0)
		return null;
	return str;
}

/**
 Valides Checkbox and returns a reference to what kind of facet is the Checkbox associated with.
 * @param {element} checkbox
 * @param {Number} sensorID
 * @param {type} col
 * @returns {Number}
 */
function validatesCorrectCheckboxes(checkbox, sensorID, col) {
	var sensorObj = findSensorById(sensorID);
	for (var i = 0; i < sensorObj.facets.length; i++) {

		var checkId = sensorObj.facets[i].id;
		var measure = getFacetMeasure(sensorObj, i);
		var type = getFacetType(sensorObj, i);


		if (checkbox.id === checkId) {

			//This is required because of continual alphanumerical exception.

			if ((measure === DISCRETE) || (measure === CONTINUOUS && type === ALPHANUMERIC))
				return 1; //Checkbox has Discrete Values.
			else
				return 2; //Checkbox with Continuos Values.
		}
		column++;
	}
}
/*
 Gets Measurement of Facet for a specific Sensor.*/
function getFacetMeasure(sensorObj, facetsID) {
	var measure = sensorObj.facets[facetsID].measure;
	return measure;
}
/*
 Gets Type of a Facet for a speficic Sensor.*/
function getFacetType(sensorObj, facetsID) {
	var type = sensorObj.facets[facetsID].type;
	return type;
}

/*
 Filters results.*/
function filterResults(div, resultsDiv) {
	var initialValue, finalValue;
	var slider = div.getElementsByClassName("ui-slider")[0];
	if (slider) {
		initialValue = $("#" + slider.id).slider("values", 0);
		finalValue = $("#" + slider.id).slider("values", 1);
		if (DEBUG === 1)
    		console.log("Slider range ------> " + initialValue + " - " + finalValue);
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
	filterContinuosValues(initialValue, finalValue, resultsDiv);
}

/*
 Show results in list according to the interval passed in parameteres.*/
function filterContinuosValues(initialValue, finalValue, resultsDiv) {
	var flag, c;
	flag = 0;
	c = 0;
	var rows = resultsDiv.getElementsByTagName("tr");  //all rows.
	loop1:
			for (var i = 0; i < rows.length; i++) {
		if (flag !== 0)
			break loop1;
		var row = rows[i];
		var row_ = row.childNodes;
		loop2:
				for (var j = 0; j < row_.length; j++) { //each cell from first row.
			if (j === column) {
				c = j; //saves column index to work on.
				flag++;
				if (column === 1) { //this is specific.
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
			var table = resultsDiv.getElementsByTagName("table")[0];
			table.removeChild(table.childNodes[i]); //deletes row in the current position.
			i--;
		}
	}
	if (rows.length === 1)
		printNoResultsFound(resultsDiv);
}


function printNoResultsFound(divLocation) {
	var text = document.createTextNode("Sorry. No results were found.");
	var span = document.createElement("span");
	span.appendChild(text);
	span.style = "font: 0.8em arial, sans-serif; margin-left: 0.5em;";
	divLocation.replaceChild(span, divLocation.childNodes[1]);
}

/*
 This method builds full table without any filtering*/
function buildFullTable(resultObj, resultsDiv, n) { //id do sensor ativo.
	var order = findSensorById(n).facets;
	//var order = sensorsArray[n].facets;
	resultsDiv.style.overflow = 'initial';
	resultsDiv.style.height = 'auto';
	var div = createDiv("resultsTable", "ui-table");
	var table = document.createElement("table");
	var tableHeaderRow = document.createElement("tr");
	var names = Object.getOwnPropertyNames(resultObj[0]); //allign order with names.

	for (var j = 0; j < order.length; j++) {
		for (var i = 0; i < names.length; i++) {
			if (order[j].dbField === names[i]) {
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
		var tr = document.createElement("tr");
		var singleObj = resultObj[i]; // entire row content.
		for (var j = 0; j < order.length; j++) { //each facet.
			for (var p in singleObj) { //each value.
				if (order[j].dbField === p) {
					var td = document.createElement("td");
					var text = document.createTextNode(singleObj[p]);
					td.appendChild(text);
					tr.appendChild(td);
				}
			}
			table.appendChild(tr);
		}
	}
	div.appendChild(table);
	styleTable(div);
	resultsDiv.appendChild(div);
}

function clearResults() {
	var maindiv = document.getElementById("results");
	if (maindiv.childNodes[1] != null) {
		maindiv.removeChild(maindiv.childNodes[1]);
		maindiv.style.display = "none";
		var span = $("#resultsbutton > span")[0];
		resetButtonArrow(span);
		$("#resultsbutton").css('margin-right', '0px');
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

function findSensorById(sensorId) {
	var sensorIdx = -1;
	for (var i = 0; i < sensorsArray.length; i++) {
		if (sensorsArray[i].id === sensorId) {
			sensorIdx = i;
			break;
		}
	}
	return sensorsArray[sensorIdx];
}


function toggleResults() {
	var resultsDiv = document.getElementById("resultsTable");
	if (resultsDiv) {
		var span = $("#resultsbutton > span")[0];
		rotateButtonArrow(span);
		toggleVisibility(resultsDiv);
		var margin = $("#resultsbutton").css('margin-right');
		if (margin === '0px')
			$("#resultsbutton").css('margin-right', '-17px');
		else
			$("#resultsbutton").css('margin-right', '0px');
	}
}