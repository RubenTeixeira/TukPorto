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
                    new Local { Nome = "Amarante", GPS_Lat = 41.2693098M, GPS_Long = -8.0975483M }
                );


            context.PointsOfInterest.AddOrUpdate(p => p.Nome,
                new PointOfInterest { LocalID = 1, Nome = "ISEP", Descricao = "Campus ISEP" },
                new PointOfInterest { LocalID = 2, Nome = "Marquês de Pombal", Descricao = "Estação de Metropolitano" },
                new PointOfInterest { LocalID = 3, Nome = "Igreja de S. Gonçalo", Descricao = "Igreja de S. Gonçalo de Amarante" }
                );

            context.Metereologias.AddOrUpdate(m => new { m.LocalID, m.DataHoraLeitura },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 1), CO2 = 0.04, Humidade = 90, NO = 0.05, NO2 = 0.15, Pressao = 1024, Temp = 16.00, Vento = 11 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 2), CO2 = 0.04, Humidade = 40, NO = 0.06, NO2 = 0.16, Pressao = 1020, Temp = 13.00, Vento = 30 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 3), CO2 = 0.042, Humidade = 30, NO = 0.05, NO2 = 0.15, Pressao = 1026, Temp = 12.00, Vento = 5 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 4), CO2 = 0.041, Humidade = 90, NO = 0.05, NO2 = 0.14, Pressao = 1002, Temp = 12.00, Vento = 43 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 12), CO2 = 0.04, Humidade = 20, NO = 0.05, NO2 = 0.13, Pressao = 1013, Temp = 20.00, Vento = 5 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 13), CO2 = 0.041, Humidade = 40, NO = 0.06, NO2 = 0.12, Pressao = 1022, Temp = 16.00, Vento = 47 },
                new Meteorologia { LocalID = 3, DataHoraLeitura = new DateTime(2016, 11, 14), CO2 = 0.05, Humidade = 40, NO = 0.07, NO2 = 0.10, Pressao = 1014, Temp = 16.00, Vento = 7 },
                new Meteorologia { LocalID = 2, DataHoraLeitura = new DateTime(2016, 11, 15), CO2 = 0.04, Humidade = 50, NO = 0.05, NO2 = 0.10, Pressao = 1030, Temp = 12.00, Vento = 7 },
                new Meteorologia { LocalID = 2, DataHoraLeitura = new DateTime(2016, 11, 16), CO2 = 0.042, Humidade = 100, NO = 0.04, NO2 = 0.11, Pressao = 1015, Temp = 11.00, Vento = 8 },
                new Meteorologia { LocalID = 2, DataHoraLeitura = new DateTime(2016, 11, 10), CO2 = 0.04, Humidade = 100, NO = 0.05, NO2 = 0.19, Pressao = 1003, Temp = 11.00, Vento = 11 },
                new Meteorologia { LocalID = 2, DataHoraLeitura = new DateTime(2016, 11, 5), CO2 = 0.049, Humidade = 92, NO = 0.05, NO2 = 0.18, Pressao = 1004, Temp = 10.00, Vento = 12 },
                new Meteorologia { LocalID = 2, DataHoraLeitura = new DateTime(2016, 10, 12), CO2 = 0.043, Humidade = 40, NO = 0.03, NO2 = 0.17, Pressao = 1009, Temp = 9.00, Vento = 44 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 11, 12), CO2 = 0.042, Humidade = 45, NO = 0.05, NO2 = 0.18, Pressao = 1014, Temp = 12.00, Vento = 20 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 9, 11), CO2 = 0.041, Humidade = 45, NO = 0.03, NO2 = 0.18, Pressao = 1011, Temp = 13.00, Vento = 10 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 11, 13), CO2 = 0.047, Humidade = 90, NO = 0.05, NO2 = 0.16, Pressao = 1011, Temp = 16.00, Vento = 14 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 1, 12), CO2 = 0.039, Humidade = 100, NO = 0.04, NO2 = 0.13, Pressao = 1012, Temp = 13.00, Vento = 15 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 11, 1), CO2 = 0.038, Humidade = 100, NO = 0.05, NO2 = 0.15, Pressao = 1013, Temp = 15.00, Vento = 14 },
                new Meteorologia { LocalID = 1, DataHoraLeitura = new DateTime(2016, 11, 2), CO2 = 0.046, Humidade = 90, NO = 0.05, NO2 = 0.14, Pressao = 1014, Temp = 14.00, Vento = 14 }

                );

            context.SaveChanges();

        }
    }
}
