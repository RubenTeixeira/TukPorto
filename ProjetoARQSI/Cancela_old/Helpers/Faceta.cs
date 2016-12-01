using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Cancela.Helpers
{
    public class Faceta : IXmlSerializable
    {
        public string id { get; set; }
        public string CampoBD { get; set; }
        public string Nome { get; set; }
        public string Grandeza { get; set; }
        public string Tipo { get; set; }
        public string Semantica { get; set; }

        public XmlSchema GetSchema()
        {
            throw new NotImplementedException();
        }

        public void ReadXml(XmlReader reader)
        {
            throw new NotImplementedException();
        }

        public void WriteXml(XmlWriter writer)
        {
            writer.WriteAttributeString("id", id);
            writer.WriteElementString("CampoBD", CampoBD);
            writer.WriteElementString("Nome", Nome);
            writer.WriteElementString("Grandeza", Grandeza);
            writer.WriteElementString("Tipo", Tipo);
            writer.WriteElementString("Semantica", Semantica);
        }
    }
}