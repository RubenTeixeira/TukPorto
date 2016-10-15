﻿var SENSOR_DESIGNATION = "sensor";
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
     

function listSensors() {
	requestAJAX(sensorsAPI, createTabs, RESPONSE_XML, null);
}

function requestAJAX(uri, handler, responseType, extraParam) {
    var result;
	var xmlHttpObj = createXmlHttpRequestObject();

	if (xmlHttpObj) {
		xmlHttpObj.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				if (responseType == RESPONSE_XML) {
					if (extraParam == null) {
						handler(xmlHttpObj.responseXML);
					} else {
						handler(xmlHttpObj.responseXML, extraParam);
					}
				} else if (responseType == RESPONSE_TEXT) {
				    if (extraParam == null) {
				        handler(xmlHttpObj.responseText);
				       
				    }
				    else
				        handler(xmlHttpObj.responseText, extraParam);
				}
			}
		};
		xmlHttpObj.open("GET", uri, true);
		xmlHttpObj.send(null);

	}
	
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
	ul.className = "sidebarmenu";
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
	return allSensors.length;
}


function showFacetsFromSensor(evt, sensorName) {
	var i, tabcontent, tablinks;

	// Hide all currently existant tabcontent div's
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	    tabcontent[i].style.display = "none";
	    showHideResults();
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
	    sensorDiv.style.display = "block";
	 else 
	    requestFacets(sensorName);	    
		
	setFacetsMenu();
}


function setFacetsMenu() {
	var facetsmenu = document.getElementById("facetsmenuid");
	startDisplaySetting(facetsmenu, true);
}

function showFacetsMenu() {
	var facetsmenu = document.getElementById("facetsmenuid");
	changeDisplaySetting(facetsmenu);
}

function createFacets(facetsXML, sensorName) {
	var sensorObj = findSensorByName(sensorName);
	var maindivison = document.getElementById("facetsmenuid");
	var facets = facetsXML.getElementsByTagName("Faceta");
	var sensorFacetsDiv = document.createElement("div");
	sensorFacetsDiv.className = "tabcontent";
	sensorFacetsDiv.id = sensorObj.name + "_facets";

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

		var cb_Div = createCheckBox("facetsdivision", dbField, name, id, name,facetObj);
		sensorFacetsDiv.appendChild(cb_Div);
	}
	maindivison.appendChild(sensorFacetsDiv);
}

function showFacetOptions(div, facetObj) {
    var optionsDiv = div.getElementsByClassName("facetoptions")[0];
    if (optionsDiv) {
        if (optionsDiv.style.display === "block")
            optionsDiv.style.display = "none";
        else
            optionsDiv.style.display = "block";
    } else {
        div.appendChild(createFacet(facetObj));
    }
}

function createFacet(facetObj) {
    var measure = facetObj.measure;
    var typeOf = facetObj.type;

    if (measure === CONTINUOUS) {
        if (typeOf === DATATYPE) {
           return createReadDate(facetObj);
        }
        else if (typeOf === HOURTYPE) {
            return createReadHour(facetObj);
        }
        else if (typeOf === NUMERICTYPE) {
            return createReadNumericType(facetObj);
        }

        else if (typeOf === ALPHANUMERIC) {
            return createSelectAlphaNumericType(facetObj);
        }
       
    }

    else if (measure === DISCRETE) {
        if (typeOf === ALPHANUMERIC) {
            return createSelectAlphaNumericType(facetObj);
        }
    }


}

function getAllOptions(facetObj, div) {
    
    var link = DISCRETE_VALUES_LINK + "sensor=" + facetObj.sensor.name + "&faceta=" + facetObj.dbField;
    console.log(link);
    requestAJAX(link, createAllOptionsInput, RESPONSE_TEXT, div);
    
}

