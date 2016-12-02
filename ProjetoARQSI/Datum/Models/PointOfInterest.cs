using Datum.UserManagement;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Datum.Models
{
    public class PointOfInterest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PointOfInterestID { get; set; }

        [Column(TypeName = "VARCHAR")]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Nome { get; set; }

        public string Descricao { get; set; }

        
        public int LocalID { get; set; }
        public Local Local { get; set; }

        
        public string CriadorID { get; set; }
        public ApplicationUser Criador { get; set; }
    }
}
