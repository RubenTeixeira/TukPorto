using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cancela
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}/{id2}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, id2 = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DiscreteValues",
                url: "sensores/DiscreteValues/{sensorId}/{facetaId}",
                defaults: new { controller = "Sensores", action = "DiscreteValues", sensorId = "", facetaId = "" }
            );

            routes.MapRoute(
                name: "MinValue",
                url: "sensores/MinValue/{sensorId}/{facetaId}",
                defaults: new { controller = "Sensores", action = "MinValue", sensorId = "", facetaId = "" }
            );
        }
    }
}