function createAllOptionsInput(txtDocument,div) {
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



function getMaxPossibleValue(facetObj,div) {
    var link = FACET_MAX_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
    requestAJAX(link, getMaxLimitValue, RESPONSE_TEXT,div);
   
   
    
}

function getMaxLimitValue(txtDocument,div) {
    var result = JSON.parse(txtDocument);
    var text = document.createTextNode("Max: ");
    text.size = 8;
    var maxDiv = document.createElement('div');
    maxDiv.style.border = 'none';
    var input = document.createElement("input");
    input.type = 'text';
    input.value = result.max;
    maxDiv.appendChild(text);
    div.appendChild(maxDiv);
    div.appendChild(input);
    
   
    
}


function getMinPossibleValue(facetObj,div) {
    var link = FACET_MIN_VALUE + "sensor=" + facetObj.sensor.name + "&facetaCont=" + facetObj.dbField;
    requestAJAX(link, getMinLimitValue, RESPONSE_TEXT,div);
    


}

function getMinLimitValue(txtDocument, div) {
    
    var result = JSON.parse(txtDocument);
    var text = document.createTextNode("Min: ");
    text.size = 8;
    var minDiv = document.createElement('div');
    minDiv.style.border = 'none';
    var input = document.createElement("input");
    input.type = 'text';
    input.value = result.min;
    minDiv.appendChild(text);
    div.appendChild(minDiv);
    div.appendChild(input);
}

// DATA facet
function createReadDate(facetObj) {
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
    startDisplaySetting(div, true);
    return div;
}

// HORA facet
function createReadHour(facetObj) {
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
    startDisplaySetting(div, true);
    return div;
}


function createReadNumericType(facetObj) {
    var div = document.createElement("div");
    div.id = facetObj.id;
    div.className = "facetoptions";
    div.style.border = 'none';
    getMinPossibleValue(facetObj,div);
    getMaxPossibleValue(facetObj,div);
    return div;
}

function createSelectAlphaNumericType(facetObj) {
    var div = document.createElement("div");
    div.style.border = 'none';
    div.style.display = "block";
    getAllOptions(facetObj, div);
    return div;
   
}


function getDiscreteValues(facetObj) {
	var link = DISCRETE_VALUES_LINK + SENSOR_DESIGNATION + "=" + facetObj.sensor + FACET_DESIGNATION + "=" + facetObj.DBfield;
}


//RESULTS
function results() {
    var str = "";
    showHideResults();
    var ref_array = document.getElementsByClassName("link active");
    var ref = ref_array[0];
    var sensor = ref.childNodes[0].nodeValue;
    var sensorName = sensor.replace(/ /g, "_");
    var str = filter(sensorName);
    var link = VALUES_LINK + sensorName + str;
    requestAJAX(link, handlePeriodInfo, RESPONSE_TEXT, sensorName);
    //Date must be handled after achieving the text file
}
/*
This method allow to filter Results by providing a portion of the link*/
function filter(sensorName) {
    var str = "";
    var id = sensorName + "_facets";
    var div = document.getElementById(id); //This is all.
    var checkbox_array = div.getElementsByTagName("input");
    for (var i = 1; i < checkbox_array.length; i++) {
        if (checkbox_array[i].checked) {
            if (checkbox_array[i].id == "5") { //LOCAL
                str += "&"+checkbox_array[i].name+"=["
                var parentElem = checkbox_array[i].parentElement.parentElement; //div parent.
                var elements = parentElem.getElementsByTagName("input");
                //ignores the first one.
                for (var j = 1; j < elements.length; j++) {
                    if (elements[j].checked) {
                        var local = elements[j].nextSibling.nodeValue;
                        str += local + ","
                    }
                }
                str += "]";
            } else if (checkbox_array[i].id == "8") {
                str += "&" + checkbox_array[i].name + "=["
                var parentElem = checkbox_array[i].parentElement.parentElement; //div parent.
                var elements = parentElem.getElementsByTagName("input");
                //ignores the first one.
                for (var j = 1; j < elements.length; j++) {
                    if (elements[j].checked) {
                        var local = elements[j].nextSibling.nodeValue;
                        str += local + ","
                    }
                }
                str += "]";
            }
        }
    }
    return str;
}

/*
This method checks which checkbox is selected*/
function handlePeriodInfo(txtDocument, sensorName) {
    var resultObj = JSON.parse(txtDocument);
    var id = sensorName + "_facets";
    var div = document.getElementById(id);
    var checkbox_array = div.getElementsByTagName("input");
    var divLocation = document.getElementById("results");
    startDisplaySetting(divLocation, false); //start div as hidden.
    buildFullTable(resultObj, divLocation);
    for (var i = 0; i < checkbox_array.length; i++) {
        if (checkbox_array[i].checked) {
            var div = checkbox_array[i].parentElement.nextElementSibling;
            if (checkbox_array[i].name == "Data de leitura") {
                filterResults(div, divLocation);
            }
            if (checkbox_array[i].name == "Hora de leitura") {
                filterResults(div, divLocation);
            }
            if (checkbox_array[i].name == "Local") {
                //Data handled previously
            }
        }
    }
    changeDisplaySetting(divLocation);
    //var str = strDate; // add other handlers return value, to form the second part of the link.
    //return str;
}

/*
This method extracts two Date Object from the input.*/
function filterResults(div, divLocation) {
    if (div.id == "1") { //search should be done by id - validate if this is indeed the right div.
        var date_array = div.getElementsByTagName("input");
        var beginDate = date_array[0].value;
        var endDate = date_array[1].value;
        showResultsDatePeriod(beginDate, endDate, divLocation);
    } else if (div.id == "2") {
        var hour_array = div.getElementsByTagName("input");
        var beginHour = hour_array[0].value;
        var endHour = hour_array[1].value;
        showResultsHourPeriod(beginHour, endHour, divLocation);
    }
}

/*
Show results in list according to the interval passed in parameteres.*/
function showResultsDatePeriod(beginDate, endDate, divLocation) {
    var flag, c;
    flag = 0; c = 0;
    var rows = divLocation.getElementsByTagName("tr"); //all trs
    loop1:
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var row_ = row.childNodes;
            loop2:
                for (var j = 0; j < row_.length ; j++) { //each cell
                    var value = row_[j].childNodes[0].nodeValue;
                    if (value == "Data de leitura") {
                        c = j;
                        flag++;
                        break loop2;
                        //salva posicao da primeira coluna.
                    }
                    if (flag != 0) break loop1;
                }
        }
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var row_ = row.childNodes;
        var date = row_[c].childNodes[0].nodeValue;
        if (date < beginDate || date > endDate) {
            var table = divLocation.getElementsByTagName("table")[0];
            table.removeChild(table.childNodes[i]); //remove a coluna da seguite posição.
            i--;
        }
    }
}

