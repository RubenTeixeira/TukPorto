var SENSOR_DESIGNATION = "sensor";
var FACET_DESIGNATION = "faceta";
var sensors = "http://phpdev2.dei.isep.ipp.pt/~nsilva/smartcity/sensores.php";
var facets_ID_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetas.php?" + SENSOR_DESIGNATION + "=";
var facets_name_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetasByNomeSensor.php?" + SENSOR_DESIGNATION + "=";
var facets_values_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?";


function listSensors() {
    var xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {

        xmlHttpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                createTabs(xmlHttpObj.responseXML);
            }
        };
        xmlHttpObj.open("GET", sensors, true);
        xmlHttpObj.send();
    }
}


function createXmlHttpRequestObject() {
    return new XMLHttpRequest();
}

function createTabs(xmlDoc) {   
    var sensor = xmlDoc.getElementsByTagName("sensores")[0];
    var sensorsList = sensor.childNodes;
    var p = 0;
    var div = document.getElementById("sidebarleftside"); //retrieve sidebars left side
    var description = [];
    for (i = 0; i < sensorsList.length; i++) {
        if (sensorsList[i].nodeType === 1) { //only Elements Nodes
            var button = document.createElement("button");

            button.type = "button";
            description[p] = sensorsList[i].childNodes[1].childNodes[0].nodeValue;
            var text = document.createTextNode(description[p]);
            var ref = (p + 1).toString();
            var textref = "#" + ref + "sensor";
            button.id = textref; //append reference
            button.className = "sidebarbutton";
            button.appendChild(text);
            p++;
            div.appendChild(button);
        } else {
            //do nothing.
        }
    }
}

function setFacetsMenu() {
    var facetsmenu = document.getElementById("facetsmenu");
    facetsmenu.style.display = "block";
}

function showFacets() {
    var facetsmenu = document.getElementById("facetsmenu");
    if (facetsmenu.style.display == "block") {
        facetsmenu.style.display = "none";
    } else {
        facetsmenu.style.display = "block";
    }
}

function getFacetsFromSensor(sensor_id) {
    var link = facets_ID_link;
    if (typeof sensor_id == "string") {
        link = facets_name_link;
    }
    link += sensor_id;

    return getFacetsFromSensorXML(link);
}

function getFacetsFromSensorXML(link) {
    var xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {

        xmlHttpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return xmlHttpObj.responseXML;
            }
        };
        xmlHttpObj.open("GET", link, true);
        xmlHttpObj.send();
    }
}