using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using Datum.DAL;
using Datum.Models;
using System;

namespace Lugares.Controllers
{
    public class PointsOfInterestController : Controller
    {
        private DatumContext db = new DatumContext();

        // GET: PointsOfInterest
        public async Task<ActionResult> Index()
        {
            return View(await db.PointsOfInterest.ToListAsync());
        }

        // GET: PointsOfInterest/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }
            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Create
        public async Task<ActionResult> Create()
        {
            var locals = await db.Locals.ToListAsync();

            ViewBag.Locals = locals;

            return View();
        }

        // POST: PointsOfInterest/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "LocalID,Nome,Descricao")] PointOfInterest pointOfInterest, FormCollection form)
        {

            if (ModelState.IsValid)
            {
                //int selectedLocalID = Int32.Parse(form["Local"]);
                //pointOfInterest.LocalID = selectedLocalID;

                db.PointsOfInterest.Add(pointOfInterest);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }

            var locals = await db.Locals.ToListAsync();

            ViewBag.LocalList = locals;

            return View(pointOfInterest);
        }

        // POST: PointsOfInterest/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "PointOfInterestID,LocalID,Nome,Descricao")] PointOfInterest pointOfInterest)
        {
            if (ModelState.IsValid)
            {
                db.Entry(pointOfInterest).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }
            return View(pointOfInterest);
        }

        // POST: PointsOfInterest/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            PointOfInterest pointOfInterest = await db.PointsOfInterest.FindAsync(id);
            db.PointsOfInterest.Remove(pointOfInterest);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
