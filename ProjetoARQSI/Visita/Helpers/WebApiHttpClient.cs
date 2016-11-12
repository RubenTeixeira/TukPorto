using System;
using System.Net.Http;
namespace Visita.Helpers
{
    public static class WebApiHttpClient
    {
        public const string WebApiBaseAddress = "http://localhost:4168/";
        public static HttpClient GetClient()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(WebApiBaseAddress);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new
            System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            return client;
        }
    }
}