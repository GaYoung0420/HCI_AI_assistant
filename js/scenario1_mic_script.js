let start,end,time,errorCount = 0;
let Scenario1 = new Object();
let CaseA = new Array();
let CaseB = new Array();
let CaseC = new Array();

active = true;
userSpeak = "";
stageState = window.localStorage.getItem("stageState");

if(stageState.indexOf("caseA") != -1 ||stageState.indexOf("caseB") != -1 
 ||stageState.indexOf("caseC") != -1 ){
  startStage = stageState;
  console.log(startStage);
 }
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
        $("#result-dialog").fadeOut(1);
        $("#selectBox").fadeOut(1);
        $("#user-container").fadeIn();
        $("#user-first-say").val(transcript);
        $("#user-first-say").html('" ' + $("#user-first-say").val() + ' "');
        stageState = window.localStorage.getItem("stageState");
        if (stageState == "scenario1 : caseA" || stageState == "scenario1 : caseA-task1"){
          if (stageState == "scenario1 : caseA")
            start = new Date();
          caseA(this.speechApi, transcript);
        }
        else if (
          stageState == "scenario1 : caseB" ||
          stageState == "scenario1 : caseB-task1" ||
          stageState == "scenario1 : caseB-task2" ||
          stageState == "scenario1 : caseB-task3"
        ){
          if (stageState == "scenario1 : caseB")
            start = new Date();
          caseB(this.speechApi, transcript);
        }
        else if (
          stageState == "scenario1 : caseC" ||
          stageState == "scenario1 : caseC-task1" ||
          stageState == "scenario1 : caseC-task2"
        ){
          if (stageState == "scenario1 : caseB")
            start = new Date();
          caseC(this.speechApi, transcript);
        }
      }  
    }
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
    if (stageState == "scenario1 : caseA-fin") {
      location.href = "./caseB.html";
    } else if (stageState == "scenario1 : caseB-fin") {
      location.href = "./caseC.html";
    } else if (stageState == "scenario1 : caseC-fin") {
      location.href = "../scenario2/caseA.html";
    } else if (active) {
      speech.init();
    } else {
      speech.stop();
    }
  });

  $("#replay").on("click", function (e) {
    window.localStorage.setItem("stageState", startStage);
    window.location.reload()
  });
};

//******  사용자 입력 언어 체크 함수  ******/
function stateAndUserSpeak(arrayCase,stage,userSpeak){
  let state = new Object();
  state.stage = stage;
  state.user = userSpeak;
  arrayCase.push(state);
  console.log(arrayCase)
}
//******  사용자 수행 시간 측정 함수  ******/
function checkTime(arrayCase) {
  end = new Date();
  let timer = new Object();
  let error = new Object();
  time = end - start; // 밀리초 단위로 반환
  // console.log("start : "+ start);
  // console.log("end : "+ end);
  timer.time = time; 
  error.errorCount = errorCount;
  arrayCase.push(error);
  arrayCase.push(timer);
}

//*************************************************************************************************
//********************************************* CaseA *********************************************
//*************************************************************************************************

function caseA(api, userSpeak) {
  // console.log(userSpeak);
  // console.log("stageState:" + stageState);

  if (
    stageState == "scenario1 : caseA" &&
    (userSpeak.indexOf("가영") != -1 ||
    userSpeak.indexOf("문자") != -1)
  ) {
    //** CaseA-1 **/
    answerContain(
      userSpeak,
      document.querySelector("#caseA-1"),
      "가영에게 어떤 내용으로 문자를 보낼까요?"
    );
    window.localStorage.setItem("stageState", "scenario1 : caseA-task1");
    stateAndUserSpeak(CaseA,"scenario1 : caseA-task1",userSpeak);
  } else if (
    stageState == "scenario1 : caseA-task1" &&
    (userSpeak.indexOf("뭐해") != -1 || userSpeak.indexOf("뭐") != -1)
  ) {
    //** CaseA-fin **/
    resultDialog(
      userSpeak,
      document.querySelector("#finish"),
      '가영(010-1234-5678)에게 "뭐해"라고 문자를 보냈어요',
      "010-1234-5678"
    );
    
    window.localStorage.setItem("stageState", "scenario1 : caseA-fin");

    stateAndUserSpeak(CaseA,"scenario1 : caseA-fin",userSpeak);
    checkTime(CaseA);
    Scenario1.CaseA = CaseA;
    window.localStorage.setItem("Scenario1", JSON.stringify(Scenario1));
    console.log(Scenario1);

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseA-fin").muted = false;
      document.querySelector("#caseA-fin").play();
    }, 10000);

  } else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}
