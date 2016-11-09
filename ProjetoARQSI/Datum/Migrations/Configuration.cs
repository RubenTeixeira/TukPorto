namespace Datum.Migrations
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Datum.DAL.DatumContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Datum.DAL.DatumContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            var locais = new List<Local>
            {
                new Local {Nome="Porto",GPS_Lat=41.1628634M,GPS_Long=-8.6568726M},
                new Local {Nome="Lisboa",GPS_Lat=38.7436056M,GPS_Long=-9.2302442M}
            };

            locais.ForEach(s => context.Locals.AddOrUpdate(s));
            context.SaveChanges();
        }
    }
}
