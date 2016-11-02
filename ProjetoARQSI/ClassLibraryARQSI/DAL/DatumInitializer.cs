using Datum.Models;
using System.Collections.Generic;


namespace Datum.DAL
{
    public class DatumInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<DatumContext>
    {
        protected override void Seed(DatumContext context)
        {
            var locais = new List<Local>
            {
                new Local {Nome="Porto",GPS_Lat=41.1628634M,GPS_Long=-8.6568726M},
                new Local {Nome="Lisboa",GPS_Lat=38.7436056M,GPS_Long=-9.2302442M}
            };

            locais.ForEach(s => context.Locals.Add(s));
            context.SaveChanges();
            
        }
    }
}