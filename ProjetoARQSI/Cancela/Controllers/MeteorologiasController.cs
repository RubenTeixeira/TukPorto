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

namespace Cancela.Controllers
{
    public class MeteorologiasController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET: api/Meteorologias
        public IQueryable<Meteorologia> GetMetereologias()
        {
            return db.Metereologias.Include(m => m.Local);
        }

        // GET: api/Meteorologias/5
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

        // PUT: api/Meteorologias/5
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