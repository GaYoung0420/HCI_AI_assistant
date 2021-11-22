let start,end,time,errorCount = 0;
let Scenario3 = new Object();
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
        if (stageState == "scenario3 : caseA" 
        || stageState == "scenario3 : caseA-task1"){
          if (stageState == "scenario3 : caseA")
            start = new Date();
          caseA(this.speechApi, transcript);
        }
        else if (
          stageState == "scenario3 : caseB" ||
          stageState == "scenario3 : caseB-task1" ||
          stageState == "scenario3 : caseB-task2" ||
          stageState == "scenario3 : caseB-task3"
        ){
          if (stageState == "scenario3 : caseB")
            start = new Date();
          caseB(this.speechApi, transcript);
        }
        else if (
          stageState == "scenario3 : caseC" ||
          stageState == "scenario3 : caseC-task1" 
        ){
          if (stageState == "scenario3 : caseC")
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
    if (stageState == "scenario3 : caseA-fin") {
      location.href = "./caseB.html";
    } else if (stageState == "scenario3 : caseB-fin") {
      location.href = "./caseC.html";
    } else if (stageState == "scenario3 : caseC-fin") {
      location.href = "../scenario3/last_index.html";
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
  console.log(userSpeak);
  console.log("stageState:" + stageState);

  if (
    stageState == "scenario3 : caseA" &&
    userSpeak.indexOf("안녕") != -1) 
  { //** CaseA-fin **/
    resultDialog(
      userSpeak,
      document.querySelector("#caseA-1"),
      document.querySelector("#hello_Paul_Kim"),
      '폴킴의 "안녕"을 재생할게요',"paul_kim"
    );
    window.localStorage.setItem("stageState", "scenario3 : caseA-fin");

    stateAndUserSpeak(CaseA,"scenario3 : caseA-fin",userSpeak);
    checkTime(CaseA);
    Scenario3.CaseA = CaseA;
    window.localStorage.setItem("Scenario3", JSON.stringify(Scenario3));
    console.log(Scenario3);

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseA-fin").muted = false;
      document.querySelector("#caseA-fin").volume = 0.8;
      document.querySelector("#caseA-fin").play();
    }, 8000);

  } else{
    answerContain(
      userSpeak,
      document.querySelector("#error"),
      "무슨 말인지 못 알아들었어요."
    );
    errorCount++;
  }
}

