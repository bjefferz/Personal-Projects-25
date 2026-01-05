const fs = require("fs");
const path = require("path");

const notesFile = path.join(__dirname, "notes.json");

// Load notes from JSON file
function loadNotes() {
  try {
    const data = fs.readFileSync(notesFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save notes to JSON file
function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

// Add a new note
function addNote(title, body) {
  const notes = loadNotes();
  const duplicate = notes.find((note) => note.title === title);

  if (duplicate) {
    console.log("Note title already exists!");
    return;
  }

  notes.push({ title, body });
  saveNotes(notes);
  console.log("Note added successfully!");
}

// Remove a note by title
function removeNote(title) {
  const notes = loadNotes();
  const filteredNotes = notes.filter((note) => note.title !== title);

  if (notes.length === filteredNotes.length) {
    console.log("Note not found!");
    return;
  }

  saveNotes(filteredNotes);
  console.log("Note removed successfully!");
}

// Remove all notes
function removeAllNotes() {
  saveNotes([]);
  console.log("All notes removed successfully!");
}

// List all note titles
function listNotes() {
  const notes = loadNotes();

  if (notes.length === 0) {
    console.log("No notes found!");
    return;
  }

  console.log("Your notes:");
  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note.title}`);
  });
}

// Read a note by title
function readNote(title) {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);

  if (!note) {
    console.log("Note not found!");
    return;
  }

  console.log(`Title: ${note.title}`);
  console.log(`Body: ${note.body}`);
}

// Edit a note's body
function editNote(title, newBody) {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);

  if (!note) {
    console.log("Note not found!");
    return;
  }

  note.body = newBody;
  saveNotes(notes);
  console.log("Note updated successfully!");
}

// Parse command line arguments
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

// Execute commands
switch (command) {
  case "add":
    if (!arg1 || !arg2) {
      console.log('Usage: node notes.js add "title" "body"');
    } else {
      addNote(arg1, arg2);
    }
    break;

  case "remove":
    if (!arg1) {
      console.log('Usage: node notes.js remove "title"');
    } else {
      removeNote(arg1);
    }
    break;

  case "remove-all":
    removeAllNotes();
    break;

  case "list":
    listNotes();
    break;

  case "read":
    if (!arg1) {
      console.log('Usage: node notes.js read "title"');
    } else {
      readNote(arg1);
    }
    break;

  case "edit":
    if (!arg1 || !arg2) {
      console.log('Usage: node notes.js edit "title" "new body"');
    } else {
      editNote(arg1, arg2);
    }
    break;

  default:
    console.log("Available commands:");
    console.log('  add "title" "body" - Add a new note');
    console.log('  remove "title" - Remove a note');
    console.log("  remove-all - Remove all notes");
    console.log("  list - List all note titles");
    console.log('  read "title" - Read a note');
    console.log('  edit "title" "new body" - Edit a note');
}
