using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Lugares.Startup))]
namespace Lugares
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
