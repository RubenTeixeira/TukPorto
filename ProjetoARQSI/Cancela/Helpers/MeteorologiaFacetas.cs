using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Cancela.Helpers
{
    [XmlRoot("Facetas")]
    public class MeteorologiaFacetas
    {
        public ICollection<Faceta> facetas { get; set; }

        public MeteorologiaFacetas()
        {
            facetas = new List<Faceta>();
        }

        public void addFaceta(string id, string campoBD, string nome, string grandeza, string tipo, string semantica)
        {
            facetas.Add(new Faceta { id=id, CampoBD=campoBD, Nome=nome, Grandeza=grandeza, Tipo=tipo, Semantica=semantica });
        }

    }
}