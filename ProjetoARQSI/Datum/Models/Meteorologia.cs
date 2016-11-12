using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datum.Models
{
    public class Meteorologia
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MetereologiaID { get; set; }

        // Local e DataHoraLeitura devem ser unicos

        [Index("IDX_UNIQUE_METEO", 1, IsUnique = true)]
        public int LocalID { get; set; }
        public Local Local { get; set; }

        [Index("IDX_UNIQUE_METEO", 2, IsUnique = true)]
        public DateTime DataHoraLeitura { get; set; }


        public double Temp { get; set; }
        public double Vento { get; set; }
        public int Humidade { get; set; }
        public int Pressao { get; set; }
        public double NO { get; set; }
        public double NO2 { get; set; }
        public double CO2 { get; set; }



    }
}
