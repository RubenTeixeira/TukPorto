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
            AutomaticMigrationsEnabled = true;
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

            context.Locals.AddOrUpdate(l => l.Nome,   // Nome nao pode ser repetido
                    new Local { Nome = "Porto", GPS_Lat = 41.1628634M, GPS_Long = -8.6568726M },
                    new Local { Nome = "Lisboa", GPS_Lat = 38.7436056M, GPS_Long = -9.2302442M },
                    new Local { Nome = "Amarante", GPS_Lat= 41.2693098M , GPS_Long= -8.0975483M }
                );


            context.PointsOfInterest.AddOrUpdate(p => p.Nome,
                new PointOfInterest { LocalID = 1, Nome = "ISEP", Descricao = "Campus ISEP" },
                new PointOfInterest { LocalID = 2, Nome = "Marquês de Pombal", Descricao = "Estação de Metropolitano"},
                new PointOfInterest { LocalID = 3, Nome = "Igreja de S. Gonçalo", Descricao = "Igreja de S. Gonçalo de Amarante"}
                );

            context.SaveChanges();

        }
    }
}
