using Cancela.Helpers;
using Datum.DAL;
using Datum.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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
        public HttpResponseMessage Get()
        {
            var sensores = new List<Sensor>();
            sensores.Add(new Sensor { id = "100", nome = "Meteorologia", descricao = "Cancela Meteorologia" });
            return this.Request.CreateResponse(HttpStatusCode.OK, sensores);
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
                meteoFacetas.addFaceta("3", "DataHoraLeitura", "Hora", "contínuo", "hora", "hora");
                meteoFacetas.addFaceta("4", "Temp", "Temperatura", "contínuo", "numérico", "temperatura");
                meteoFacetas.addFaceta("5", "Vento", "Vento", "contínuo", "numérico", "vento");
                meteoFacetas.addFaceta("6", "Humidade", "Humidade", "contínuo", "numérico", "humidade");
                meteoFacetas.addFaceta("7", "Pressao", "Pressao", "contínuo", "numérico", "pressão");
                meteoFacetas.addFaceta("8", "NO", "NO", "contínuo", "numérico", "NO");
                meteoFacetas.addFaceta("9", "NO2", "NO2", "contínuo", "numérico", "NO2");
                meteoFacetas.addFaceta("10", "CO2", "CO2", "contínuo", "numérico", "CO2");
                return this.Request.CreateResponse(HttpStatusCode.OK, meteoFacetas);
            }
            else
            {

                return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        // GET api/sensores/DiscreteValues?sensorId=100&facetaId=1
        [Route("DiscreteValues")]
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public async Task<HttpResponseMessage> DiscreteValues(int sensorId, int facetaId)
        {
            var list = new List<Object>();
            switch (facetaId)
            {
                case 1:
                    var locals = await db.Locals.ToListAsync();
                    foreach (var item in locals) { list.Add(item.Nome); };
                    break;
                default:
                    return this.Request.CreateResponse(HttpStatusCode.OK, "No data!");
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, list);
        }

        // GET api/sensores/MinValue?sensorId=100&facetaId=1
        [Route("MinValue")]
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponseMessage MinValue(int sensorId, int facetaId)
        {

            double minvalue = 0;

            switch (facetaId)
            {
                case 4:
                    minvalue = db.Metereologias.Min(m => m.Temp);
                    break;
                case 5:
                    minvalue = db.Metereologias.Min(m => m.Vento);
                    break;
                case 6:
                    minvalue = db.Metereologias.Min(m => m.Humidade);
                    break;
                case 7:
                    minvalue = db.Metereologias.Min(m => m.Pressao);
                    break;
                case 8:
                    minvalue = db.Metereologias.Min(m => m.NO);
                    break;
                case 9:
                    minvalue = db.Metereologias.Min(m => m.NO2);
                    break;
                case 10:
                    minvalue = db.Metereologias.Min(m => m.CO2);
                    break;
                default:
                    return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, new { min = minvalue.ToString() });
        }


        // GET api/sensores/MaxValue?sensorId=100&facetaId=1
        [Route("MaxValue")]
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponseMessage MaxValue(int sensorId, int facetaId)
        {

            double maxvalue = 0;

            switch (facetaId)
            {
                case 4:
                    maxvalue = db.Metereologias.Max(m => m.Temp);
                    break;
                case 5:
                    maxvalue = db.Metereologias.Max(m => m.Vento);
                    break;
                case 6:
                    maxvalue = db.Metereologias.Max(m => m.Humidade);
                    break;
                case 7:
                    maxvalue = db.Metereologias.Max(m => m.Pressao);
                    break;
                case 8:
                    maxvalue = db.Metereologias.Max(m => m.NO);
                    break;
                case 9:
                    maxvalue = db.Metereologias.Max(m => m.NO2);
                    break;
                case 10:
                    maxvalue = db.Metereologias.Max(m => m.CO2);
                    break;
                default:
                    return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, new { max = maxvalue.ToString() });
        }



        //// GET api/sensores/SensorValues?sensorId=100&facetaId=1...&facetaidN=N
        //[Route("SensorValues")]
        //[HttpGet]
        //[EnableCors(origins: "*", headers: "*", methods: "*")]
        //public async Task<HttpResponseMessage> SensorValues(int sensorId, SearchCriteria filters)
        //{

        //    var results = await GetByCriteria(filters);

        //    return this.Request.CreateResponse(HttpStatusCode.OK, results);
        //}

        //public Task<IEnumerable<Meteorologia>> GetByCriteria(SearchCriteria filters)
        //{
        //    IQueryable<Meteorologia> query = db.Metereologias;
        //    foreach (var filter in filters)
        //    {
        //        string temp = keyword;
        //        query = query.Where(p => p.Description.Contains(temp));
        //    }
        //    return matches;
        //}



    }

    public class SearchCriteria
    {
        public string Local { get; set; }
        public double Temp { get; set; }
        public double Vento { get; set; }
        public int Humidade { get; set; }
        public int Pressao { get; set; }
        public double NO { get; set; }
        public double NO2 { get; set; }
        public double CO2 { get; set; }
    }

    
}
