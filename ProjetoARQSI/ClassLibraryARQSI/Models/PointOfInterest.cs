using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datum.Models
{
    public class PointOfInterest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PointOfInterestID { get; set; }
        [ForeignKey("Local")]
        public int LocalID { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }


        public virtual Local Local { get; set; }
    }
}
