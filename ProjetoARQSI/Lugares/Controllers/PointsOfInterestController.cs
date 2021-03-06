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
using Microsoft.AspNet.Identity;

namespace Lugares.Controllers
{
    public class PointsOfInterestController : Controller
    {
        private DatumContext db = new DatumContext();

        // GET: PointsOfInterest
        public async Task<ActionResult> Index()
        {
            var pointsOfInterest = db.PointsOfInterest.Include(p => p.Local).Include(p => p.Criador);
            return View(await pointsOfInterest.ToListAsync());
        }

        // GET: PointsOfInterest/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.Include(p => p.Local).Include(p => p.Criador).FirstAsync(i => i.PointOfInterestID == id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }
            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Create
        public ActionResult Create()
        {
            ViewBag.LocalID = new SelectList(db.Locals, "LocalID", "Nome");
            return View();
        }

        // POST: PointsOfInterest/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "PointOfInterestID,Nome,Descricao,LocalID")] PointOfInterest pointOfInterest)
        {
            pointOfInterest.CriadorID = User.Identity.GetUserId();

            if (ModelState.IsValid)
            {
                db.PointsOfInterest.Add(pointOfInterest);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.LocalID = new SelectList(db.Locals, "LocalID", "Nome", pointOfInterest.LocalID);
            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.Include(p => p.Local).Include(p => p.Criador).FirstAsync(i => i.PointOfInterestID == id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }
            if (!pointOfInterest.Criador.Id.Equals(User.Identity.GetUserId()))
            {
                return new HttpUnauthorizedResult("You do not have permission to perform this action.");
            }
            ViewBag.LocalID = new SelectList(db.Locals, "LocalID", "Nome", pointOfInterest.LocalID);
            return View(pointOfInterest);
        }

        // POST: PointsOfInterest/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "PointOfInterestID,Nome,Descricao,LocalID,Criador")] PointOfInterest pointOfInterest)
        {
            if (ModelState.IsValid)
            {
                db.Entry(pointOfInterest).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.LocalID = new SelectList(db.Locals, "LocalID", "Nome", pointOfInterest.LocalID);
            return View(pointOfInterest);
        }

        // GET: PointsOfInterest/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PointOfInterest pointOfInterest = await db.PointsOfInterest.Include(p => p.Local).Include(p => p.Criador).FirstAsync(i => i.PointOfInterestID == id);
            if (pointOfInterest == null)
            {
                return HttpNotFound();
            }
            if (!pointOfInterest.Criador.Id.Equals(User.Identity.GetUserId()))
            {
                return new HttpUnauthorizedResult("You do not have permission to perform this action.");
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
