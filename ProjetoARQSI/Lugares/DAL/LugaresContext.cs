using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClassLibraryARQSI;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Lugares.DAL
{
    public class LugaresContext : DbContext
    {

        public LugaresContext() : base("POIContext")
        {
        }

        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Local> Locals { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}