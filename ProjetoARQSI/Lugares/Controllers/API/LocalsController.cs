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

namespace Lugares.Controllers.API
{
    public class LocalsController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET: api/LocalsAPI
        public IQueryable<Local> GetLocals()
        {
            return db.Locals;
        }

        // GET: api/LocalsAPI/5
        [ResponseType(typeof(Local))]
        public async Task<IHttpActionResult> GetLocal(int id)
        {
            Local local = await db.Locals.FindAsync(id);
            if (local == null)
            {
                return NotFound();
            }

            return Ok(local);
        }

        // PUT: api/LocalsAPI/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutLocal(int id, Local local)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != local.LocalID)
            {
                return BadRequest();
            }

            db.Entry(local).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocalExists(id))
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

        // POST: api/LocalsAPI
        [ResponseType(typeof(Local))]
        public async Task<IHttpActionResult> PostLocal(Local local)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Locals.Add(local);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = local.LocalID }, local);
        }

        // DELETE: api/LocalsAPI/5
        [ResponseType(typeof(Local))]
        public async Task<IHttpActionResult> DeleteLocal(int id)
        {
            Local local = await db.Locals.FindAsync(id);
            if (local == null)
            {
                return NotFound();
            }

            db.Locals.Remove(local);
            await db.SaveChangesAsync();

            return Ok(local);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LocalExists(int id)
        {
            return db.Locals.Count(e => e.LocalID == id) > 0;
        }
    }
}