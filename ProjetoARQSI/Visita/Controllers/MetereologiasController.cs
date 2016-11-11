using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Datum.DAL;
using Datum.Models;
using Datum.Utils;
using System.Net.Http;
using Newtonsoft.Json;

namespace Visita.Controllers
{
    public class MetereologiasController : Controller
    {


        // GET: Metereologias
        public async Task<ActionResult> Index()
        {
            var client = WebApiHttpClient.GetClient();
            HttpResponseMessage response = await client.GetAsync("api/Metereologias");
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<IEnumerable<Metereologia>>(content);
                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }

        //// GET: Metereologias/Details/
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var client = WebApiHttpClient.GetClient();
            HttpResponseMessage response = await client.GetAsync("api/Metereologias/" + id);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<Metereologia>(content);
                if (meteos == null)
                    return HttpNotFound();

                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }


    }
}