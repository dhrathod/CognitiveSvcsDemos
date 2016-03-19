using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(OcrDemo.Startup))]
namespace OcrDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
