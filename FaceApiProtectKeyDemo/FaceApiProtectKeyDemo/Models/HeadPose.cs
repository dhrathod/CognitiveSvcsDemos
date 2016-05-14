using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FaceApiProtectKeyDemo.Models
{
    public class HeadPose
    {
        public long Roll { get; set; }
        public long Yaw { get; set; }
        public long Pitch { get; set; }
    }
}