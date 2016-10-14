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


function listSensors() {
	requestAJAX(sensorsAPI, createTabs, RESPONSE_XML, null);
}

function requestAJAX(uri, handler, responseType, extraParam) {
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
					if (extraParam == null)
						handler(xmlHttpObj.responseText);
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

		var cb_Div = createCheckBox("facetsdivision", dbField, name, id, name);

		//var div = document.createElement("div");
		//div.className = "facetsdivision";
		//div.id = facetObj.DBfield;
		//var label = document.createElement("label");
		//label.htmlFor = facetObj.DBfield + "_input_ID_" + sensorName;
		//label.nodeValue = facetObj.name;
		////disables text selection on double click.
		//label.addEventListener('mousedown', function (e) { e.preventDefault(); }, false);
		//var input = document.createElement("input");
		//input.id = facetObj.DBfield + "_input_ID_" + sensorName;
		////input.name = facetname;
		//input.type = "checkbox";
		//input.onchange = function () {
		//    showComponent(this);
		//}
		//var text = document.createTextNode(facetObj.name);
		//label.appendChild(input);
		//label.appendChild(text);
		//div.appendChild(label);
		//.appendChild(createFacet(facetObj)); //APPENDS DIV WITH CONTENT
		sensorFacetsDiv.appendChild(cb_Div);
	}
	maindivison.appendChild(sensorFacetsDiv);
}

function showFacetOptions(input) {
	// TODO:
	// Verify if options div exists, if so make it visible
	// otherwise create it:
    var facetObj;
	createFacet(facetObj);
}

function createFacet(facetObj) {
	var emptydiv = document.createElement("div");

	if (facetObj.semantic.includes("temperatura")) {
		return createTemp(facetObj);

	} else if (facetObj.semantic.includes("data")) {
		return createReadDate(facetObj);

	} else if (facetObj.semantic.includes("hora")) {
		return createReadHour(facetObj);

	} else if (facetObj.semantic.includes("monetário")) {
		return createReadPrice(facetObj);

	} else if (facetObj.measure.includes("discreto")) {
		return createDiscrete(facetObj);

	} else if (facetObj.measure.includes("contínuo")) {
		return createContinuous(facetObj);
	}

	//} else if (facetObj.semantic.includes("localização")) {
	//    return createLocal();

	//} else if (string.includes("GPS")) {
	//    return createGPS();
	//} else if (string.includes("Preço")) {
	//    return createPrice();
	//} else if (string.includes("Fonte")) {
	//    return createFonte();
	//} else if (string.includes("Indicador")) {
	//    return createIndicator();
	//} else if (string.includes("Foto")) {
	//    return createFoto();
	//} else if (string.includes("Valor")) {
	//    return createValor();
	//} else {
	//    return emptydiv;
	//}
}

function getMinPossibleValue(facetObj) {
	var link = FACET_MIN_VALUE + "sensor=" + facetObj.sensor + "&facetaCont=" + facetObj.DBfield;
}

// DATA facet
function createReadDate(facetObj) {
	var maindiv = document.createElement("div");
	maindiv.className = "facetscontent";
	maindiv.id = "datedivid";//DIV ID
	var div = document.createElement("div");
	var till = document.createElement("div");
	var a = document.createElement("a");
	var text = document.createTextNode("até");
	a.appendChild(text);
	var div2 = document.createElement("div");
	till.appendChild(a);
	div.appendChild(getCurrentDateForm());
	div2.appendChild(getCurrentDateForm());
	maindiv.appendChild(div);
	maindiv.appendChild(till);
	maindiv.appendChild(div2);
	startDisplaySetting(maindiv, false);
	return maindiv;
}

// HORA facet
function createReadHour(facetObj) {
	var maindiv = document.createElement("div");
	maindiv.className = "facetscontent";
	maindiv.id = "timedivid"; //DIV ID
	var div = document.createElement("div");
	var div2 = document.createElement("div");
	var till = document.createElement("div");
	var a = document.createElement("a");
	var text = document.createTextNode("até");
	a.appendChild(text);
	till.appendChild(a);
	div.appendChild(getCurrentHourForm());
	div2.appendChild(getCurrentHourForm());
	maindiv.appendChild(div);
	maindiv.appendChild(till);
	maindiv.appendChild(div2);
	startDisplaySetting(maindiv, false);
	return maindiv;
}

