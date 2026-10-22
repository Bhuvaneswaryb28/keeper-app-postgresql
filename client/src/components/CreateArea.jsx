import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
    category:""
  });
  const [isExpand,setExpand] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault();
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
      category:""
    });
    
  }

  function expandMethod(){
    setExpand(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpand && <input
          name="title"
          onClick={expandMethod}
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />}
        
        <textarea
          name="content"
          onChange={handleChange}
          onClick={expandMethod}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpand ? 3:1}
        />

       {isExpand && <select
           className="category-list"
           name="category"
           value={note.category}
           onChange={handleChange}
         >
          <option value="" disabled>
                Select category
            </option>
          <option value="General">General</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Ideas">Ideas</option>
        </select>
        }
        

        <Zoom in={isExpand}>
        <Fab onClick={submitNote}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
