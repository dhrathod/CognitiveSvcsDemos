using System;
using System.Diagnostics;
using System.IO;
using Microsoft.ProjectOxford.Vision;
using System.Configuration;

namespace ThumbNailConsole
{
    class Program
    {
        static void Main(string[] args)
        {

            string subscriptionKey = ConfigurationSettings.AppSettings["ThumbnailKey"].ToString();

            IVisionServiceClient visionClient = new VisionServiceClient(subscriptionKey);

            string originalPicture = @"https://giard.smugmug.com/Travel/Sweden-2015/i-ncF6hXw/0/L/IMG_1560-L.jpg";
            int width = 200;
            int height = 100;
            bool smartCropping = true;
            var thumbnail = visionClient.GetThumbnailAsync(originalPicture, width, height, smartCropping);
            byte[] thumbnailResult = null;
            thumbnailResult = thumbnail.Result;


            string folder = @"c:\test";
            string thumbnaileFullPath = string.Format("{0}\\thumbnailResult_{1:yyyMMddhhmmss}.jpg", folder, DateTime.Now);
            using (BinaryWriter binaryWrite = new BinaryWriter(new FileStream(thumbnaileFullPath, FileMode.Create, FileAccess.Write)))
            {
                binaryWrite.Write(thumbnailResult);
            }
                
            Process.Start(thumbnaileFullPath);
            Process.Start(originalPicture);

            Console.WriteLine("Done! Thumbnail is at {0}!", thumbnaileFullPath);
        }
    }
}
