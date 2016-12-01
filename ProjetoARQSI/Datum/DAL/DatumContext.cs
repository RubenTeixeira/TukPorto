using Datum.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Datum.DAL
{
    public class DatumContext : DbContext
    {
        
        public DatumContext() : base("Datum")
        {
            this.Configuration.LazyLoadingEnabled = false;
            //base.Configuration.ProxyCreationEnabled = false;
        }


        public DbSet<Meteorologia> Metereologias { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Local> Locals { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

    }
}