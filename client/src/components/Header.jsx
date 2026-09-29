import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

function Header(props) {

function handleClearClick(){
  props.onClear()
}

  return (
    <AppBar position="static"  sx={{ backgroundColor: "#f5ba13",  width: "100vw"}}>
       <Toolbar>
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
      </Toolbar>
    </AppBar >
  );
}

export default Header;
