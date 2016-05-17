using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmotionsInMotion.Models
{
    public class FaceAttributes
    {
        public long Age { get; set; }
        public string Gender { get; set; }
        public long Smile { get; set; }
        public string Glasses { get; set; }
        public FacialHair FacialHair { get; set; }
        public HeadPose HeadPose { get; set; }
    }
}