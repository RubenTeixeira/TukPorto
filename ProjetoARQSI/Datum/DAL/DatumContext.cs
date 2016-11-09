using Datum.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Datum.DAL
{
    public class DatumContext : DbContext
    {
        public System.Data.Entity.DbSet<Datum.Models.Metereologia> Metereologias { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Local> Locals { get; set; }

        public DatumContext() : base("Datum")
        {
            
            //base.Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

    }
}