function showResultsHourPeriod(beginHour, endHour, divLocation) {
    var flag, c;
    flag = 0; c = 0;
    var rows = divLocation.getElementsByTagName("tr"); //all trs
    loop1:
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var row_ = row.childNodes;
            loop2:
                for (var j = 0; j < row_.length ; j++) { //each cell
                    var value = row_[j].childNodes[0].nodeValue;
                    if (value == "Hora de leitura") {
                        c = j;
                        flag++;
                        break loop2;
                        //salva posicao da primeira coluna.
                    }
                    if (flag != 0) break loop1;
                    
                }
        }
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var row_ = row.childNodes;
        var hour = row_[c].childNodes[0].nodeValue;
        beginHour = beginHour + ":00";
        endHour = endHour + ":00";
        if (hour < beginHour || hour > endHour) {
            var table = divLocation.getElementsByTagName("table")[0];
            table.removeChild(table.childNodes[i]); //remove a coluna da seguite posição.
            i--;
        }
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

/*
This method shows full table without any filtering*/
function buildFullTable(resultObj, divLocation) {
    divLocation.style.overflow = 'auto';
    var div = document.createElement("div");
    var table = document.createElement("table");
    var tableHeaderRow = document.createElement("tr");
    var names = Object.getOwnPropertyNames(resultObj[0]);
    for (var i = 0; i < names.length; i++) {
        var th = document.createElement("th");
        var text = document.createTextNode(names[i].replace(/_/g, " "));
        th.appendChild(text);
        tableHeaderRow.appendChild(th);
    }
    table.appendChild(tableHeaderRow);

    for (var i = 0; i < resultObj.length; i++) {
        var singleObj = resultObj[i];
        var tr = document.createElement("tr");
        for (var j in singleObj) {
            var td = document.createElement("td");
            var text = document.createTextNode(singleObj[j]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    div.appendChild(table);
    div.style.border = "none";
    styleTable(div);
    divLocation.appendChild(div);
}

function showHideResults() {
    var maindiv = document.getElementById("results");
    if (maindiv.childNodes[1] != null) {
        maindiv.removeChild(maindiv.childNodes[1]);
    }
}
