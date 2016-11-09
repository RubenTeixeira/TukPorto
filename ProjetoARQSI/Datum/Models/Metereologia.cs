using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datum.Models
{
    public class Metereologia
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MetereologiaID { get; set; }
        [ForeignKey("Local")]
        public int LocalID { get; set; }
        public DateTime DataHoraLeitura { get; set; }
        public double Temp { get; set; }
        public double Vento { get; set; }
        public int Humidade { get; set; }
        public int Pressao { get; set; }
        public double NO { get; set; }
        public double NO2 { get; set; }
        public double CO2 { get; set; }


        public virtual Local Local { get; set; }

    }
}
