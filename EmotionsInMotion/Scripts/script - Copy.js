$(function () {
    var showImage = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        if (imageUrl) {
            $("#ImageToAnalyze").attr("src", imageUrl);
        }
    };


    var getFaceInfo = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        webSvcUrl = "api/face";

        var outputDiv = $("#OutputDiv");
        outputDiv.text("Thinking...");


        $.ajax({
            type: "POST",
            url: webSvcUrl,
            data: JSON.stringify(imageUrl),
            contentType: "application/json;charset=utf-8"
        }).done(function (data) {


            if (data.length > 0) {
                var firstFace = data[0];
                var faceId = firstFace.faceId;
                var faceRectange = firstFace.faceRectangle;
                var faceWidth = faceRectange.width;
                var faceHeight = faceRectange.height;
                var faceLeft = faceRectange.left;
                var faceTop = faceRectange.top;

                var faceLandmarks = firstFace.faceLandmarks;
                var faceAttributes = firstFace.faceAttributes;

                var leftPupil = faceLandmarks.pupilLeft;
                var rightPupil = faceLandmarks.pupilRight;
                var mouth = faceLandmarks.mouthLeft;
                var nose = faceLandmarks.noseLeftAlarOutTip;
                var noseHorizontalCenter = (faceLandmarks.noseLeftAlarOutTip.x + faceLandmarks.noseRightAlarOutTip.x) / 2;
                var mouthTop = faceLandmarks.upperLipTop;
                var mouthBottom = faceLandmarks.underLipBottom;
                var mouthVerticalCenter = (mouthBottom.y + mouthTop.y) / 2;

                leftEyeWidth = faceLandmarks.eyebrowLeftInner.x - faceLandmarks.eyebrowLeftOuter.x;
                rightEyeWidth = faceLandmarks.eyebrowRightOuter.x - faceLandmarks.eyebrowRightInner.x;
                mouthWidth = faceLandmarks.mouthRight.x - faceLandmarks.mouthLeft.x;

                var mouthLeft = faceLandmarks.mouthLeft;
                var mouthRight = faceLandmarks.mouthRight;
                var mouthTop = faceLandmarks.upperLipTop;
                var mouthBottom = faceLandmarks.underLipBottom;

                outputDiv.text("Face at " + faceLeft + ", " + faceTop);

                getEmotion();
            }
            else {
                outputDiv.text("No faces detected.");

            }

        }).fail(function (err) {
            $("#OutputDiv").text("ERROR!" + err.responseText);
        });
    };

    var getEmotion = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        webSvcUrl = "api/emotion";

        var outputDiv = $("#OutputDiv");
        outputDiv.text("Thinking...");


        $.ajax({
            type: "POST",
            url: webSvcUrl,
            data: JSON.stringify(imageUrl),
            contentType: "application/json;charset=utf-8"
        }).done(function (data) {

            var emotion = "";

            // Get Emotion with max score
            if (data.length > 0) {
                var firstFace = data[0];
                var emotionScores = firstFace.scores;
                var faceId = firstFace.faceId;
                var emtionScore = emotionScores.anger;
                emotion = "anger";
                if (emotionScores.contempt > emtionScore) {
                    emtionScore = emotionScores.contempt;
                    emotion = "contempt";
                }
                if (emotionScores.disgust > emtionScore) {
                    emtionScore = emotionScores.disgust;
                    emotion = "disgust";
                }
                if (emotionScores.fear > emtionScore) {
                    emtionScore = emotionScores.fear;
                    emotion = "fear";
                }
                if (emotionScores.happiness > emtionScore) {
                    emtionScore = emotionScores.happiness;
                    emotion = "happiness";
                }
                if (emotionScores.neutral > emtionScore) {
                    emtionScore = emotionScores.neutral;
                    emotion = "neutral";
                    if (emotionScores.sadness > emtionScore) {
                        emtionScore = emotionScores.sadness;
                        emotion = "sadness";
                    }
                    if (emotionScores.surprise > emtionScore) {
                        emtionScore = emotionScores.surprise;
                        emotion = "surprise";
                    }
                    if (emotionScores.disgust > emtionScore) {
                        emtionScore = emotionScores.disgust;
                        emotion = "disgust";
                    }

                    outputDiv.text("Default Emotion: " + emotion);
                }
                else {
                    outputDiv.text("No face detected");
                }
            }

        });
    };






    $("#imageUrlTextbox").change(function () {
        showImage();
        getFaceInfo();
    })

    // $("#imageUrlTextbox").val("https://tena2013.eventpoint.com/resources/documents/p/tena2013/photos/913a496b-7099-e211-ae09-001ec953730b.jpg");
    // $("#imageUrlTextbox").val("http://content.latest-hairstyles.com/wp-content/uploads/2013/07/haircuts-for-round-faces-175x125.jpg");
    $("#imageUrlTextbox").val("http://cache3.asset-cache.net/gc/481501023-close-up-portrait-of-old-black-man-with-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=esg%2bVK6qs4oIjoYYcweKEaG2pptAYfOPpuLOWcyxTSE%3d");
    showImage();
    getFaceInfo();


});

