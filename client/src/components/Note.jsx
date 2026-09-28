import React,{useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Note(props) {
const [editText, setEditText] = useState({
  editTitle: props.title,
  editContent: props.content
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

  return (
    <div className="note">
      {props.isEditing ? (
        <div>
    <input name="editTitle" value={editText.editTitle} onChange={editEvent} />
    <input name="editContent" value={editText.editContent} onChange={editEvent} />
    <button onClick={handleSave}>SAVE</button>
  </div>

) : (
  <div>
  <h1>{props.title}</h1>
  <p>{props.content}</p>
  </div>
)}
      <button onClick={handleClick}><DeleteIcon /></button>
      <button onClick={handleEdit}><EditIcon /></button>
    </div>
  );
}

export default Note;
