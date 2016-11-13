using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Datum.DAL;
using Datum.Models;
using System.Web.Http.Cors;

namespace Cancela.Controllers
{
    public class MeteorologiasController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET: api/Meteorologias
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public IQueryable<Meteorologia> GetMetereologias()
        {
            return db.Metereologias.Include(m => m.Local);
        }

        // GET: api/Meteorologias/5
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Meteorologia))]
        public async Task<IHttpActionResult> GetMeteorologia(int id)
        {
            Meteorologia meteorologia = await db.Metereologias.Include("Local").SingleOrDefaultAsync(m => m.MetereologiaID == id);
            if (meteorologia == null)
            {
                return NotFound();
            }

            return Ok(meteorologia);
        }

        // GET: api/Metereologias/date/2000-12-16T00:00:00
        // [Route("date/{DataHoraLeitura:datetime}")]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Meteorologia))]
        public async Task<IHttpActionResult> GetMetereologiaByDataHoraLeitura(DateTime datetime)
        {
            var meteos = await db.Metereologias.Where(x => x.DataHoraLeitura == datetime).ToListAsync();
            if (meteos == null)
            {
                return NotFound();
            }

            return Ok(meteos);
        }

        // GET: api/Metereologias/poi/5
        // [Route("poi/")]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Meteorologia))]
        public async Task<IHttpActionResult> GetMetereologiaByPoi(int poiID)
        {
            var meteos = await db.Metereologias.Where(x => x.LocalID == poiID).ToListAsync();
            if (meteos == null)
            {
                return NotFound();
            }

            return Ok(meteos);
        }



        // PUT: api/Metereologias/5
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutMeteorologia(int id, Meteorologia meteorologia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != meteorologia.MetereologiaID)
            {
                return BadRequest();
            }

            db.Entry(meteorologia).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeteorologiaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Meteorologias
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Meteorologia))]
        public async Task<IHttpActionResult> PostMeteorologia(Meteorologia meteorologia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Metereologias.Add(meteorologia);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = meteorologia.MetereologiaID }, meteorologia);
        }

        // DELETE: api/Meteorologias/5
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Meteorologia))]
        public async Task<IHttpActionResult> DeleteMeteorologia(int id)
        {
            Meteorologia meteorologia = await db.Metereologias.Include("Local").SingleOrDefaultAsync(m => m.MetereologiaID == id);
            if (meteorologia == null)
            {
                return NotFound();
            }

            db.Metereologias.Remove(meteorologia);
            await db.SaveChangesAsync();

            return Ok(meteorologia);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MeteorologiaExists(int id)
        {
            return db.Metereologias.Count(e => e.MetereologiaID == id) > 0;
        }
    }
}