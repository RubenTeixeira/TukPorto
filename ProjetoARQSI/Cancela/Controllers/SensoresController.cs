using Cancela.Helpers;
using Datum.DAL;
using Datum.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using LinqKit;
using System.Web.Http.ModelBinding;
using System.ComponentModel;

namespace Cancela.Controllers
{
    [Authorize]
    [RoutePrefix("api/Sensores")]
    public class SensoresController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET api/sensores
        public HttpResponseMessage Get()
        {
            var sensores = new List<Sensor>();
            sensores.Add(new Sensor { id = "100", nome = "Meteorologia", descricao = "Cancela Meteorologia" });
            return this.Request.CreateResponse(HttpStatusCode.OK, sensores);
        }


        // GET api/sensores/100
        public HttpResponseMessage Get(int id)
        {
            if (id == 100)
            {
                var meteoFacetas = new MeteorologiaFacetas();
                meteoFacetas.addFaceta("1", "Data", "Data", "contínuo", "data", "data");
                meteoFacetas.addFaceta("2", "Hora", "Hora", "contínuo", "hora", "hora");
                meteoFacetas.addFaceta("3", "Local", "Local", "discreto", "alfanumérico", "localização");
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
        public async Task<HttpResponseMessage> DiscreteValues(int sensorId, int facetaId)
        {
            var list = new List<Object>();
            switch (facetaId)
            {
                case 3:
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
                    return this.Request.CreateResponse(HttpStatusCode.OK, "No Data!");
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, new { min = minvalue.ToString() });
        }


        // GET api/sensores/MaxValue?sensorId=100&facetaId=1
        [Route("MaxValue")]
        [HttpGet]
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
                    return this.Request.CreateResponse(HttpStatusCode.OK, "No Data!");
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, new { max = maxvalue.ToString() });
        }



        // GET api/sensores/SensorValues?sensorId=100&facetaName=Porto...&facetaNameN=[2016-11-10]
        [Route("SensorValues")]
        [HttpGet]
        public async Task<HttpResponseMessage> SensorValues(int sensorId, [FromUri]SearchCriteria filters)
        {
            List<Meteorologia> results;

            System.Diagnostics.Debug.WriteLine("FILTERS: \nLocal: " + filters.Local
                + "\nTemp: " + filters.Temp
                + "\nVento: " + filters.Vento
                + "\nHumidade: " + filters.Humidade
                + "\nPressao: " + filters.Pressao
                + "\nNO: " + filters.NO
                + "\nNO2: " + filters.NO2
                + "\nCO2: " + filters.CO2);

            results = await searchByCriteria(filters);

            var resultDtos = results.Select(x => MetereologiaDtoAssembler.convert(x)).ToList();


            return this.Request.CreateResponse(HttpStatusCode.OK, resultDtos);
        }



        public static T[] StringtoArray<T>(string s)
        {
            if (s != null)
            {
                var converter = TypeDescriptor.GetConverter(typeof(T));
                var values = Array.ConvertAll(s.Replace("[", string.Empty).Replace("]", string.Empty).Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries),
                    x => { return converter.ConvertFromString(x != null ? x.Trim() : x); });

                T[] typedValues = (T[])Array.CreateInstance(typeof(T), values.Length);

                values.CopyTo(typedValues, 0);
                return typedValues;
            }
            return null;

        }



        public async Task<List<Meteorologia>> searchByCriteria(SearchCriteria filters)
        {

            var mainPredicate = PredicateBuilder.New<Meteorologia>(true);

            var localPredicate = PredicateBuilder.New<Meteorologia>(true);
            var tempPredicate = PredicateBuilder.New<Meteorologia>(true);
            var ventoPredicate = PredicateBuilder.New<Meteorologia>(true);
            var humidadePredicate = PredicateBuilder.New<Meteorologia>(true);
            var pressaoPredicate = PredicateBuilder.New<Meteorologia>(true);
            var noPredicate = PredicateBuilder.New<Meteorologia>(true);
            var no2Predicate = PredicateBuilder.New<Meteorologia>(true);
            var co2Predicate = PredicateBuilder.New<Meteorologia>(true);


            if (filters.Local != null)
            {
                foreach (var item in StringtoArray<string>(filters.Local))
                {
                    localPredicate = localPredicate.Or(m => m.Local.Nome == item);
                }
            }
            if (filters.Temp != null)
            {
                foreach (var item in StringtoArray<double>(filters.Temp))
                {
                    tempPredicate = tempPredicate.Or(m => m.Temp.Equals(item));
                }
            }
            if (filters.Vento != null)
            {
                foreach (var item in StringtoArray<double>(filters.Vento))
                {
                    ventoPredicate = ventoPredicate.Or(m => m.Vento.Equals(item));
                }
            }
            if (filters.Humidade != null)
            {
                foreach (var item in StringtoArray<int>(filters.Humidade))
                {
                    humidadePredicate = humidadePredicate.Or(m => m.Humidade.Equals(item));
                }
            }
            if (filters.Pressao != null)
            {
                foreach (var item in StringtoArray<int>(filters.Pressao))
                {
                    pressaoPredicate = pressaoPredicate.Or(m => m.Pressao.Equals(item));
                }
            }
            if (filters.NO != null)
            {
                foreach (var item in StringtoArray<double>(filters.NO))
                {
                    noPredicate = noPredicate.Or(m => m.NO.Equals(item));
                }
            }
            if (filters.NO2 != null)
            {
                foreach (var item in StringtoArray<double>(filters.NO2))
                {
                    no2Predicate = no2Predicate.Or(m => m.NO2.Equals(item));
                }
            }
            if (filters.CO2 != null)
            {
                foreach (var item in filters.CO2)
                {
                    co2Predicate = co2Predicate.Or(m => m.CO2.Equals(item));
                }
            }
            var predicate = mainPredicate
                .And(localPredicate)
                .And(tempPredicate)
                .And(ventoPredicate)
                .And(humidadePredicate)
                .And(pressaoPredicate)
                .And(noPredicate)
                .And(no2Predicate)
                .And(co2Predicate);

            return await db.Metereologias.Include("Local").AsExpandable().Where(predicate).ToListAsync();
        }



    }




}
