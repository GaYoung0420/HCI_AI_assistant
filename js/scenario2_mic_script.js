let start,end,time,errorCount = 0;
let Scenario2 = new Object();
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
        console.log(transcript);
        $("#ai-container").fadeOut(1);
        $("#result-dialog").fadeOut(1);
        $("#selectBox").fadeOut(1);
        $("#user-container").fadeIn();
        $("#user-first-say").val(transcript);
        $("#user-first-say").html('" ' + $("#user-first-say").val() + ' "');
        stageState = window.localStorage.getItem("stageState");
        if (stageState == "scenario2 : caseA" || stageState == "scenario2 : caseA-task1"){
          if (stageState == "scenario2 : caseA")
            start = new Date();
          caseA(this.speechApi, transcript);
        }
        else if (
          stageState == "scenario2 : caseB" ||
          stageState == "scenario2 : caseB-task1" ||
          stageState == "scenario2 : caseB-task2-1" ||
          stageState == "scenario2 : caseB-task2-2" ||
          stageState == "scenario2 : caseB-task2-3" ||
          stageState == "scenario2 : caseB-task3"
        ){
          if (stageState == "scenario2 : caseB")
            start = new Date();
          caseB(this.speechApi, transcript);
        }
          
        else if (
          stageState == "scenario2 : caseC" ||
          stageState == "scenario2 : caseC-task1" ||
          stageState == "scenario2 : caseC-task2"
        ){
          if (stageState == "scenario2 : caseC")
            start = new Date();
          caseC(this.speechApi, transcript);
        }
        // stageState = caseB(this.speechApi, transcript);
    
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
      location.href = "../scenario3/caseA.html";
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
  stageState = window.localStorage.getItem("stageState");

  if (
    stageState == "scenario2 : caseA" &&
    (userSpeak.indexOf("미팅") != -1 || userSpeak.indexOf("일정") != -1)
    && userSpeak.indexOf("8") != -1 &&
    (userSpeak.indexOf("30") != -1 ||
    userSpeak.indexOf("반") != -1) ) 
  {
    //** CaseA-fin **/
    
    $("#changed").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseA-1"),
      '11월 12일 "미팅" 일정을 오전 8시 30분으로 바꿨어요.',
      "2021.11.12 오전 8:30"
    );
    
    window.localStorage.setItem("stageState", "scenario2 : caseA-fin");
  
    stateAndUserSpeak(CaseA,"scenario2 : caseA-fin",userSpeak);
    checkTime(CaseA);
    Scenario2.CaseA = CaseA;
    window.localStorage.setItem("Scenario2", JSON.stringify(Scenario2));
    console.log(Scenario2);

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseA-fin").muted = false;
      document.querySelector("#caseA-fin").play();
    }, 9000);


  } else{
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}




//***** CaseB *****/
let userDate = "2021.11.12";
let userTime =  "오전 8:30";
function caseB(api, userSpeak) {
  stageState = window.localStorage.getItem("stageState");
  
  //** CaseB-1 **/
  if (
    stageState == "scenario2 : caseB" &&
    (userSpeak.indexOf("미팅") != -1 || userSpeak.indexOf("일정") != -1)&&
    userSpeak.indexOf("8") != -1 &&
    (userSpeak.indexOf("30") != -1 ||
    userSpeak.indexOf("반") != -1)) {
    Scenario2 = JSON.parse(window.localStorage.getItem("Scenario2"));
    $("#changed").hide();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      '이대로 일정을 수정할까요?',
      userDate+" "+userTime);
    window.localStorage.setItem("stageState", "scenario2 : caseB-task1");
    stateAndUserSpeak(CaseB,"scenario2 : caseB-task1",userSpeak);
  } else if (
    //** CaseB-2(2) **/
    stageState == "scenario2 : caseB-task1" &&
    userSpeak.indexOf("날짜") != -1 
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2_2"),
      "어떻게 날짜를 수정할까요?",userDate+" "+userTime
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  } else if (
    //** CaseB-2(3) **/
    (stageState == "scenario2 : caseB-task1" || stageState == "scenario2 : caseB-task2-2") &&
    userSpeak.indexOf("시간") != -1 
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2_3"),
      "어떻게 시간을 수정할까요?",userDate+" "+userTime
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  }  else if (
    //** CaseB-2-1 => 11월 24일 오후 8시 30분 말한 경우**/
    stageState == "scenario2 : caseB-task1" && userSpeak.indexOf("11") != -1 &&
    userSpeak.indexOf("24") != -1 && userSpeak.indexOf("오후") != -1 ) {
    userDate = "2021.11.24";
    userTime = "오후 8:30";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",userDate+" "+userTime
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-1");
    stateAndUserSpeak(CaseB,"scenario2 : caseB-task2-1",userSpeak);
  }else if (
    //** CaseB-2-2 => 11월 24일만 말한 경우**/
    (stageState == "scenario2 : caseB-task1" || 
    stageState == "scenario2 : caseB-task2-3") &&
    (userSpeak.indexOf("11") != -1 &&
      userSpeak.indexOf("24") != -1)
  ) {
    userDate = "2021.11.24";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",userDate+" "+userTime
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-2");
    stateAndUserSpeak(CaseB,"scenario2 : caseB-task2-2",userSpeak);
  }else if (
    //** CaseB-2-3 => 오후 8시 30분만 말한경우**/
    (stageState == "scenario2 : caseB-task1" || 
    stageState == "scenario2 : caseB-task2-2") &&
    userSpeak.indexOf("오후") != -1  ) {
    userTime = "오후 8:30";
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",userDate+" "+userTime
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-task2-3");
    stateAndUserSpeak(CaseB,"scenario2 : caseB-task2-3",userSpeak);
  }else if (
    //** CaseB-2-4 => 8시 30분이라고만 말한 경우**/
    (stageState == "scenario2 : caseB-task1" || 
    stageState == "scenario2 : caseB-task2-2")&&
    userSpeak.indexOf("8") != -1 &&
    (userSpeak.indexOf("30") != -1 ||
    userSpeak.indexOf("반") != -1)) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-2"),
      "이대로 일정을 수정할까요?",userDate+" "+userTime
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
     } else if (
    (stageState == "scenario2 : caseB-task2-1" || 
    stageState == "scenario2 : caseB-task2-2" ||
    stageState == "scenario2 : caseB-task2-3") &&(
      userDate == "2021.11.24" && userTime == "오후 8:30") && 
    ((userSpeak.indexOf("응") != -1 ||
    userSpeak.indexOf("네") != -1 ||
    userSpeak.indexOf("맞") != -1 ||
    userSpeak.indexOf("어") != -1||
    userSpeak.indexOf("그래") != -1||
    userSpeak.indexOf("좋아") != -1||
    userSpeak.indexOf("오케이") != -1||
    userSpeak.indexOf("okay") != -1||
    userSpeak.indexOf("우") != -1) || userSpeak.indexOf("수정") != -1)
  ) {
    //** CaseB-3 **/
    $("#changed").show();
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-3"),
      '11월 24일 "미팅" 일정을 오후 8시 30분으로 바꿨어요.',
      userDate+" "+userTime
    );
    window.localStorage.setItem("stageState", "scenario2 : caseB-fin");

    stateAndUserSpeak(CaseB,"scenario2 : caseB-fin",userSpeak);
    checkTime(CaseB);
    Scenario2.CaseB = CaseB;
    window.localStorage.setItem("Scenario2", JSON.stringify(Scenario2));
    console.log(Scenario2);

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;

    setTimeout(() => {
      document.querySelector("#caseB-fin").muted = false;
      document.querySelector("#caseB-fin").play();
    }, 9000);
    
  } else if (
    //** CaseB-2(1) **/
    (stageState == "scenario2 : caseB-task1"||
    stageState == "scenario2 : caseB-task2-2"||
    stageState == "scenario2 : caseB-task2-3" )&&
    (userSpeak.indexOf("아니") != -1 ||
      userSpeak.indexOf("바꿔") != -1 ||
      userSpeak.indexOf("수정") != -1 ||
      userSpeak.indexOf("변경") != -1 ||
      userSpeak.indexOf("싫어") != -1)
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-modify"),
      "무엇을 수정할까요?",userDate+" "+userTime
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  }else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}

