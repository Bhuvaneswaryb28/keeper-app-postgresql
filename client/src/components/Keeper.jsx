import React, { useState ,useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";


function Keeper() {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editId, setEditId] = useState(null);
  const [user,setUser] = useState(null);
  const categories = ["General", "Study", "Work", "Personal", "Ideas"];
  useEffect(() =>{

    async function getUser(){
      const result = await fetch("http://localhost:5000/me",{
        credentials:"include",
      });

      const data = await result.json();
       if(result.ok){
        setUser(data);
       }
    }

    async function getNotes(){
      const response = await fetch("http://localhost:5000/",{
        credentials:"include"
      });
      const data = await response.json();

      if(response.ok){
        console.log("Notes received:", data);
        setNotes(data);
    } else {
        console.log(data.message);
    }
  }


    getNotes();
    getUser();
  },[]);

  async function addNote(newNote) {
     console.log("addNote called", newNote);
    const response = await fetch("http://localhost:5000/notes",{
      method:"POST",
      credentials: "include",
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
    credentials: "include"
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
   credentials: "include",
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
    method: "PUT",
     credentials: "include"
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
    (noteItem.category||"General").toLowerCase().includes(searchText.toLowerCase())
  );
});
const sortedNotes = [...filteredNotes].sort((a, b) => {
  return b.is_pinned - a.is_pinned;
});

 return (
  <div>
    
    <Header
      onSearch={handleSearch}
      searchText={searchText}
      onClear={clearSearch}
      user ={user}
    />
    <CreateArea onAdd={addNote} />
    
    {categories.map(category => {
      const categoryNotes = sortedNotes.filter(noteItem => {
        const noteCategory = noteItem.category || "General";
        return noteCategory === category;
      });
      if (categoryNotes.length === 0) {
    return null;
    }

      return (
        <div key={category} className="category-container">
          <h2>{category}</h2>

          <div className="notes-container">

            {categoryNotes.map(noteItem => {
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
        </div>
      );
    })}
    <Footer />
  </div>
);
}

export default Keeper;
