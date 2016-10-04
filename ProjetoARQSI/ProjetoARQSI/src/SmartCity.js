var sensors = "http://phpdev2.dei.isep.ipp.pt/~nsilva/smartcity/sensores.php";
var xmlHttpObj;

function listSensors() {
    xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {
        xmlHttpObj.open("GET", sensors, true);
        xmlHttpObj.onreadystatechange = stateHandler;
        xmlHttpObj.send(null);
    }
}

function stateHandler() {
    if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
        var xmlDoc = xmlHttpObj.responseXML;
        createTabs(xmlDoc);
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
    facetsmenu.style.visibility = "hidden";
    facetsmenu.style.height = "0";
    facetsmenu.style.opacity = "0"; 
}

function showFacets() {
    var facetsmenu = document.getElementById("facetsmenu");
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