// Make this data available to all functions
var faceLandmarks = null;
var originalEmotion = "";

$(function () {


    var showImage = function () {
        // Hide links, so user doesn't click too soon.
        $(".changeEmotionLink").css("display", "none");
        $("#resetEmotionLink").css("display", "none");
        

        var imageUrl = $("#imageUrlTextbox").val();
        // Hide any emotions from last image
        $(".EyeMouthImage").css("display", "none");
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

                faceLandmarks = firstFace.faceLandmarks;
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

            originalEmotion = "";

            // Get Emotion with max score
            if (data.length > 0) {
                var firstFace = data[0];
                var emotionScores = firstFace.scores;
                var faceId = firstFace.faceId;
                originalEmotion = getDefaultEmotion(emotionScores);

                $(".changeEmotionLink").css("display", "block");
                $(".changeEmotionLink:contains('" + originalEmotion + "')").css("display", "none");

                outputDiv.text("Original Emotion: " + originalEmotion);
                $("#resetEmotionLink").text("Reset to " + originalEmotion);
                $("#resetEmotionLink").css("display", "block");

            }
            else {
                outputDiv.text("No face detected");
            }

        });
    };

    $(".changeEmotionLink").click(function () {

        $(".EyeMouthImage").css("display", "none");

        var newEmotion = $(this).text();

        $("#OutputDiv").text("Current Emotion: " + newEmotion);

        var leftEyeImage = newEmotion + "LeftEye";
        var rightEyeImage = newEmotion + "RightEye";
        var mouthImage = newEmotion + "Mouth";

        var leftEyeRawImageWidth = $("#" + leftEyeImage).width();
        var rightEyeRawImageWidth = $("#" + rightEyeImage).width();
        var mouthRawImageWidth = $("#" + mouthImage).width();
        var leftEyeRawImageHeight = $("#" + leftEyeImage).height();
        var rightEyeRawImageHeight = $("#" + rightEyeImage).height();
        var mouthRawImageHeight = $("#" + mouthImage).height();

        console.log("leftEyeRawImageWidth: " + leftEyeRawImageWidth);
        console.log("rightEyeRawImageWidth: " + rightEyeRawImageWidth);
        console.log("mouthRawImageWidth: " + mouthRawImageWidth);
        console.log("leftEyeRawImageHeight: " + leftEyeRawImageHeight);
        console.log("rightEyeRawImageHeight: " + rightEyeRawImageHeight);
        //console.log("mouthRawImageHeight: " + mouthRawImageHeight);
        console.log("eyebrowRightOuter: " + faceLandmarks.eyebrowRightOuter.x + ", " + faceLandmarks.eyebrowRightOuter.y);
        console.log("eyeRightOuter: " + faceLandmarks.eyeRightOuter.x + ", " + faceLandmarks.eyeRightOuter.y);
        console.log("eyebrowRightInner: " + faceLandmarks.eyebrowRightInner.x + ", " + faceLandmarks.eyebrowRightInner.y);
        console.log("eyeRightInner: " + faceLandmarks.eyeRightInner.x + ", " + faceLandmarks.eyeRightInner.y);

        var leftEyeTopLeftX = faceLandmarks.eyebrowLeftOuter.x;
        var leftEyeTopLeftY = faceLandmarks.eyebrowLeftOuter.y;
        var leftEyeTopY = Math.min(
            faceLandmarks.eyebrowLeftOuter.y,
            faceLandmarks.eyebrowLeftInner.y,
            faceLandmarks.eyeLeftOuter.y,
            faceLandmarks.eyeLeftInner.y
            );
        var leftEyeWidth = Math.max(faceLandmarks.eyebrowLeftInner.x, faceLandmarks.eyeLeftInner.x) - Math.min(faceLandmarks.eyebrowLeftOuter.x, faceLandmarks.eyeLeftOuter.x);
        leftEyeWidth = leftEyeWidth * 1.5; // Make it bigger to cover entire eye
        var leftEyeImageScaling = leftEyeWidth / leftEyeRawImageWidth;
        var leftEyeHeight = leftEyeRawImageHeight * leftEyeImageScaling;

        var rightEyeTopLeftX = Math.min (faceLandmarks.eyebrowRightInner.x, faceLandmarks.eyeRightInner.x);
        var rightEyeTopLeftY = faceLandmarks.eyebrowRightOuter.y;
        var rightEyeTopY = Math.min(
            faceLandmarks.eyebrowRightOuter.y,
            faceLandmarks.eyebrowRightInner.y,
            faceLandmarks.eyeRightOuter.y,
            faceLandmarks.eyeRightInner.y
            );
        var rightEyeWidth = Math.max(faceLandmarks.eyebrowRightOuter.x, faceLandmarks.eyeRightOuter.x) - Math.min(faceLandmarks.eyebrowRightInner.x, faceLandmarks.eyeRightInner.x);
        rightEyeWidth = rightEyeWidth * 1.5; // Make it bigger to cover entire eye
        var rightEyeImageScaling = rightEyeWidth / rightEyeRawImageWidth;
        var rightEyeHeight = rightEyeRawImageHeight * rightEyeImageScaling;

        var mouthTopLeftX = faceLandmarks.mouthLeft.x;
        var mouthTopLeftY = faceLandmarks.mouthLeft.y;
        var mouthWidth = faceLandmarks.mouthRight.x - faceLandmarks.mouthLeft.x;
        mouthWidth = mouthWidth * 1.5; // Make it bigger to cover entire mouth
        var mouthImageScaling = mouthWidth / mouthRawImageWidth;

        var mouthHeight = mouthRawImageHeight * mouthImageScaling;




        var mouthSelector = "#" + mouthImage;
        $(mouthSelector).css("top", mouthTopLeftY);
        $(mouthSelector).css("left", mouthTopLeftX);
        $(mouthSelector).css("height", mouthHeight);
        $(mouthSelector).css("width", mouthWidth);
        $(mouthSelector).css("z-index", "10");
        $(mouthSelector).css("display", "block");

        var rightEyeSelector = "#" + rightEyeImage;
        $(rightEyeSelector).css("top", rightEyeTopY);
        $(rightEyeSelector).css("left", rightEyeTopLeftX);
        $(rightEyeSelector).css("height", rightEyeHeight);
        $(rightEyeSelector).css("width", rightEyeWidth);
        $(rightEyeSelector).css("z-index", "10");
        $(rightEyeSelector).css("display", "block");

        var leftEyeSelector = "#" + leftEyeImage;
        $(leftEyeSelector).css("top", leftEyeTopY);
        $(leftEyeSelector).css("left", leftEyeTopLeftX);
        $(leftEyeSelector).css("height", leftEyeHeight);
        $(leftEyeSelector).css("width", leftEyeWidth);
        $(leftEyeSelector).css("z-index", "10");
        $(leftEyeSelector).css("display", "block");

    })

    var getDefaultEmotion= function(emotionScores){
        var emotion = "Unknown";
        var emotionScore = 0;
        if (emotionScores.anger > emotionScore) {
            emotionScore = emotionScores.anger;
            emotion = "Anger";
        }

        if (emotionScores.contempt > emotionScore) {
            emotionScore = emotionScores.contempt;
            emotion = "Contempt";
        }
        if (emotionScores.disgust > emotionScore) {
            emotionScore = emotionScores.disgust;
            emotion = "Disgust";
        }
        if (emotionScores.fear > emotionScore) {
            emotionScore = emotionScores.fear;
            emotion = "Fear";
        }
        if (emotionScores.happiness > emotionScore) {
            emotionScore = emotionScores.happiness;
            emotion = "Happiness";
        }
        if (emotionScores.neutral > emotionScore) {
            emotionScore = emotionScores.neutral;
            emotion = "Neutral";
        }
        if (emotionScores.sadness > emotionScore) {
            emotionScore = emotionScores.sadness;
            emotion = "Sadness";
        }
        if (emotionScores.surprise > emotionScore) {
            emotionScore = emotionScores.surprise;
            emotion = "Surprise";
        }

        return emotion;

    }

    $("#resetEmotionLink").click(function () {
        $(".EyeMouthImage").css("display", "none");
        $("#OutputDiv").text("Current Emotion: " + originalEmotion );
    })

    $("#imageUrlTextbox").change(function () {
        showImage();
        getFaceInfo();
    })

    $(".img-thumbnail").click(function () {
        var image = $(this).attr("data-photo");
        var imageUrl = "http://emotionsinmotion.azurewebsites.net/samples/" + image;
        $("#imageUrlTextbox").val(imageUrl);
        showImage();
        getFaceInfo();
    })
    
    $("#imageUrlTextbox").val("https://tena2013.eventpoint.com/resources/documents/p/tena2013/photos/913a496b-7099-e211-ae09-001ec953730b.jpg");
    showImage();
    getFaceInfo();


});

