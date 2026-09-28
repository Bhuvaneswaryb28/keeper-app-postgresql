import React, { useState ,useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  useEffect(() =>{
    async function getNotes(){
      const response = await fetch("http://localhost:5000/");
      const data = await response.json();

      setNotes(data);
    }

    getNotes();
    
  },[]);

  async function addNote(newNote) {
     console.log("addNote called", newNote);
     

    const response = await fetch("http://localhost:5000/notes",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(newNote)
    });
  
    const savedNote = await response.json();
    console.log("SERVER SENT:", savedNote);
    setNotes(prevValue => {
      return [...prevValue , savedNote];
    });
    console.log("NOTES STATE:", notes);
  }

 async function deleteNote(id) {
   const response = await fetch(`http://localhost:5000/notes/${id}`,{
    method : "DELETE",
   });
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
  }

  function editNote(id){
    setEditId(id);
  }
async function saveNote(id,editText){
 const response= await fetch(`http://localhost:5000/notes/${id}`,{
  method: "PUT",
  headers:{
     "Content-type":"application/json"},
   body: JSON.stringify({
      title: editText.editTitle,
      content: editText.editContent
    })
 });
 const updatedNote = await response.json();
 setNotes(prevNotes => {
  return prevNotes.map(noteItem => {
    if (noteItem.id === id) {
      return updatedNote;
    }

    return noteItem;
  });
});

setEditId(null);
}

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      <div className="notes-container">
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onEdit={editNote}
            isEditing={editId === noteItem.id}
            onSave={saveNote}
          />
        );
      })}
      </div>
       <Footer />
    </div>
  );
}

export default App;
