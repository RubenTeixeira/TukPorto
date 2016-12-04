using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace Visita.Helpers
{
    public static class WebApiHttpClient
    {
        public const string WebApiBaseAddress = "https://localhost:44317";
        public const string TokenPath = "/Token";
        public const string RegisterPath = "/Account/Register";
        public const string TokenCookie = "Authorize";


        public static async Task<string> Login(string userName, string password)
        {
            using (var client = GetClient())
            {
                //setup login data
                var formContent = new FormUrlEncodedContent(new[]
                    {
                         new KeyValuePair<string, string>("grant_type", "password"),
                         new KeyValuePair<string, string>("username", userName),
                         new KeyValuePair<string, string>("password", password),
                     });

                //send request
                HttpResponseMessage responseMessage = await client.PostAsync(WebApiBaseAddress + TokenPath, formContent);

                //get access token from response body
                
                var responseJson = await responseMessage.Content.ReadAsStringAsync();
                var jObject = JObject.Parse(responseJson);
                return jObject.GetValue("access_token").ToString();
            }
        }

        public static async Task<bool> Register(string email, string confirmedEmail, string password)
        {
            using (var client = GetClient())
            {
                //setup login data
                var formContent = new FormUrlEncodedContent(new[]
                    {
                         new KeyValuePair<string, string>("grant_type", "password"),
                         new KeyValuePair<string, string>("username", email),
                         new KeyValuePair<string, string>("email", confirmedEmail),
                         new KeyValuePair<string, string>("password", password),
                     });

                //send request
                HttpResponseMessage responseMessage = await client.PostAsync(WebApiBaseAddress + RegisterPath, formContent);

                var responseJson = await responseMessage.Content.ReadAsStringAsync();
                if (responseJson.Contains("The request is invalid."))
                    return false;
                return true;
            }
        }

        public static async Task<string> GetRequest(string token, string requestPath)
        {
            using (var client = GetClient(token))
            {
                //make request
                HttpResponseMessage response = await client.GetAsync(requestPath);
                var responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
        }

        public static HttpClient GetClient()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(WebApiBaseAddress);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            return client;
        }

        public static HttpClient GetClient(string token)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(WebApiBaseAddress);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
            return client;
        }
    }
}