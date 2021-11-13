try {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  console.error(e);
  $(".no-browser-support").show();
  $(".app").hide();
}

var chatBox = $("#user-first-say");
var instructions = $("#recording-instructions");
var notesList = $("ul#notes");
var noteContent = "";

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);

/*-----------------------------
        Voice Recognition 
  ------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function (event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;

  if (!mobileRepeatBug) {
    noteContent += transcript;
    chatBox.val(noteContent);
    chatBox.html(chatBox.val());
  }
};

recognition.onstart = function () {
  instructions.text(
    "Voice recognition activated. Try speaking into the microphone."
  );
};

recognition.onspeechend = function () {
  instructions.text(
    "You were quiet for a while so voice recognition turned itself off."
  );
};

recognition.onerror = function (event) {
  if (event.error == "no-speech") {
    $(".chatBox").hide();
    $("#mic_buttton").removeClass("mic_buttton_active");
    instructions.text("No speech was detected. Try again.");
  }
};

/*-----------------------------
        App buttons and input 
  ------------------------------*/
let active = true;

$("#mic_buttton").on("click", function (e) {
  if (active) {
    $(".chatBox").fadeIn();
    if (noteContent.length) {
      noteContent += " ";
      console.log(noteContent);
    }
    recognition.start();
    $("#mic_buttton").addClass("mic_buttton_active");
    active = false;
  } else {
    $(".chatBox").hide();
    $("#mic_buttton").removeClass("mic_buttton_active");
    recognition.stop();
    instructions.text("Voice recognition paused.");
    active = true;
  }
});

$("#pause-record-btn").on("click", function (e) {
  recognition.stop();
  instructions.text("Voice recognition paused.");
});

// Sync the text inside the text area with the noteContent variable.
chatBox.on("input", function () {
  noteContent = $(this).val();
});

/*-----------------------------
        Speech Synthesis 
  ------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

/*-----------------------------
        Helper Functions 
  ------------------------------*/

function renderNotes(notes) {
  var html = "";
  if (notes.length) {
    notes.forEach(function (note) {
      html += `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;
    });
  } else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}

function saveNote(dateTime, content) {
  localStorage.setItem("note-" + dateTime, content);
}

function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);
    console.log(i);
    console.log(key);

    if (key.substring(0, 5) == "note-") {
      notes.push({
        date: key.replace("note-", ""),
        content: localStorage.getItem(localStorage.key(i)),
      });
    }
  }
  console.log(notes);
  return notes;
}

function deleteNote(dateTime) {
  localStorage.removeItem("note-" + dateTime);
}
