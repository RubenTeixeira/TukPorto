

using System.Web.Mvc;

namespace Lugares
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AuthorizeAttribute());
            filters.Add(new AuthorizeAttribute { Roles = "Editor" });
            filters.Add(new RequireHttpsAttribute());
        }
    }
}
