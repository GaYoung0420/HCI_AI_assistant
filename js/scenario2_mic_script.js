active = true;
userSpeak = "";
stageState = window.localStorage.getItem("stageState");
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
        console.log(transcript);
        $("#ai-container").fadeOut(1);
        $("#result-dialog").fadeOut(1);
        $("#selectBox").fadeOut(1);
        $("#user-container").fadeIn();
        $("#user-first-say").val(transcript);
        $("#user-first-say").html('" ' + $("#user-first-say").val() + ' "');
        stageState = window.localStorage.getItem("stageState");
        if (stageState == "scenario2 : caseA" || stageState == "scenario2 : caseA-task1")
          caseA(this.speechApi, transcript);
        else if (
          stageState == "scenario2 : caseB" ||
          stageState == "scenario2 : caseB-task1" ||
          stageState == "scenario2 : caseB-task2" ||
          stageState == "scenario2 : caseB-task3"
        )
          caseB(this.speechApi, transcript);
        else if (
          stageState == "scenario2 : caseC" ||
          stageState == "scenario2 : caseC-task1" ||
          stageState == "scenario2 : caseC-task2"
        )
          caseC(this.speechApi, transcript);
        // stageState = caseB(this.speechApi, transcript);
        $("#select3").click(() => {
          // window.localStorage.setItem("stageState", "caseC-task1");
          // $("#selectBox").fadeOut(1000);
          // caseC(speech.speechApi, "세 번째");

          $("#selectBox").fadeOut(1000);
          $("#user-container").delay(1000).fadeOut();
          $("#ai-container").delay(2000).fadeIn();

          setTimeout(() => {
            document.querySelector("#caseA-1").muted = false;
            document.querySelector("#caseA-1").play();
          }, 2300);
          $("#user-say").html("");
          $("#tree-say").html("가영에게 어떤 내용으로 문자를 보낼까요?");
          window.localStorage.setItem("stageState", "scenario2 : caseC-task2");
        });
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
    $("#result-dialog").hide();
    $("#mic-button").removeClass("mic_buttton_active");
    this.speechApi.stop();
    active = true;
  }
}

window.onload = function () {
  speech = new SpeechRecongnitionAPI();

  speech.init();

  $("#mic-button").on("click", function (e) {
    stageState = window.localStorage.getItem("stageState");
    if (stageState == "scenario2 : caseA-fin") {
      location.href = "./caseB.html";
    } else if (stageState == "scenario2 : caseB-fin") {
      location.href = "./caseC.html";
    } else if (stageState == "scenario2 : caseC-fin") {
      location.href = "../scenario2/caseA.html";
    } else if (active) {
      speech.init();
    } else {
      speech.stop();
    }
  });
};

/***** CaseA *****/
function caseA(api, userSpeak) {
  console.log(userSpeak);
  console.log("stageState:" + stageState);

  if (
    stageState == "scenario2 : caseA" &&
    userSpeak.indexOf("회의") != -1 &&
    userSpeak.indexOf("8") != -1 &&
    userSpeak.indexOf("30") != -1) 
  {
    $("#changed").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseA-1"),
      '"회의" 일정을 오전 8시 30분으로 바꿨어요.',
      "2021.11.12 오전 8:30"
    );
    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseA-fin").muted = false;
      document.querySelector("#caseA-fin").play();
    }, 6000);
    window.localStorage.setItem("stageState", "scenario2 : caseA-fin");
  } else{
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
  }
}




