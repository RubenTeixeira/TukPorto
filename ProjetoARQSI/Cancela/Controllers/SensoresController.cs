using Cancela.Helpers;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Cancela.Controllers
{
    public class SensoresController : ApiController
    {


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
                meteoFacetas.addFaceta("5", "Humidade", "contínuo", "discreto", "numérico", "humidade");
                meteoFacetas.addFaceta("6", "Pressao", "contínuo", "discreto", "numérico", "pressão");
                meteoFacetas.addFaceta("7", "NO", "NO", "contínuo", "numérico", "NO");
                meteoFacetas.addFaceta("8", "NO2", "NO2", "contínuo", "numérico", "NO2");
                meteoFacetas.addFaceta("9", "CO2", "CO2", "contínuo", "numérico", "CO2");
                return this.Request.CreateResponse(HttpStatusCode.OK, meteoFacetas);
            } else
            {

                return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
    }
}
