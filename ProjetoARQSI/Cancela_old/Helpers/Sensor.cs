using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Cancela.Helpers
{
    [XmlRoot("sensor")]
    public class Sensor : IXmlSerializable
    {

        public string id { get; set; }
        public string nome { get; set; }
        public string descricao { get; set; }

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
            writer.WriteElementString("nome", nome);
            writer.WriteElementString("descricao", descricao);
        }
    }


}