//*************************************************************************************************
//********************************************* CaseB *********************************************
//*************************************************************************************************

function caseB(api, userSpeak) {
  console.log(CaseA)
  //** CaseB-1 **/
  if (
    stageState == "scenario1 : caseB" &&
    (userSpeak.indexOf("가영") != -1 ||
    userSpeak.indexOf("문자") != -1)
  ) {
    start = new Date();
    Scenario1 = JSON.parse(window.localStorage.getItem("Scenario1"));
    answerContain(
      userSpeak,
      document.querySelector("#caseA-1"),
      "가영에게 어떤 내용으로 문자를 보낼까요?"
    );
    window.localStorage.setItem("stageState", "scenario1 : caseB-task1");
    stateAndUserSpeak(CaseB,"scenario1 : caseB-task1",userSpeak);
  } else if (
    //** CaseB-2 **/
    stageState == "scenario1 : caseB-task1" &&
    (userSpeak.indexOf("뭐해") != -1 || userSpeak.indexOf("뭐") != -1)
  ) {
    $("#checkBtn").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      '가영(010-1234-5678)에게 "뭐해"라고 문자를 보낼까요?',
      "010-1234-5678"
    );
    window.localStorage.setItem("stageState", "scenario1 : caseB-task2");
    stateAndUserSpeak(CaseB,"scenario1 : caseB-task2",userSpeak);
  } else if (
    //** CaseB-3(2) **/
    stageState == "scenario1 : caseB-task2" &&
    (userSpeak.indexOf("010-8981-2508") != -1 ||
      userSpeak.indexOf("8") != -1 ||
      userSpeak.indexOf("2") != -1 ||
      userSpeak.indexOf("0") != -1 ||
      userSpeak.indexOf("1") != -1)
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-3"),
      '가영(010-8981-2508)에게 "뭐해"라고 문자를 보낼까요?',
      "010-8981-2508"
    );
    window.localStorage.setItem("stageState", "scenario1 : caseB-task3");
    stateAndUserSpeak(CaseB,"scenario1 : caseB-task3",userSpeak);
  }else if (
    //** CaseB-3(1) **/
    stageState == "scenario1 : caseB-task2" &&
    (userSpeak.indexOf("번호") != -1 )
  ) {
    $("#checkBtn").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-modify-2"),
      "수정할 전화번호를 알려주세요.",
      "010-1234-5678"
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  }  else if (
    //** CaseB-3(1) **/
    stageState == "scenario1 : caseB-task2" &&
    (userSpeak.indexOf("아니") != -1 ||
      userSpeak.indexOf("바꿔") != -1 ||
      userSpeak.indexOf("수정") != -1 ||
      userSpeak.indexOf("변경") != -1 ||
      userSpeak.indexOf("싫어") != -1)
  ) {
    $("#checkBtn").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-modify"),
      "무엇을 수정할까요?",
      "010-1234-5678"
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  } else if (
    stageState == "scenario1 : caseB-task3" &&
    (userSpeak.indexOf("응") != -1 ||
      userSpeak.indexOf("네") != -1 ||
      userSpeak.indexOf("맞") != -1 ||
      userSpeak.indexOf("보내") != -1||
      userSpeak.indexOf("어") != -1||
      userSpeak.indexOf("우") != -1)
  ) {
    $("#checkBtn").hide();
    //** CaseB-4 **/
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-4"),
      '가영(010-8981-2508)에게 "뭐해"라고 문자를 보냈어요',
      "010-8981-2508"
    );
   
    stateAndUserSpeak(CaseB,"scenario1 : caseB-fin",userSpeak);
    checkTime(CaseB);
    Scenario1.CaseB = CaseB;
    console.log(Scenario1)
    window.localStorage.setItem("Scenario1", JSON.stringify(Scenario1));

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseB-fin").muted = false;
      document.querySelector("#caseB-fin").play();
    }, 10000);
    window.localStorage.setItem("stageState", "scenario1 : caseB-fin");


  } else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}



