import React, { useState ,useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
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
      content: editText.editContent,
      category: editText.editCategory
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

async function pinNote(id) {
  //console.log("PIN NOTE CALLED", id);//debugging
  const response = await fetch(`http://localhost:5000/notes/${id}/pin`, {
    method: "PUT"
  });
  //console.log("RESPONSE STATUS", response.status);

  const updatedNote = await response.json();
  //console.log("UPDATED NOTE", updatedNote);

  setNotes(prevNotes => {
    return prevNotes.map(noteItem => {
      if (noteItem.id === id) {
        return updatedNote;
      }

      return noteItem;
    });
  });
}

function handleSearch(event) {
  setSearchText(event.target.value);
}
function clearSearch() {
  setSearchText("");
}

const filteredNotes = notes.filter(noteItem => {
  return (
    noteItem.title.toLowerCase().includes(searchText.toLowerCase()) ||
    noteItem.content.toLowerCase().includes(searchText.toLowerCase()) ||
    noteItem.category.toLowerCase().includes(searchText.toLowerCase())
  );
});
const sortedNotes = [...filteredNotes].sort((a, b) => {
  return b.is_pinned - a.is_pinned;
});

  return (
    <div>
      <Header  onSearch={handleSearch} searchText={searchText} onClear={clearSearch} />
      <CreateArea onAdd={addNote} />
      <div className="notes-container">
      {sortedNotes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            category={noteItem.category}
            onDelete={deleteNote}
            onEdit={editNote}
            isEditing={editId === noteItem.id}
            onPin={pinNote}
            onSave={saveNote}
            isPinned={noteItem.is_pinned}
          />
        );
      })}
      </div>
       <Footer />
    </div>
  );
}

export default App;