/** 확인 수정 버튼 **/
// $("#confirm-btn").click(() => {});
// $("#modify-btn").click(() => {
//   if (stageState == "caseB-task1") {
//   }
// });



//*************************************************************************************************
//********************************************* CaseC *********************************************
//*************************************************************************************************

function caseC(api, userSpeak) {
 
  //** CaseC-1 **/
  if (
    stageState == "scenario2 : caseC" &&
    (userSpeak.indexOf("미팅") != -1 || userSpeak.indexOf("일정") != -1)&&
    userSpeak.indexOf("8") != -1 &&
    (userSpeak.indexOf("30") != -1 ||
    userSpeak.indexOf("반") != -1)
  ) {
    Scenario2 = JSON.parse(window.localStorage.getItem("Scenario2"));
    selectDialog(userSpeak, document.querySelector("#caseC-1"),"해당 일정이 3개가 존재합니다. 어떤 일정을 수정할까요?");
    window.localStorage.setItem("stageState", "scenario2 : caseC-task1");
    stateAndUserSpeak(CaseC,"scenario2 : caseC-task1",userSpeak);
  } else if (
  //** CaseC-2 **/
    stageState == "scenario2 : caseC-task1" && (userSpeak.indexOf("세") != -1 || 
    (userSpeak.indexOf("11") != -1 && userSpeak.indexOf("24") != -1))
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseC-2"),
      '오전으로 설정할까요?',
      "2021.11.24 오전 8:30"
    );
    window.localStorage.setItem("stageState", "scenario2 : caseC-task2");
    stateAndUserSpeak(CaseC,"scenario2 : caseC-task2",userSpeak);
  } else if (
    stageState == "scenario2 : caseC-task2" &&
    (userSpeak.indexOf("아니") != -1 || userSpeak.indexOf("오후") != -1)
  ) {
  //** CaseC-fin **/
    $("#pick-date"). removeClass("circle"); 
    $("#pick-date"). addClass("selected-circle");
    $("#changed-container").show();
    selectDialog(userSpeak, document.querySelector("#caseB-3"),
    '11월 24일 "미팅" 일정을 오후 8시 30분으로 바꿨어요.');

    window.localStorage.setItem("stageState", "scenario2 : caseC-fin");
    
    stateAndUserSpeak(CaseC,"scenario2 : caseC-fin",userSpeak);
    checkTime(CaseC);
    Scenario2.CaseC = CaseC;
    console.log(Scenario2)
    window.localStorage.setItem("Scenario2", JSON.stringify(Scenario2));

    let Experiment = JSON.parse(window.localStorage.getItem("Experiment"));
    Experiment.Scenario2 = Scenario2
    window.localStorage.setItem("Experiment", JSON.stringify(Experiment));
    console.log(Experiment)

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseC-fin").muted = false;
      document.querySelector("#caseC-fin").play();
    }, 9000);

  } else {
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}

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

function selectDialog(userSpeak, audio,treeS) {
  $("#user-container").delay(1000).fadeOut();
  $("#selectBox").delay(2000).fadeIn();
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 3000);
  $("#user-say-select").html("> " + userSpeak);
  $("#tree-say-select").html(treeS);
}