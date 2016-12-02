using Datum.Models;
using Datum.UserManagement;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Datum.DAL
{
    public class DatumContext : IdentityDbContext<ApplicationUser>
    {

        public DatumContext() : base("Datum", throwIfV1Schema: false)
        {
            Database.SetInitializer<DatumContext>(new DropCreateDatabaseIfModelChanges<DatumContext>());
            this.Configuration.LazyLoadingEnabled = false;
            //base.Configuration.ProxyCreationEnabled = false;
        }

        public static DatumContext Create()
        {
            return new DatumContext();
        }

        public DbSet<Meteorologia> Metereologias { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Local> Locals { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            

            //modelBuilder.Entity<IdentityUserLogin>().HasKey<string>(l => l.UserId);
            //modelBuilder.Entity<IdentityRole>().HasKey<string>(r => r.Id);
            //modelBuilder.Entity<IdentityUserRole>().HasKey(r => new { r.RoleId, r.UserId });
        }

    }
}