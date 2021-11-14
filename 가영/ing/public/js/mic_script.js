active = true;
userSpeak = "";
stageState = "";

class SpeechRecongnitionAPI {
  constructor() {
    const SpeechToText =
      window.SpeechRecongnition || window.webkitSpeechRecognition;
    this.speechApi = new SpeechToText();
    this.speechApi.continuous = true;
    this.speechApi.interimResult = true;
    this.speechApi.onresult = (event) => {
      var current = event.resultIndex;
      var transcript = event.results[current][0].transcript;
      var mobileRepeatBug =
        current == 1 && transcript == event.results[0][0].transcript;

      if (!mobileRepeatBug) {
        $("#ai-container").fadeOut(1);
        $("#user-container").fadeIn();
        $("#user-first-say").val(transcript);
        $("#user-first-say").html('" ' + $("#user-first-say").val() + ' "');
        stageState = stageA(this.speechApi, transcript, this);
      }
    };
    // this.speechApi.onspeechend = function () {
    //   console.log("Speech has stopped being detected");
    //   $("#user-container").hide();
    //   $("#mic-button").removeClass("mic_buttton_active");
    //   this.speechApi.stop();
    //   active = true;
    // };
  }
  init() {
    $("#ai-container").fadeOut();
    this.speechApi.start();
    $("#mic-button").addClass("mic_buttton_active");
    active = false;
  }
  stop() {
    $("#user-container").hide();
    $("#mic-button").removeClass("mic_buttton_active");
    this.speechApi.stop();
    active = true;
  }
}

window.onload = function () {
  let speech = new SpeechRecongnitionAPI();

  speech.init();

  $("#mic-button").on("click", function (e) {
    if ((stageState = "caseA-fin")) {
    }

    if (active) {
      speech.init();
    } else {
      speech.stop();
    }
  });
};

function stageA(api, userSpeak, speakClass) {
  console.log(userSpeak);
  console.log("stageState:" + stageState);
  if (
    stageState == "" &&
    userSpeak.indexOf("가영") != -1 &&
    userSpeak.indexOf("문자") != -1
  ) {
    answerContain(
      userSpeak,
      document.querySelector("#caseA-1"),
      "가영에게 어떤 내용으로 문자를 보낼까요?"
    );
    return "caseA-task1";
  } else if (
    stageState == "caseA-task1" &&
    (userSpeak.indexOf("뭐해") != -1 || userSpeak.indexOf("뭐") != -1)
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#finish"),
      '가영이에게 "뭐해"라고 문자를 보냈어요',
      "010-1234-5678"
    );
    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseA-fin").muted = false;
      document.querySelector("#caseA-fin").play();
    }, 5000);
    return "caseA-fin";
  }
}

function answerContain(userSpeak, audio, treeS) {
  $("#user-container").delay(1000).fadeOut();
  // $("#mic-button").removeClass("mic_buttton_active");
  // api.stop();
  // active = true;

  $("#ai-container").delay(2000).fadeIn();

  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);

  $("#user-say").html(">" + userSpeak);
  $("#tree-say").html(treeS);
}

function resultDialog(userSpeak, audio, treeS, phoneNum) {
  $("#user-container").delay(1000).fadeOut();
  $("#result-dialog").delay(2000).fadeIn();
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);
  $("#phone-num").val(phoneNum);
  $("#phone-num").html(phoneNum);
  $("#user-say-result").html(">" + userSpeak);
  $("#tree-say-result").html(treeS);
}
