using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Emotion.Contract;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace EmotionsDemo
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();

            // Angry girl
            ImageUrlCombobox.Items.Add("http://4.bp.blogspot.com/-b2L0jhNLbec/T5VouZK2g-I/AAAAAAAAEzY/253HyiLjxOQ/s1600/angry+face+girl+(2).jpg");
            // Sad Lebron
            ImageUrlCombobox.Items.Add("http://www.chuggers.ca/wp-content/uploads/2013/08/lebron-sad-photo.jpg");
            // Happy group
            ImageUrlCombobox.Items.Add("http://hotelkappara.com/wp-content/uploads/2011/08/Happy-group-of-people.jpg");
            // Mixed group
            ImageUrlCombobox.Items.Add("http://www.thoughtpursuits.com/wp-content/uploads/2014/03/happy-sad-face-720x340.jpg");

            ImageUrlCombobox.SelectedIndex = 0;

        }

        private void GetEmotionsButton_Click(object sender, RoutedEventArgs e)
        {

            string url = "";
            url = @"http://www.asianweek.com/wp-content/uploads/2008/04/dreamstimeweb_angry374345_11.jpg";
            //url = ImageUrlTextbox.Text;
            url = ImageUrlCombobox.SelectedValue.ToString();
            GetEmotions(url);

        }

        private async void GetEmotions(string imageUrl)
        {

            Windows.Storage.ApplicationDataContainer localSettings =
                Windows.Storage.ApplicationData.Current.LocalSettings;
            Windows.Storage.StorageFolder localFolder =
                Windows.Storage.ApplicationData.Current.LocalFolder;

            //localSettings.Values["EmotionApiKey"] = "<replace_with_your-api_key_and_uncomment";
            string emotionApiKey = localSettings.Values["EmotionApiKey"].ToString();

            var emotionServiceClient = new EmotionServiceClient(emotionApiKey);

            Emotion[] emotionResult = await emotionServiceClient.RecognizeAsync(imageUrl);

            //emotionResult.
            //var firstEmotion = emotionResult.First();

            var sb1 = new StringBuilder();
            var sb2 = new StringBuilder();
            var faceNumber = 0;
            foreach (Emotion em in emotionResult)
            {
                faceNumber++;
                var scores = em.Scores;

                var anger = scores.Anger;
                var contempt = scores.Contempt;
                var disgust = scores.Disgust;
                var fear = scores.Fear;
                var happiness = scores.Happiness;
                var neutral = scores.Neutral;
                var surprise = scores.Surprise;
                var sadness = scores.Sadness;

                sb1.Append(string.Format("Face {0}\n", faceNumber));
                sb1.Append("Scores:\n");
                sb1.Append(string.Format("Anger: {0:0.000000}\n", anger));
                sb1.Append(string.Format("Contempt: {0:0.000000}\n", contempt));
                sb1.Append(string.Format("Disgust: {0:0.000000}\n", disgust));
                sb1.Append(string.Format("Fear: {0:0.000000}\n", fear));
                sb1.Append(string.Format("Happiness: {0:0.000000}\n", happiness));
                sb1.Append(string.Format("Neutral: {0:0.000000}\n", neutral));
                sb1.Append(string.Format("Surprise: {0:0.000000}\n", surprise));
                sb1.Append(string.Format("Sadness: {0:0.000000}\n", sadness));
                sb1.Append("\n");

                var emotionScoresList = new List<EmotionScore>();
                emotionScoresList.Add(new EmotionScore("anger", anger));
                emotionScoresList.Add(new EmotionScore("contempt", contempt));
                emotionScoresList.Add(new EmotionScore("disgust", disgust));
                emotionScoresList.Add(new EmotionScore("fear", fear));
                emotionScoresList.Add(new EmotionScore("happiness", happiness));
                emotionScoresList.Add(new EmotionScore("neutral", neutral));
                emotionScoresList.Add(new EmotionScore("surprise", surprise));
                emotionScoresList.Add(new EmotionScore("sadness", sadness));

                var maxEmotionScore = emotionScoresList.Max(e => e.EmotionValue);
                var likelyEmotion = emotionScoresList.First(e => e.EmotionValue == maxEmotionScore);



                //var emotions = new EmotionScore[8];
                //emotions[0] = new EmotionScore("anger", anger);
                //emotions[1] = new EmotionScore("contempt", contempt);
                //emotions[2] = new EmotionScore("disgust", disgust);
                //emotions[3] = new EmotionScore("fear", fear);
                //emotions[4] = new EmotionScore("happiness", happiness);
                //emotions[5] = new EmotionScore("neutral", neutral);
                //emotions[6] = new EmotionScore("surprise", surprise);
                //emotions[7] = new EmotionScore("sadness", sadness);

                //emotions.OrderByDescending(e=>e.EmotionValue);

                //EmotionScore likelyEmotion = emotions.First();

                string likelyEmotionText = string.Format("Face {0} is {1:N2}% likely to experiencing: {2}\n\n", 
                    faceNumber, likelyEmotion.EmotionValue * 100, likelyEmotion.EmotionName.ToUpper());
                sb2.Append(likelyEmotionText);

            }
            var resultsDump = sb1.ToString();
            RawResultsTextblock.Text = resultsDump;

            ResultsTextblock.Text = sb2.ToString();
        }

        private string xGetLikelyEmotion()
        {
            return "";
        }
    }
}


public class EmotionScore
{
    public EmotionScore(string emotionName, float emotionValue)
    {
        EmotionName = emotionName;
        EmotionValue = emotionValue;
    }
    public string EmotionName { get; set; }
    public float EmotionValue { get; set; }

}
