using Datum.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Datum.DAL
{
    public class DatumContext : DbContext
    {

        public DatumContext() : base("DatumContext")
        {
            base.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Local> Locals { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public System.Data.Entity.DbSet<Datum.Models.Metereologia> Metereologias { get; set; }
    }
}