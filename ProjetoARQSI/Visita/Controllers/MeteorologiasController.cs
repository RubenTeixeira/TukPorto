﻿using System;
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
using Visita.Helpers;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity;

namespace Visita.Controllers
{
    [Authorize]
    public class MeteorologiasController : Controller
    {
        //private DatumContext db = new DatumContext();

        // GET: Meteorologias
        public async Task<ActionResult> Index()
        {
            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias");
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<IEnumerable<Meteorologia>>(content);
                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }


        }

        // GET: Meteorologias/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias/" + id);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<Meteorologia>(content);
                if (meteos == null)
                    return HttpNotFound();

                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }





        public ActionResult SearchByDateTime()
        {
            return View();
        }

        //SearchByDatetime
        public async Task<ActionResult> ResultsByDateTime(string datetime)
        {
            string token = HttpContext.Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias?datetime=" + datetime);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<IEnumerable<Meteorologia>>(content);
                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }


        public async Task<ActionResult> SearchByPoi()
        {
            string token = HttpContext.Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/PointsOfInterest");
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var pois = JsonConvert.DeserializeObject<IEnumerable<PointOfInterest>>(content);
                return View(pois);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }

        //SearchByDatetime
        public async Task<ActionResult> ResultsByPoi(string id)
        {

            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias?poiID=" + id);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<IEnumerable<Meteorologia>>(content);
                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }

        public ActionResult SearchByPeriod()
        {
            return View();
        }


        public async Task<ActionResult> ResultsByPeriod(string date1, string date2)
        {
            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias?date1=" + date1 + "&date2=" + date2);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteos = JsonConvert.DeserializeObject<IEnumerable<Meteorologia>>(content);
                return View(meteos);
            }
            else
            {
                return Content("Ocorreu um erro: " + response.StatusCode);
            }
        }



        // GET: Meteorologias/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Meteorologias/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "LocalID,DataHoraLeitura,Temp,Vento,Humidade,Pressao,NO,NO2,CO2")] Meteorologia meteorologia)
        {

            try
            {
                string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
                var client = WebApiHttpClient.GetClient(token);
                string meteoJSON = JsonConvert.SerializeObject(meteorologia);
                HttpContent content = new StringContent(meteoJSON,
                        System.Text.Encoding.Unicode, "application/json");
                var response = await client.PostAsync("api/Meteorologias", content);
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    return Content("Ocorreu um erro: " + response.StatusCode);
                }
            }
            catch
            {
                return Content("Ocorreu um erro.");
            }
        }

        // GET: Meteorologias/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias/" + id);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteorologia = JsonConvert.DeserializeObject<Meteorologia>(content);
                if (meteorologia == null) return HttpNotFound();
                return View(meteorologia);
            }
            return Content("Ocorreu um erro: " + response.StatusCode);
        }

        // POST: Meteorologias/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "LocalID,DataHoraLeitura,Temp,Vento,Humidade,Pressao,NO,NO2,CO2")] Meteorologia meteorologia)
        {
            try
            {
                string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
                var client = WebApiHttpClient.GetClient(token);
                string meteoJSON = JsonConvert.SerializeObject(meteorologia);
                HttpContent content = new StringContent(meteoJSON,
                        System.Text.Encoding.Unicode, "application/json");
                var response =
                await client.PutAsync("api/Meteorologias/" + meteorologia.MetereologiaID, content);
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    return Content("Ocorreu um erro: " + response.StatusCode);
                }
            }
            catch
            {
                return Content("Ocorreu um erro.");
            }
        }

        // GET: Meteorologias/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
            var client = WebApiHttpClient.GetClient(token);
            HttpResponseMessage response = await client.GetAsync("api/Meteorologias/" + id);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                var meteorologia = JsonConvert.DeserializeObject<Meteorologia>(content);
                if (meteorologia == null) return HttpNotFound();
                return View(meteorologia);
            }
            return Content("Ocorreu um erro: " + response.StatusCode);

        }

        // POST: Meteorologias/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            try
            {
                string token = Request.Cookies.Get(WebApiHttpClient.TokenCookie).Value;
                var client = WebApiHttpClient.GetClient(token);
                var response = await client.DeleteAsync("api/Meteorologias/" + id);
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    return Content("Ocorreu um erro: " + response.StatusCode);
                }
            }
            catch
            {
                return Content("Ocorreu um erro.");
            }
        }

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}
    }
}