//*************************************************************************************************
//********************************************* CaseC *********************************************
//*************************************************************************************************
function caseC(api, userSpeak) {
  
  //** CaseC-1 **/
  if (
    stageState == "scenario1 : caseC" &&
    (userSpeak.indexOf("가영") != -1 ||
    userSpeak.indexOf("문자") != -1)
  ) {
    Scenario1 = JSON.parse(window.localStorage.getItem("Scenario1"));
    selectDialog(userSpeak, document.querySelector("#caseC-1"));
    window.localStorage.setItem("stageState", "scenario1 : caseC-task1");
    stateAndUserSpeak(CaseC,"scenario1 : caseC-task1",userSpeak);
  } else if (
    //** CaseC-2 **/
    stageState == "scenario1 : caseC-task1" &&
    (userSpeak.indexOf("세") != -1 ||
      userSpeak.indexOf("010-8981-2508") != -1 ||
      userSpeak.indexOf("8") != -1 ||
      userSpeak.indexOf("2") != -1 ||
      userSpeak.indexOf("0") != -1 ||
      userSpeak.indexOf("1") != -1)
  ) {
    answerContain(
      userSpeak,
      document.querySelector("#caseA-1"),
      "가영에게 어떤 내용으로 문자를 보낼까요?"
    );
    window.localStorage.setItem("stageState", "scenario1 : caseC-task2");
    stateAndUserSpeak(CaseC,"scenario1 : caseC-task2",userSpeak);
  } else if (
    stageState == "scenario1 : caseC-task2" &&
    (userSpeak.indexOf("뭐해") != -1 || userSpeak.indexOf("뭐") != -1)
  ) {
    //** CaseC-3 **/
    $("#checkBtn").hide();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-4"),
      '가영(010-8981-2508)에게 "뭐해"라고 문자를 보냈어요',
      "010-8981-2508"
    );
    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseC-fin").muted = false;
      document.querySelector("#caseC-fin").play();
    }, 10000);
    window.localStorage.setItem("stageState", "scenario1 : caseC-fin");
    stateAndUserSpeak(CaseC,"scenario1 : caseC-fin",userSpeak);
    checkTime(CaseC);
    Scenario1.CaseC = CaseC;
    console.log(Scenario1)
    window.localStorage.setItem("Scenario1", JSON.stringify(Scenario1));

    let Experiment = new Object();
    Experiment.Scenario1 = Scenario1
    window.localStorage.setItem("Experiment", JSON.stringify(Experiment));
    console.log(Experiment)
    
  } else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}

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

function resultDialog(userSpeak, audio, treeS, phoneNum) {
  $("#user-container").delay(1000).fadeOut();
  $("#result-dialog").delay(2000).fadeIn();
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);
  $("#phone-num").val(phoneNum);
  $("#phone-num").html(phoneNum);
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



 //   $("#select3").click(() => {
      //     // window.localStorage.setItem("stageState", "caseC-task1");
      //     // $("#selectBox").fadeOut(1000);
      //     // caseC(speech.speechApi, "세 번째");

      //     $("#selectBox").fadeOut(1000);
      //     $("#user-container").delay(1000).fadeOut();
      //     $("#ai-container").delay(2000).fadeIn();

      //     setTimeout(() => {
      //       document.querySelector("#caseA-1").muted = false;
      //       document.querySelector("#caseA-1").play();
      //     }, 2300);
      //     $("#user-say").html("");
      //     $("#tree-say").html("가영에게 어떤 내용으로 문자를 보낼까요?");
      //     window.localStorage.setItem("stageState", "scenario1 : caseC-task2");
      //   });
      // }
    
    // this.speechApi.onspeechend = function () {
    //   console.log("Speech has stopped being detected");
    //   $("#user-container").hide();
    //   $("#mic-button").removeClass("mic_buttton_active");
    //   this.speechApi.stop();
    //   active = true;
    // };

    /** 확인 수정 버튼 **/
// $("#confirm-btn").click(() => {});
// $("#modify-btn").click(() => {
//   if (stageState == "caseB-task1") {
//   }
// });
