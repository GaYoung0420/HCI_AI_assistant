class User {
  constructor() {
    this.userID;
    this.Date = new Date().toLocaleString();
    this.startTime;
  }
}

let scenario1 = new Array();
let scenario2 = new Array();
let scenario3 = new Array();

let caseA = new Object();
let caseB = new Object();
let caseC = new Object();

caseA.start = new Date(); //"시작 시간"
caseA.end = new Date(); //"끝나는 시간"
caseA.time = caseA.end - caseA.start;
caseA.