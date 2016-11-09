
		function Sensor(id, name, description) {
			var sensor = new Object();
			sensor.id = id;
			sensor.name = name;
			sensor.description = description;
			sensor.facets = [];
			return sensor;
		}

function Facet(sensor, id, dbField, name, measure, type, semantic) {
	var facet = new Object();
	facet.sensor = sensor;
	facet.id = id;
	facet.dbField = dbField;
	facet.name = name;
	facet.measure = measure;
	facet.type = type;
	facet.semantic = semantic;
	return facet;
}