/***** CaseB *****/
let date = "2021.11.12";
let time =  "오전 8:30";
function caseB(api, userSpeak) {
  console.log(userSpeak);
  console.log("stageState:" + stageState);
  /** CaseB-1 **/
  if (
    stageState == "scenario2 : caseB" &&
    userSpeak.indexOf("회의") != -1 &&
    userSpeak.indexOf("8") != -1 &&
    userSpeak.indexOf("30") != -1) 
  {
    $("#changed").hide();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      '이대로 일정을 수정할까요?',
      date+" "+time);
    window.localStorage.setItem("stageState", "scenario2 : caseB-task1");
  } else if (
    /** CaseB-2(2) **/
    stageState == "scenario2 : caseB-task1" &&
    userSpeak.indexOf("날짜") != -1 
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2_2"),
      "어떻게 날짜를 수정할까요?",date+" "+time
    );
  } else if (
    /** CaseB-2(3) **/
    stageState == "scenario2 : caseB-task1" &&
    userSpeak.indexOf("시간") != -1 
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2_3"),
      "어떻게 시간을 수정할까요?",date+" "+time
    );
  }  else if (
    /** CaseB-2-1 **/
    stageState == "scenario2 : caseB-task1" &&
    (userSpeak.indexOf("11") != -1 &&
      userSpeak.indexOf("24") != -1&&
      userSpeak.indexOf("오후") != -1)
  ) {
    date = "2021.11.24";
    time = "오후 8:30";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",date+" "+time
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-1");
  }else if (
    /** CaseB-2-2 **/
    (stageState == "scenario2 : caseB-task1" || 
    stageState == "scenario2 : caseB-task2-3") &&
    (userSpeak.indexOf("11") != -1 &&
      userSpeak.indexOf("24") != -1)
  ) {
    date = "2021.11.24";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",date+" "+time
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-2");
  }else if (
    /** CaseB-2-3 **/
    (stageState == "scenario2 : caseB-task1" || 
    stageState == "scenario2 : caseB-task2-2") &&
    userSpeak.indexOf("오후") != -1  ) {
    time = "오후 8:30";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",date+" "+time
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-3");
  } else if (
    (stageState == "scenario2 : caseB-task2-1" || 
    stageState == "scenario2 : caseB-task2-2" ||
    stageState == "scenario2 : caseB-task2-2") &&(
      date == "2021.11.24" && time == "오후 8:30") && 
    (userSpeak.indexOf("응") != -1 ||
      userSpeak.indexOf("네") != -1 ||
      userSpeak.indexOf("맞") != -1 ||
      userSpeak.indexOf("보내") != -1||
      userSpeak.indexOf("어") != -1||
      userSpeak.indexOf("우") != -1)
  ) {
    /** CaseB-3 **/
    $("#changed").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-3"),
      '일정을 다음과 같이 수정했어요.',
      date+" "+time
    );
    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseB-fin").muted = false;
      document.querySelector("#caseB-fin").play();
    }, 10000);
    window.localStorage.setItem("stageState", "scenario2 : caseB-fin");
  } else if (
    /** CaseB-2(1) **/
    stageState == "scenario2 : caseB-task1" &&
    (userSpeak.indexOf("아니") != -1 ||
      userSpeak.indexOf("바꿔") != -1 ||
      userSpeak.indexOf("수정") != -1 ||
      userSpeak.indexOf("변경") != -1 ||
      userSpeak.indexOf("싫어") != -1)
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-modify"),
      "무엇을 수정할까요?",date+" "+time
    );
  }else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
  }
}

/** 확인 수정 버튼 **/
// $("#confirm-btn").click(() => {});
// $("#modify-btn").click(() => {
//   if (stageState == "caseB-task1") {
//   }
// });

/*** 다이얼로그 fuction ***/
function answerContain(userSpeak, audio, treeS) {
  $("#user-container").delay(1000).fadeOut();
  $("#ai-container").delay(2000).fadeIn();

  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);

  $("#user-say").html("> " + userSpeak);
  $("#tree-say").html(treeS);
}

function resultDialog(userSpeak, audio, treeS, date) {
  $("#user-container").delay(1000).fadeOut();
  $("#result-dialog").delay(2000).fadeIn();
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);
  $("#change-date").val(date);
  $("#change-date").html(date);
  $("#user-say-result").html("> " + userSpeak);
  $("#tree-say-result").html(treeS);
}

function selectDialog(userSpeak, audio) {
  $("#user-container").delay(1000).fadeOut();
  $("#selectBox").delay(2000).fadeIn();
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 3000);
  $("#user-say-select").html("> " + userSpeak);
}

/***** CaseC *****/
// function caseC(api, userSpeak) {
//   console.log(userSpeak);
//   console.log("stageState:" + stageState);
//   /** CaseC-1 **/
//   if (
//     stageState == "scenario2 : caseC" &&
//     userSpeak.indexOf("가영") != -1 &&
//     userSpeak.indexOf("문자") != -1
//   ) {
//     selectDialog(userSpeak, document.querySelector("#caseC-1"));
//     window.localStorage.setItem("stageState", "scenario2 : caseC-task1");
//   } else if (
//     /** CaseC-2 **/
//     stageState == "scenario2 : caseC-task1" &&
//     (userSpeak.indexOf("세") != -1 ||
//       userSpeak.indexOf("010-8981-2508") != -1 ||
//       userSpeak.indexOf("8") != -1 ||
//       userSpeak.indexOf("2") != -1 ||
//       userSpeak.indexOf("0") != -1 ||
//       userSpeak.indexOf("1") != -1)
//   ) {
//     answerContain(
//       userSpeak,
//       document.querySelector("#caseA-1"),
//       "가영에게 어떤 내용으로 문자를 보낼까요?"
//     );
//     window.localStorage.setItem("stageState", "scenario2 : caseC-task2");
//   } else if (
//     stageState == "scenario2 : caseC-task2" &&
//     (userSpeak.indexOf("뭐해") != -1 || userSpeak.indexOf("뭐") != -1)
//   ) {
//     /** CaseC-3 **/
//     $("#checkBtn").hide();
//     resultDialog(
//       userSpeak,
//       document.querySelector("#caseB-4"),
//       '가영(010-8981-2508)에게 "뭐해"라고 문자를 보냈어요',
//       "010-8981-2508"
//     );
//     $("#mic-button").removeClass("mic_buttton_active");
//     api.stop();
//     active = true;
//     setTimeout(() => {
//       document.querySelector("#caseC-fin").muted = false;
//       document.querySelector("#caseC-fin").play();
//     }, 10000);
//     window.localStorage.setItem("stageState", "scenario2 : caseC-fin");
//   } else {
//     answerContain(
//       userSpeak,
//       document.querySelector("#error"),
//       "무슨 말인지 못 알아들었어요."
//     );
//   }
// }

