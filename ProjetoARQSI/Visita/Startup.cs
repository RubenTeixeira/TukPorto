using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Visita.Startup))]
namespace Visita
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
