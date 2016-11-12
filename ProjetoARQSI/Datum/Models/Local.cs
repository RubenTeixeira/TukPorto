using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datum.Models
{
    public class Local
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LocalID { get; set; }
        public decimal GPS_Lat { get; set; }
        public decimal GPS_Long { get; set; }
        
        [Column(TypeName = "VARCHAR")]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Nome { get; set; }
    }
}
