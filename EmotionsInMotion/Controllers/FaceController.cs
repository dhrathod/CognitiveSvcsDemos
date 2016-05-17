using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EmotionsInMotion.Models;
using Newtonsoft.Json;

namespace EmotionsInMotion.Controllers
{
    public class FaceController : ApiController
    {
        // GET: api/Face
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Face/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Face
        public IEnumerable<Face> Post([FromBody]string imageUrl)
        {
            return GetFaceData(imageUrl);
        }

        private static IEnumerable<Face> GetFaceData(string imageUrl)
        {
            var webSvcUrl = "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,smile,facialHair,headPose,glasses";
            string subscriptionKey = ConfigurationManager.AppSettings["FaceApiSubscriptionKey"];
            if (subscriptionKey == null)
            {
                throw new ConfigurationErrorsException("Web Service is missing Subscription Key");
            }
            WebRequest Request = WebRequest.Create(webSvcUrl);
            Request.Method = "POST";
            Request.ContentType = "application / json";
            Request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            using (var streamWriter = new StreamWriter(Request.GetRequestStream()))
            {
                string json = "{"
                + "\"url\": \"" + imageUrl + "\""
                + "}";

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();

                var httpResponse = (HttpWebResponse)Request.GetResponse();

                string result = "";
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    result = streamReader.ReadToEnd();
                }
                httpResponse.Close();

                List<Face> faces = JsonConvert.DeserializeObject<List<Face>>(result);
                return faces;
            }
        }

        // PUT: api/Face/5
        public void Put(int id, [FromBody]string value)
        {
            throw new Exception("PUT not supported");
        }

        // DELETE: api/Face/5
        public void Delete(int id)
        {
            throw new Exception("DELETE not supported");
        }
    }
}
