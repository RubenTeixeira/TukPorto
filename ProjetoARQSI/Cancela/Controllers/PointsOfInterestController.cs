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
using Microsoft.AspNet.Identity;

namespace Cancela.Controllers
{
    [Authorize]
    public class PointsOfInterestController : ApiController
    {
        private DatumContext db = new DatumContext();

        // GET: api/PointsOfInterest
        public IQueryable<PointOfInterest> GetPointsOfInterest()
        {
            return db.PointsOfInterest.Include(p => p.Local);
        }

        // GET: api/PointsOfInterest/5
        [ResponseType(typeof(PointOfInterest))]
        public async Task<IHttpActionResult> GetPointOfInterest(int id)
        {
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            if (pointOfInterest == null)
            {
                return NotFound();
            }

            return Ok(pointOfInterest);
        }

        // PUT: api/PointsOfInterest/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPointOfInterest(int id, PointOfInterest pointOfInterest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pointOfInterest.PointOfInterestID)
            {
                return BadRequest();
            }

            if (!pointOfInterest.Criador.Id.Equals(User.Identity.GetUserId()))
            {
                return Unauthorized();
            }

            db.Entry(pointOfInterest).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PointOfInterestExists(id))
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

        // POST: api/PointsOfInterest
        [Authorize(Roles = "Editor")]
        [ResponseType(typeof(PointOfInterest))]
        public async Task<IHttpActionResult> PostPointOfInterest(PointOfInterest pointOfInterest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PointsOfInterest.Add(pointOfInterest);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = pointOfInterest.PointOfInterestID }, pointOfInterest);
        }

        // DELETE: api/PointsOfInterest/5
        [ResponseType(typeof(PointOfInterest))]
        public async Task<IHttpActionResult> DeletePointOfInterest(int id)
        {
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            if (pointOfInterest == null)
            {
                return NotFound();
            }

            if (!pointOfInterest.Criador.Id.Equals(User.Identity.GetUserId()))
            {
                return Unauthorized();
            }

            db.PointsOfInterest.Remove(pointOfInterest);
            await db.SaveChangesAsync();

            return Ok(pointOfInterest);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PointOfInterestExists(int id)
        {
            return db.PointsOfInterest.Count(e => e.PointOfInterestID == id) > 0;
        }
    }
}