/***** CaseB *****/
function caseB(api, userSpeak) {
  stageState = window.localStorage.getItem("stageState");
  console.log(userSpeak);
  console.log("stageState:" + stageState);
  //** CaseB-1 **/
  if ( stageState == "scenario3 : caseB" &&
      userSpeak.indexOf("안녕") != -1) {
      
    Scenario3 = JSON.parse(window.localStorage.getItem("Scenario3"));
    showResultDialog(userSpeak, 
    document.querySelector("#caseB-1"), 
    "다음 노래를 재생할까요?","paul_kim")
    window.localStorage.setItem("stageState", "scenario3 : caseB-task1");
    stateAndUserSpeak(CaseB,"scenario3 : caseB-task1",userSpeak);

  } else if (
    //** CaseB-2(1) **/
    stageState == "scenario3 : caseB-task1" &&
    (userSpeak.indexOf("아니") != -1 || userSpeak.indexOf("다른") != -1 )
  ) {
    answerContain(
      userSpeak,
      document.querySelector("#caseB-2-1"),
      "어떤 노래를 재생할까요?"
    );
    stateAndUserSpeak(CaseB,stageState,userSpeak);
  } else if (
    /** CaseB-2 **/
    stageState == "scenario3 : caseB-task1" &&
    userSpeak.indexOf("조이") != -1 
  ) {
    showResultDialog(userSpeak, 
      document.querySelector("#caseB-1"), 
      "다음 노래를 재생할까요?","joy")
    window.localStorage.setItem("stageState", "scenario3 : caseB-task2");
    stateAndUserSpeak(CaseB,"scenario3 : caseB-task2",userSpeak);
  } else if (
    stageState == "scenario3 : caseB-task2"  && 
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
    /** CaseB-3 **/
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-3"),
      document.querySelector("#hello_JOY"),
      '조이의 "안녕"을 재생할게요',"joy"
    );

    window.localStorage.setItem("stageState", "scenario3 : caseB-fin");

    stateAndUserSpeak(CaseB,"scenario3 : caseB-fin",userSpeak);
    checkTime(CaseB);
    Scenario3.CaseB = CaseB;
    window.localStorage.setItem("Scenario3", JSON.stringify(Scenario3));
    console.log(Scenario3);

    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;

    setTimeout(() => {
      document.querySelector("#caseB-fin").muted = false;
      document.querySelector("#caseB-fin").volume = 0.8;
      document.querySelector("#caseB-fin").play();
    }, 8000);
  } else {
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
  console.log(userSpeak);
  console.log("stageState:" + stageState);
  /** CaseC-1 **/
  if (
    stageState == "scenario3 : caseC" &&
    userSpeak.indexOf("안녕") != -1
  ) {
    Scenario3 = JSON.parse(window.localStorage.getItem("Scenario3"));
    selectDialog(userSpeak, document.querySelector("#caseC-1"),
    '"안녕"이라는 노래를 5개 찾았어요, 어떤 노래를 재생할까요?');
    window.localStorage.setItem("stageState", "scenario3 : caseC-task1");
    stateAndUserSpeak(CaseC,"scenario3 : caseC-task1",userSpeak);
  } else if (
    /** CaseC-2 **/
    stageState == "scenario3 : caseC-task1" && 
    (userSpeak.indexOf("두") != -1 || 
    serSpeak.indexOf("2") != -1 
    ||userSpeak.indexOf("조이") != -1)
  ) {
    resultDialog(
      userSpeak,
      document.querySelector("#caseB-3"),
      document.querySelector("#hello_JOY"),
      '조이의 "안녕"을 재생할게요',"joy"
    );

    window.localStorage.setItem("stageState", "scenario3 : caseC-fin");
    stateAndUserSpeak(CaseC,"scenario3 : caseC-fin",userSpeak);

    checkTime(CaseC);
    Scenario3.CaseC = CaseC;
    console.log(Scenario3)
    window.localStorage.setItem("Scenario3", JSON.stringify(Scenario3));

    let Experiment = JSON.parse(window.localStorage.getItem("Experiment"));
    Experiment.Scenario3 = Scenario3
    window.localStorage.setItem("Experiment", JSON.stringify(Experiment));
    console.log(Experiment)


    $("#mic-button").removeClass("mic_buttton_active");
    api.stop();
    active = true;
    setTimeout(() => {
      document.querySelector("#caseC-fin").muted = false;
      document.querySelector("#caseC-fin").play();
    }, 7000);
    


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

function resultDialog(userSpeak, audio, music, treeS,select) {
  $("#user-container").delay(1000).fadeOut();
  $("#result-dialog").delay(2000).fadeIn();
  if(select == "joy"){
    $("#paul_kim").hide();
    $("#joy").show();
  }else{
    $("#joy").hide();
    $("#paul_kim").show();
  }
  setTimeout(() => {
    audio.muted = false;
    music.volume = 0.1
    audio.play();
  }, 2000);
  setTimeout(() => {
    music.muted = false;
    music.currentTime = 0; 
    music.play();
  }, 4000);
  

  $("#user-say-result").html("> " + userSpeak);
  $("#tree-say-result").html(treeS);
}


function showResultDialog(userSpeak, audio, treeS,select) {
  $("#user-container").delay(1000).fadeOut();
  $("#result-dialog").delay(2000).fadeIn();
  if(select == "joy"){
    $("#paul_kim").hide();
    $("#joy").show();
  }else{
    $("#joy").hide();
    $("#paul_kim").show();
  }
  setTimeout(() => {
    audio.muted = false;
    audio.play();
  }, 2000);

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