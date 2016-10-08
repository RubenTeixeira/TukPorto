var SENSOR_DESIGNATION = "sensor";
var FACET_DESIGNATION = "faceta";
var sensors = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/sensores.php";
var facets_ID_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetas.php?" + SENSOR_DESIGNATION + "=";
var facets_name_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetasByNomeSensor.php?" + SENSOR_DESIGNATION + "=";
var facets_values_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?";
var RESPONSE_XML = 1;
var RESPONSE_TEXT = 2;


function listSensors() {
    requestAJAX(sensors, createTabs, RESPONSE_XML);
}

function requestAJAX(uri, handler, responseType) {
    var xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {
        xmlHttpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                if (responseType == RESPONSE_XML) {
                    handler(xmlHttpObj.responseXML);
                } else if (responseType == RESPONSE_TEXT) {
                    handler(xmlHttpObj.responseText);
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




/*Builds Sidebar's left side from Sensor description*/
function createTabs(xmlDoc) {
    var description = xmlDoc.getElementsByTagName("descricao");
    var p = 0;
    var div = document.getElementById("sidebarleftside"); //retrieve sidebars left side
    var ul = document.createElement("ul");
    for (i = 0; i < description.length; i++) {
        var text = document.createTextNode(description[i].childNodes[0].nodeValue);
        var a = document.createElement("a");
        a.href = "#";
        //a.onclick
        a.appendChild(text);
        var li = document.createElement("li");
        li.className = "sidebarmenulink";
        li.appendChild(a);
        ul.appendChild(li);
        ul.className = "sidebarmenu";
        p++;
        div.appendChild(ul);
    }
    return p;
}


function setFacetsMenu() {
    var facetsmenu = document.getElementById("facetsmenuid");
    facetsmenu.style.visibility = "hidden";
    facetsmenu.style.height = "0";
    facetsmenu.style.opacity = "0";
}

function showFacets() {
    var facetsmenu = document.getElementById("facetsmenuid");
    if (facetsmenu.style.visibility == "visible") {
        facetsmenu.style.opacity = "0";
        facetsmenu.style.visibility = "hidden";
        facetsmenu.style.height = "0";
    } else {
        facetsmenu.style.transition = "opacity 0.7s ease-out";
        facetsmenu.style.height = "auto";
        facetsmenu.style.visibility = "visible";
        facetsmenu.style.opacity = "1";
    }
}

function getFacetsFromSensor(sensor_id) {
    var link = facets_ID_link;
    if (typeof sensor_id == "string") {
        link = facets_name_link;
        //link += sensor_id;
    }
    link += sensor_id;
    alert(link);
    return getFacetsFromSensorXML(link);
}


/*Retrieves all facets name from all Sensors*/
/*This method is not being called anywhere atm*/
function createFacetsForAllSensors(/*cont*/) {
    var t = 1;
    for (var i = 0; i < cont; i++) {
        var sensor_id = t.toString();
        var xmldoc = getFacetsFromSensor(sensor_id); //retrieves document as xml from each sensor.
        var facetsnames = xmldoc.getElementsByTagName("Nome");

        createFacets(facetsname);
        t++;
    }
}
/*Create into the html document all facets from one specific sensor*/
/*This method is not being used anywhere atm, its an extension from the method above*/
function createFacets(facetsname) {
    var maindivison = document.getElementById("facetsmenuid");
    for (var i = 0; i < facetsname.length; i++) {
        var facetname = facetsname[i].childNodes[0].nodeValue;
        var div = document.createElement("div");
        div.className = "facetsdivision";
        var label = document.createElement("label");
        label.for = facetname + "id";
        var input = document.createElement("input");
        input.id = facetname + "id";
        input.name = facetname;
        input.type = "checkbox";
        var text = document.createTextNode(facetname);
        input.appendChild(text);
        label.appendChild(input);
        div.appendChild(label);
        maindivison.appendChild(div);
    }
}

function results() {
    var link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?sensor=Temperatura&faceta=Temp";
    //getResults(link);

}

function getResults(link) {
    var httpObj = createXmlHttpRequestObject();

    if (httpObj) {
        httpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return showResults(httpObj.responseText);
            }
        };
        httpObj.open("GET", link, true);
        httpObj.send();
    }
}

function showResults(txtDocument) {
    
    var divLocation = document.getElementById("widget_horizontal");
    var resultObj = JSON.parse(txtDocument);
    var div = document.createElement("div");
    var table = document.createElement("table");
    table.style.border = "1px solid black";
    
    for (var j = 0; j < 4; j++) {
        var tr = document.createElement("tr");
        //tr.style.border = "1px solid black";
        for (var i = 0; i < resultObj.length; i++) {
            var td = document.createElement("td");
            td.style.border = "1px solid black";
            var text = document.createTextNode(resultObj[i]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
   
    div.appendChild(table);
    divLocation.appendChild(div);
    
}