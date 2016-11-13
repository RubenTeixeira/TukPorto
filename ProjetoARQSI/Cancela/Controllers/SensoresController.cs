using Cancela.Helpers;
using Datum.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Cancela.Controllers
{
    [RoutePrefix("api/Sensores")]
    public class SensoresController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET api/sensores
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public ICollection<Sensor> Get()
        {
            var sensores = new List<Sensor>();
            sensores.Add(new Sensor { id = "100", nome = "Meteorologia", descricao = "Cancela Meteorologia" });
            return sensores;
        }


        // GET api/sensores/100
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponseMessage Get(int id)
        {
            if (id == 100)
            {
                var meteoFacetas = new MeteorologiaFacetas();
                meteoFacetas.addFaceta("1", "Local", "Local", "discreto", "alfanumérico", "localização");
                meteoFacetas.addFaceta("2", "DataHoraLeitura", "Data", "contínuo", "data", "data");
                meteoFacetas.addFaceta("3", "Temp", "Temperatura", "contínuo", "numérico", "temperatura");
                meteoFacetas.addFaceta("4", "Vento", "Vento", "contínuo", "numérico", "vento");
                meteoFacetas.addFaceta("5", "Humidade", "Humidade", "contínuo", "numérico", "humidade");
                meteoFacetas.addFaceta("6", "Pressao", "Pressao", "contínuo", "numérico", "pressão");
                meteoFacetas.addFaceta("7", "NO", "NO", "contínuo", "numérico", "NO");
                meteoFacetas.addFaceta("8", "NO2", "NO2", "contínuo", "numérico", "NO2");
                meteoFacetas.addFaceta("9", "CO2", "CO2", "contínuo", "numérico", "CO2");
                return this.Request.CreateResponse(HttpStatusCode.OK, meteoFacetas);
            }
            else
            {

                return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        // GET api/sensores/DiscreteValues?sensorId=100&facetaId=1
        //[Route("sensores/DiscreteValues/{sensorId}/{facetaId}")]
        [Route("DiscreteValues")]
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponseMessage DiscreteValues(int sensorId, int facetaId)
        {
            var list = new List<Object>();
            switch (facetaId)
            {
                case 1:
                    var locals = db.Locals;
                    foreach (var item in locals) { list.Add(item.Nome); };
                    break;
                default:
                    return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, list);
        }

        // GET api/sensores/MinValue?sensorId=100&facetaId=1
        //[Route("sensores/MinValue/{sensorId}/{facetaId}")]
        [Route("MinValue")]
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponseMessage MinValue(int sensorId, int facetaId)
        {

            double min = 0;

            switch (facetaId)
            {
                case 3:
                    min = db.Metereologias.Max(m => m.Temp);
                    break;
                case 4:
                    min = db.Metereologias.Max(m => m.Vento);
                    break;
                case 5:
                    min = db.Metereologias.Max(m => m.Humidade);
                    break;
                case 6:
                    min = db.Metereologias.Max(m => m.Pressao);
                    break;
                case 7:
                    min = db.Metereologias.Max(m => m.NO);
                    break;
                case 8:
                    min = db.Metereologias.Max(m => m.NO2);
                    break;
                case 9:
                    min = db.Metereologias.Max(m => m.CO2);
                    break;
                default:
                    return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, min);
        }
    }
}
