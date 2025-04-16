const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = document.querySelectorAll(".input-box");

function showNotes() {
  notesContainer.innerHTML = localStorage.getItem("notes");

  notes = document.querySelectorAll(".input-box");
  notes.forEach((nt) => {
    nt.onkeyup = function () {
      updateStorage();
    };
  });
}
showNotes();

function initializeNoteStates() {
  const allNotes = document.querySelectorAll(".input-box");
  if (allNotes.length > 1) {
    allNotes.forEach((note, index) => {
      if (index > 0) {
        note.classList.add("shrunk");
      }
    });
    updateStorage();
  }
}

setTimeout(initializeNoteStates, 100);

function updateStorage() {
  localStorage.setItem("notes", notesContainer.innerHTML);
}

createBtn.addEventListener("click", () => {
  const existingNotes = document.querySelectorAll(".input-box");
  existingNotes.forEach((note) => {
    note.classList.add("shrunk");
  });

  let inputBox = document.createElement("p");
  let img = document.createElement("img");
  inputBox.className = "input-box";
  inputBox.setAttribute("contenteditable", "true");
  img.src = "Assets/delete.png";
  inputBox.appendChild(img);
  notesContainer.appendChild(inputBox);

  inputBox.focus();

  updateStorage();
});

notesContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    e.target.parentElement.remove();
    updateStorage();
  } else if (e.target.tagName === "P") {
    const clickedNote = e.target;

    const allNotes = document.querySelectorAll(".input-box");
    allNotes.forEach((note) => {
      note.classList.add("shrunk");
    });

    clickedNote.classList.remove("shrunk");
    updateStorage();

    notes = document.querySelectorAll(".input-box");
    notes.forEach((nt) => {
      nt.onkeyup = function () {
        updateStorage();
      };
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const br = document.createElement("br");

    range.deleteContents();
    range.insertNode(br);

    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
