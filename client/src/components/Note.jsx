import React,{useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Note(props) {
const [editText, setEditText] = useState({
  editTitle: props.title,
  editContent: props.content,
  editCategory: props.category
});

  function handleClick() {
    props.onDelete(props.id);
  }

  function handleEdit() {
    props.onEdit(props.id);
    
  }

  function editEvent(event){
    const {name,value} = event.target;

    setEditText(prevValue =>{
      return {
        ...prevValue,
        [name]:value,
      }
    });
  }

  function handleSave(){
    props.onSave(props.id,editText);
  }

  function handlePin(){
     console.log("PIN CLICKED", props.id);
    props.onPin(props.id);
  }

  return (
    <div className="note">
      {props.isEditing ? (
        <div>
    <input name="editTitle" value={editText.editTitle} onChange={editEvent} />
    <input name="editContent" value={editText.editContent} onChange={editEvent} />
    <select
           name="editCategory"
           value={editText.editCategory}
           onChange={editEvent}
         >
          <option value="General">General</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Ideas">Ideas</option>
        </select>
    <button onClick={handleSave}>SAVE</button>
  </div>

) : (
  <div>
  <h1>{props.title}</h1>
  <p>{props.content}</p>
  <p>{props.category}</p>
  </div>
)}
      <button onClick={handleClick}><DeleteIcon /></button>
      <button onClick={handleEdit}><EditIcon /></button>
      <button onClick={handlePin}>{props.isPinned ? "📌" : "📍"}</button>
    </div>
  );
}

export default Note;
