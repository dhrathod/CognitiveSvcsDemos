using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmotionsInMotion.Models
{
    public class Face
    {
        public string FaceId { get; set; }
        public FaceRectangle FaceRectangle { get; set; }
        public FaceLandmarks FaceLandmarks { get; set; }
        public FaceAttributes FaceAttributes { get; set; }
    }
}