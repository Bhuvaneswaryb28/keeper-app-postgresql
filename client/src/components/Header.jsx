import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

const API_URL = import.meta.env.VITE_API_URL;

function Header(props) {
  const navigate = useNavigate();

function handleClearClick(){
  props.onClear()
}


async function handleOut(){
  const response = await fetch(`${API_URL}/logout`,{
    method :"POST",
    credentials : "include",
  });

  const data = await response.json();

  if(response.ok){
    console.log(data);
    navigate("/login");
  }
}

  return (
    <AppBar position="static"  sx={{ backgroundColor: "#f5ba13",  width: "100%"}}>
       <Toolbar sx={{ flexDirection: "column" }}>
        <div className="welcome-name">
    {props.user && <h2>Welcome, {props.user.name}</h2>}
  </div>

  <div style={{ display: "flex", width: "100%" }}>
    <Typography variant="h6">
      Keeper
    </Typography>

       

      <TextField
        variant="outlined"
        size="small"
        placeholder="Search notes..."
        value={props.searchText}
        onChange={props.onSearch}
        sx={{ marginLeft: "auto",
          backgroundColor:"white",
          width:"250px"
         }}
        slotProps={{
            input: {
              startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ mr: 1 }} />
      </InputAdornment>
    ),
    endAdornment: (
  <InputAdornment position="end">
    {props.searchText && <ClearIcon onClick={handleClearClick} sx={{ cursor: "pointer" }} />}
  </InputAdornment>
)
  }
}}
  />
  </div>

  <button onClick={handleOut} className="logout-button">Logout</button>
      </Toolbar>
    </AppBar >
  );
}

export default Header;
