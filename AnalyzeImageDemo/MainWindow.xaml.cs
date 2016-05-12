using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Microsoft.ProjectOxford.Vision;
using Microsoft.ProjectOxford.Vision.Contract;

namespace AnalyzeImageDemo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            ImageUrlComboBox.Items.Add("http://2.bp.blogspot.com/-PoUR2nj2Ifs/UHbPZGo1W8I/AAAAAAAAEfs/pO9QWEoFbsk/s1600/cute-baby-kittens.jpeg");
            ImageUrlComboBox.Items.Add("http://www.liveintentionally.org/wp-content/uploads/2011/07/freedom-bald-eagle-flying.jpg");
            ImageUrlComboBox.Items.Add("http://imguol.com/2013/03/14/christopher-power-1363276244301_400x500.jpg");
            ImageUrlComboBox.SelectedIndex = 0;
        }

        private async void AnalyzeButton_Click(object sender, RoutedEventArgs e)
        {

            string subscriptionKey = "e4df9eb47d0a40a4b43e627483ed5bb0";
            VisionServiceClient visionServiceClient = new VisionServiceClient(subscriptionKey);

            //string imageUrl = "http://imguol.com/2013/03/14/christopher-power-1363276244301_400x500.jpg";
            //string[] visualFeatures = null;
            var visualFeaturesList = new List<VisualFeature>();
            visualFeaturesList.Add(VisualFeature.Adult);
            visualFeaturesList.Add(VisualFeature.Categories);
            visualFeaturesList.Add(VisualFeature.Description);
            visualFeaturesList.Add(VisualFeature.Color);
            visualFeaturesList.Add(VisualFeature.Faces);
            visualFeaturesList.Add(VisualFeature.ImageType);
            visualFeaturesList.Add(VisualFeature.Tags);



            var imageUrl = ImageUrlComboBox.SelectedValue.ToString();

            AnalysisResult analysisResult = await visionServiceClient.AnalyzeImageAsync(imageUrl, visualFeaturesList);

            CaptionTextBox.Text = analysisResult.Description.Captions[0].Text;
            string[] tags = analysisResult.Description.Tags;
            TagsListBox.Items.Clear();
            foreach (string tag in tags)
            {
                TagsListBox.Items.Add(tag);
            }

            var racyScore = analysisResult.Adult.RacyScore;
            ShockingImage.Visibility = Visibility.Collapsed;
            if (racyScore > 0.3)
            {
                ShockingImage.Visibility = Visibility.Visible;
            }


        }
    }
}
