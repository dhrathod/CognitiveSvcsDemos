using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
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
using Microsoft.ProjectOxford.SpeechRecognition;

namespace SpeechToTextDemo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        AutoResetEvent _FinalResponseEvent;
        MicrophoneRecognitionClient _microphoneRecognitionClient;

        public MainWindow()
        {
            InitializeComponent();
            RecordButton.Content = "Start\nRecording";
            _FinalResponseEvent = new AutoResetEvent(false);

        }

        private void RecordButton_Click(object sender, RoutedEventArgs e)
        {
            RecordButton.Content = "Listening...";
            RecordButton.IsEnabled = false;
            ConvertTextToSpeech();

        }

        private void ConvertTextToSpeech()
        {

            var speechRecognitionMode = SpeechRecognitionMode.ShortPhrase;
            string language = "en-us";
            string subscriptionKey = ConfigurationManager.AppSettings["SpeechKey"].ToString();


            _microphoneRecognitionClient
                    = SpeechRecognitionServiceFactory.CreateMicrophoneClient
                                    (
                                    speechRecognitionMode,
                                    language,
                                    subscriptionKey
                                    );

            _microphoneRecognitionClient.OnPartialResponseReceived += OnPartialResponseReceivedHandler;

            _microphoneRecognitionClient.OnResponseReceived += OnMicShortPhraseResponseReceivedHandler;


            _microphoneRecognitionClient.StartMicAndRecognition();

        }


        void OnPartialResponseReceivedHandler(object sender, PartialSpeechResponseEventArgs e)
        {

            string result = e.PartialResult;
            Dispatcher.Invoke(() =>
            {
                OutputTextbox.Text = (e.PartialResult);
                OutputTextbox.Text += ("\n");

            });

            //WriteLine("{0}", result);
        }



        void OnMicShortPhraseResponseReceivedHandler(object sender, SpeechResponseEventArgs e)
        {
            Dispatcher.Invoke((Action)(() =>
            {

                _FinalResponseEvent.Set();

                // we got the final result, so it we can end the mic reco.  No need to do this
                // for dataReco, since we already called endAudio() on it as soon as we were done
                // sending all the data.
                _microphoneRecognitionClient.EndMicAndRecognition();

                // BUGBUG: Work around for the issue when cached _micClient cannot be re-used for recognition.
                _microphoneRecognitionClient.Dispose();
                _microphoneRecognitionClient = null;

                RecordButton.Content = "Start\nRecording";
                RecordButton.IsEnabled = true;

            }));
        }


    }
}
