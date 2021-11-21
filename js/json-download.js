window.onload = function() {
    console.log("");
    console.log("[window onload] : [start]");
    console.log(""); 

    // [JSON 다운로드 실시] 
    // var jsonObj = {"idx":1, "name":"twok"};

    let Experiment = JSON.parse(window.localStorage.getItem("Experiment"));

    new JsonDownload(Experiment).download();
}; 	

var date = new Date();

const formatDate = (current_datetime)=>{
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
    return formatted_date;
}

/* [JSON 파일 다운로드 수행 내부 클래스] */
class JsonDownload {
    // 클래스 생성자 초기화 실시
    constructor(data={}) {
        this.data = data;
    }

    // 파일 다운로드 수행 실시
    download (type_of = "application/json", filename =  "[HCI_AI_assistant_Namu] "+formatDate(date) + ".json") { // 확장자명을 json 으로 지정
        let body = document.body; // body 변수 선언
        const a = document.createElement("a"); // a 태그 생성 
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
            type: type_of
        }));
        a.setAttribute("download", filename); // a 태그에 다운로드 속성 추가
        body.appendChild(a); // body에 a 태그 추가
        a.click(); // 클릭 이벤트를 발생시켜 다운로드
        body.removeChild(a); // body에서 제거
    }
};

