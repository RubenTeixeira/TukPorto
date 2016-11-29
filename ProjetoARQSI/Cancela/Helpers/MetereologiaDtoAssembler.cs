using Datum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cancela.Helpers
{
    static class MetereologiaDtoAssembler
    {
        public static MetereologiaDto convert(Meteorologia m)
        {
            return new MetereologiaDto
            {

                Data = m.DataHoraLeitura.ToString("yyyy-MM-dd"),
                Hora = m.DataHoraLeitura.ToString("HH:mm"),
                Local = m.Local.Nome,
                Temp = m.Temp.ToString(),
                Vento = m.Vento.ToString(),
                Humidade = m.Humidade.ToString(),
                Pressao = m.Pressao.ToString(),
                NO = m.NO.ToString(),
                NO2 = m.NO2.ToString(),
                CO2 = m.CO2.ToString()
            };
        }
    }
}