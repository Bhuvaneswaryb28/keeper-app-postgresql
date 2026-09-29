import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//console.log("DB PASSWORD EXISTS:", !!process.env.DB_PASSWORD);

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "keeper",
    password : process.env.DB_PASSWORD,
    port : 5432,
});

db.connect()
.then(()=>{
 console.log("connection succeded");
})
.catch((err)=> {
    console.log("connection lost");
    //console.log(err);
});

app.get("/",async(req,res)=>{
   const result = await db.query("SELECT * FROM notes");
   res.json(result.rows);
});

app.post("/notes",async(req,res)=>{
     const {title,content,category }= req.body;
    const result = await db.query("INSERT INTO notes (title,content,category) VALUES($1,$2,$3) RETURNING *",[title,content,category]);
    res.json(result.rows[0]);
});

app.delete("/notes/:id",async(req,res)=>{
    const id = req.params.id;
    await db.query("DELETE FROM notes WHERE id= $1",[id]);
    res.json({message:"note deleted"}); 
});

app.put("/notes/:id",async(req,res)=>{
    const id = req.params.id;
    const {title,content,category} = req.body;
    const result =await db.query("UPDATE notes SET title=$1 , content = $2 , category= $3 WHERE id =$4 RETURNING *",[title,content,category,id]);
    res.json(result.rows[0]);
});

app.put("/notes/:id/pin",async(req,res)=>{
const id = req.params.id;

    const result = await db.query(
        "UPDATE notes SET is_pinned = NOT is_pinned WHERE id = $1 RETURNING *",
        [id]
    );

    res.json(result.rows[0]);


})

app.listen(port,()=>{
    console.log(`server running port of ${port}`);
});