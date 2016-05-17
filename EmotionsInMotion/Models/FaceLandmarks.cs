using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmotionsInMotion.Models
{
    public class FaceLandmarks
    {
        public FacePoint PupilLeft { get; set; }
        public FacePoint PupilRight { get; set; }
        public FacePoint NoseTip { get; set; }
        public FacePoint MouthLeft { get; set; }
        public FacePoint MouthRight { get; set; }
        public FacePoint EyebrowLeftOuter { get; set; }
        public FacePoint EyebrowLeftInner { get; set; }
        public FacePoint EyeLeftOuter { get; set; }
        public FacePoint EyeLeftInner { get; set; }
        public FacePoint EyeLeftBottom { get; set; }
        public FacePoint EyeLeftTop { get; set; }
        public FacePoint EyebrowRightOuter { get; set; }
        public FacePoint EyebrowRightInner { get; set; }
        public FacePoint EyeRightOuter { get; set; }
        public FacePoint EyeRightInner { get; set; }
        public FacePoint EyeRightBottom { get; set; }
        public FacePoint EyeRightTop { get; set; }
        public FacePoint NoseRootLeft { get; set; }
        public FacePoint NoseRootRight { get; set; }
        public FacePoint NoseLeftAlarTop { get; set; }
        public FacePoint NoseRightAlarTop { get; set; }
        public FacePoint NoseLeftAlarOutTip { get; set; }
        public FacePoint NoseRightAlarOutTip { get; set; }
        public FacePoint UpperLipTop { get; set; }
        public FacePoint UpperLipBottom { get; set; }
        public FacePoint UnderLipTop { get; set; }
        public FacePoint UnderLipBottom { get; set; }
    }
}