$(function () {


    var leftPupilX = 0;
    var leftPupilY = 0;
    var rightPupilX = 0;
    var rightPupilY = 0;
    var leftEyeWidth = 10;
    var mouthX = 0;
    var mouthY = 0;

    var showImage = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        if (imageUrl) {
            $("#ImageToAnalyze").attr("src", imageUrl);
        }
    };


    var getFaceInfo = function () {
        var subscriptionKey = getKey() || "Copy or Subscription key here";
        // var subscriptionKey = "cd529ca0a97f48b8a1f3bc36ecd73600";

        var imageUrl = $("#imageUrlTextbox").val();

        var webSvcUrl = "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,smile,facialHair,headPose,glasses";

        var outputDiv = $("#OutputDiv");
        outputDiv.text("Thinking...");


        $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{ "Url": "' + imageUrl + '" }'
        }).done(function (data) {


            if (data.length > 0) {
                var firstFace = data[0];
                var faceId = firstFace.faceId;
                var faceRectange = firstFace.faceRectangle;
                var faceWidth = faceRectange.width;
                var faceHeight = faceRectange.height;
                var faceLeft = faceRectange.left;
                var faceTop = faceRectange.top;
                
                $("#Rectangle").css("top", faceTop);
                $("#Rectangle").css("left", faceLeft);
                $("#Rectangle").css("height", faceHeight);
                $("#Rectangle").css("width", faceHeight);
                $("#Rectangle").css("display", "block");

                var faceLandmarks = firstFace.faceLandmarks;
                var faceAttributes = firstFace.faceAttributes;

                var leftPupil = faceLandmarks.pupilLeft;
                var rightPupil = faceLandmarks.pupilRight;
                var mouth = faceLandmarks.mouthLeft;
                var nose = faceLandmarks.noseLeftAlarOutTip;
                var noseHorizontalCenter = (faceLandmarks.noseLeftAlarOutTip.x + faceLandmarks.noseRightAlarOutTip.x)/2; 
                var mouthTop = faceLandmarks.upperLipTop;
                var mouthBottom = faceLandmarks.underLipBottom;
                var mouthVerticalCenter = (mouthBottom.y + mouthTop.y)/2;
                

                $("#LeftEyeDiv").css("top", leftPupil.y);
                $("#LeftEyeDiv").css("left", leftPupil.x);
                $("#LeftEyeDiv").css("display", "block");
                $("#RightEyeDiv").css("top", rightPupil.y);
                $("#RightEyeDiv").css("left", rightPupil.x);
                $("#RightEyeDiv").css("display", "block");
                $("#NoseDiv").css("top", nose.y);
                $("#NoseDiv").css("left", noseHorizontalCenter);
                $("#NoseDiv").css("display", "block");
                $("#MouthDiv").css("top", mouthVerticalCenter);
                $("#MouthDiv").css("left", mouthTop.x);
                $("#MouthDiv").css("display", "block");
                
                
                

                leftEyeWidth = faceLandmarks.eyebrowLeftInner.x - faceLandmarks.eyebrowLeftOuter.x;
                rightEyeWidth = faceLandmarks.eyebrowRightOuter.x - faceLandmarks.eyebrowRightInner.x;
                mouthWidth = faceLandmarks.mouthRight.x - faceLandmarks.mouthLeft.x;

                var mouthLeft = faceLandmarks.mouthLeft;
                var mouthRight = faceLandmarks.mouthRight;
                var mouthTop = faceLandmarks.upperLipTop;
                var mouthBottom = faceLandmarks.underLipBottom;

                var outputText = "";
                outputText += "Face ID: " + faceId + "<br>";
                outputText += "Top: " + faceTop + "<br>";
                outputText += "Left: " + faceLeft + "<br>";
                outputText += "Width: " + faceWidth + "<br>";
                outputText += "Height: " + faceHeight + "<br>";
                outputText += "Right Pupil: " + rightPupilX + ", " + rightPupilY + "<br>";
                outputText += "Left Pupil: " + leftPupilX + ", " + leftPupilY + "<br>";
                outputText += "Mouth: <br>";
                outputText += " -Left: " + mouthLeft.x + ", " + mouthLeft.y + "<br>";
                outputText += " -Right: " + mouthRight.x + ", " + mouthRight.y + "<br>";
                outputText += " -Top: " + mouthTop.x + ", " + mouthTop.y + "<br>";
                outputText += " -Bottom: " + mouthBottom.x + ", " + mouthBottom.y + "<br>";
                outputText += "Attributes:" + "<br>";
                outputText += "age: " + faceAttributes.age + "<br>";
                outputText += "gender: " + faceAttributes.gender + "<br>";
                outputText += "smile: " + (faceAttributes.smile || "n/a") + "<br>";
                outputText += "glasses: " + faceAttributes.glasses + "<br>";
                
                outputDiv.html(outputText);

            }
            else {
                outputDiv.text("No faces detected.");

            }


        }).fail(function (err) {
            $("#OutputDiv").text("ERROR!" + err.responseText);
        });
    };


    var hideMarkers = function () {
        $(".FaceLabel").css("display", "none");
        $("#Rectangle").css("display", "none");
    };


    $("#ChangeEmotionButton").click(function () {
        hideMarkers();
        ShowSurprise(rightPupilX, rightPupilY, leftPupilX, leftPupilY);
        getFace();

    });

    var ShowSurprise = function (rightEyeX, rightEyeY, leftEyeX, leftEyeY) {
        var faceImage = $("#ImageToAnalyze");

        var surpriseEyeLeft = $("#SurpriseEye-Left");
        var surpriseEyeRight = $("#SurpriseEye-Right");
        var surpriseMouth = $("#SurpriseMouth");



        var ratio = leftEyeWidth / surpriseEyeLeft.width();
        var leftEyeHeight = surpriseEyeLeft.height() * ratio;
        var leftEyeTop = leftPupilY - (leftEyeHeight / 2);
        var leftEyeLeft = leftPupilX - (leftEyeWidth / 2);
        surpriseEyeLeft.css("z-index", 100);
        surpriseEyeLeft.css("height", leftEyeHeight);
        surpriseEyeLeft.css("width", leftEyeWidth);
        surpriseEyeLeft.css("top", leftEyeTop);
        surpriseEyeLeft.css("left", leftEyeLeft);
        surpriseEyeLeft.css("display", "block");

        var ratio = rightEyeWidth / surpriseEyeRight.width();
        var rightEyeHeight = surpriseEyeRight.height() * ratio;
        var rightEyeTop = rightPupilY - (rightEyeHeight / 2);
        var rightEyeLeft = rightPupilX - (rightEyeWidth / 2);
        surpriseEyeRight.css("z-index", 100);
        surpriseEyeRight.css("height", rightEyeHeight);
        surpriseEyeRight.css("width", rightEyeWidth);
        surpriseEyeRight.css("top", rightEyeTop);
        surpriseEyeRight.css("left", rightEyeLeft);
        surpriseEyeRight.css("display", "block");

        var ratio = mouthWidth / surpriseMouth.width();
        var mouthHeight = surpriseMouth.height() * ratio;
        var mouthTop = mouthY;  //- (mouthHeight/3);
        var mouthLeft = mouthX; // - (mouthWidth/2);
        surpriseMouth.css("z-index", 100);
        surpriseMouth.css("height", mouthHeight);
        surpriseMouth.css("width", mouthWidth);
        surpriseMouth.css("top", mouthTop);
        surpriseMouth.css("left", mouthLeft);
        surpriseMouth.css("display", "block");
    }

    $("#imageUrlTextbox").change(function () {
        hideMarkers();
        showImage();
        getFaceInfo();
    })

    $("#imageUrlTextbox").val("https://tena2013.eventpoint.com/resources/documents/p/tena2013/photos/913a496b-7099-e211-ae09-001ec953730b.jpg");
    $("#imageUrlTextbox").val("http://content.latest-hairstyles.com/wp-content/uploads/2013/07/haircuts-for-round-faces-175x125.jpg");
    showImage();
    getFaceInfo();


});

