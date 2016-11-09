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
    public class MetereologiasController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET: api/Metereologias
        public IQueryable<Metereologia> GetMetereologias()
        {
            return db.Metereologias;
        }

        // GET: api/Metereologias/5
        [ResponseType(typeof(Metereologia))]
        public async Task<IHttpActionResult> GetMetereologia(int id)
        {
            Metereologia metereologia = await db.Metereologias.FindAsync(id);
            if (metereologia == null)
            {
                return NotFound();
            }

            return Ok(metereologia);
        }

        // PUT: api/Metereologias/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutMetereologia(int id, Metereologia metereologia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != metereologia.MetereologiaID)
            {
                return BadRequest();
            }

            db.Entry(metereologia).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MetereologiaExists(id))
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

        // POST: api/Metereologias
        [ResponseType(typeof(Metereologia))]
        public async Task<IHttpActionResult> PostMetereologia(Metereologia metereologia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Metereologias.Add(metereologia);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = metereologia.MetereologiaID }, metereologia);
        }

        // DELETE: api/Metereologias/5
        [ResponseType(typeof(Metereologia))]
        public async Task<IHttpActionResult> DeleteMetereologia(int id)
        {
            Metereologia metereologia = await db.Metereologias.FindAsync(id);
            if (metereologia == null)
            {
                return NotFound();
            }

            db.Metereologias.Remove(metereologia);
            await db.SaveChangesAsync();

            return Ok(metereologia);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MetereologiaExists(int id)
        {
            return db.Metereologias.Count(e => e.MetereologiaID == id) > 0;
        }
    }
}