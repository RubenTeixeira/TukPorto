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
        var doc = xmlHttpObj.responseXML;
        createTabs(doc);

    }

}

function createXmlHttpRequestObject() {
    return new XMLHttpRequest();
}

function createTabs(doc) {
    var elementDiv = document.getElementById("widget_vertical");
    var sensorsList = doc.getElementsByTagName("nome");
    var div = document.createElement("div");
    var tab = document.createElement('ul');
    //div.setAttribute("class", "sidebarrightside");
    //tab.setAttribute("class", "sidebarmenu");
    for (i = 0; i < sensorsList.length; i++) {
        var li = document.createElement('li');
        var text = document.createTextNode(sensorsList[i].childNodes[0].nodeValue);
        //li.setAttribute("class", "sidebarmenulink");
        li.appendChild(text);
        tab.appendChild(li);

    }
    div.appendChild(tab);
    elementDiv.appendChild(div);


}