// TEMPERATURA facet
// TODO GET MIN and MAX !!!!!!!!!!
function createTemp(facetObj) {
	var div = document.createElement("div");
	div.className = "facetscontent";
	div.id = "tempdivid"; //DIV ID
	var div_ = document.createElement("div");
	div_.className = "facetscontent";
	var input = document.createElement("input");
	input.type = "range";
	input.style.width = "59%";
	input.name = "readTemp";
	input.id = "tempid";
	// min max functions
	input.max = "100";
	input.min = getMinPossibleValue(facetObj);
	input.value = "0";
	var text = document.createTextNode("-100ºC");
	var text_ = document.createTextNode("100ºC");
	var output = document.createElement("output");
	output.name = "out";
	output.htmlFor = "tempid";
	output.value = "0";
	output.style.position = "relative";
	output.style.left = "41.5%";
	var form = document.createElement("form");
	form.oninput = function () {
		output.value = parseInt(input.value);
	};
	form.appendChild(text);
	form.appendChild(input);
	form.appendChild(text_);
	div_.appendChild(output);
	div.appendChild(form);
	div.appendChild(div_);
	startDisplaySetting(div, false);
	;
	return div;
}

// LOCAL facet
// TODO: GET POSSIBLE VALUES !!!!!!!!!!!!!
function createLocal(facetObj) {
	var local = getDiscreteValues(facetObj);
	var div = document.createElement("div");
	div.className = "facetscontent";
	div.id = "localdivid"; //DIV ID
	var select1 = document.createElement("select");
	//select1.multiple = true; //Select multiple elements
	select1.onchange = function () {
		createSubLocal(this);
	}
	for (var i = 0; i < local.length; i++) {
		var string = local[i];
		var option = document.createElement("option");
		option.text = string;
		select1.add(option);
	}
	select1.name = "readLocal";
	div.appendChild(select1);
	startDisplaySetting(div, false);
	return div;
}

function createSubLocal(element) {
	//STATIC VALUES - to change.
	var str = element.options[element.selectedIndex].text;
	var sublocal = ["Porto"];
	sublocal["Porto"] = "Campanhã,Isep,Aliados";
	var sublocal2 = ["VCI"];
	sublocal2["VCI"] = "Antas,Francos,Amial,A3,Devesas";
	var array;
	var div = document.createElement("div");
	div.className = "facetscontent";
	var select = document.createElement("select");
	if (str.includes("Porto")) {
		array = sublocal["Porto"].split(",");
	} else {
		array = sublocal2["VCI"].split(",");
	}
	for (var i = 0; i < array.length; i++) {
		var option = document.createElement("option");
		option.text = array[i];
		select.add(option);
	}
	select.name = "readSublocal";
	div.appendChild(select);
	startDisplaySetting(div, true);
	var parentDiv = element.parentElement;
	if (parentDiv.childNodes[1] != null)
		parentDiv.removeChild(parentDiv.childNodes[1]);
	div.style.paddingTop = "10px";
	div.style.position = "relative";
	div.style.left = "-10%";
	parentDiv.appendChild(div);
}

function createDiscrete(facetObj) {
	var div = document.createElement("div");
	div.className = "facetscontent";
	div.id = "localdivid"; //DIV ID
	var select1 = document.createElement("select");
	select1.onchange = function () {
		createDiscreteOptions(this);
	}
	select1.name = "readLocal";
	div.appendChild(select1);
	startDisplaySetting(div, false);
	return div;
}

function createDiscreteOptions(element) {
	var options = getDiscreteValues()
}

function createContinuous(facetObject) {
	return null;
}

function getDiscreteValues(facetObj) {
	var link = DISCRETE_VALUES_LINK + SENSOR_DESIGNATION + "=" + facetObj.sensor + FACET_DESIGNATION + "=" + facetObj.DBfield;
}


//RESULTS
function results() {
    showHideResults();
    var ref_array = document.getElementsByClassName("link active");
    var ref = ref_array[0];
    var sensor = ref.childNodes[0].nodeValue;
    var sensorName = sensor.replace(/ /g, "_");
    handleRequiredInfo(sensorName); 
    var link = VALUES_LINK + sensorName;
	requestAJAX(link,showResults,RESPONSE_TEXT,null);
}

function showHideResults() {
    var maindiv = document.getElementById("results");
    if (maindiv.childNodes[1] != null) {
        maindiv.removeChild(maindiv.childNodes[1]); 
    }
}

function handleRequiredInfo(sensor) {
    var link;
    var id = sensor + "_facets";
    var div = document.getElementById(id);
    var checkbox_array = div.getElementsByTagName("input");
    for (var i = 0; i < checkbox_array.length; i++) {
        if (checkbox_array[i].checked) {
            //retrieve div of selected checkboxes to manipulate the data accordingly.
   
        }
    }
    //return string to add to link.
}

function showResults(txtDocument) {

    var divLocation = document.getElementById("results");
	divLocation.style.overflow = 'auto';
	var resultObj = JSON.parse(txtDocument);

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
