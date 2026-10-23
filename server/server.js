import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PgSession = connectPgSimple(session); 
const port = process.env.PORT || 5000;
const setSalt = 10;

const sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ssl: {
        rejectUnauthorized: true
    }
});

app.use(cors({
     origin:  process.env.CLIENT_URL || "http://localhost:5173"     ,
    credentials: true
}));
app.use(express.json());
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

//console.log("DB PASSWORD EXISTS:", !!process.env.DB_PASSWORD);

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
  },
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
    const userId = req.session.userId;
    if(!userId){
        return res.status(401).json({
            message : "please login first"
        });
    }
   const result = await db.query("SELECT * FROM notes WHERE user_id=$1",[userId]);
   res.json(result.rows);
});

app.post("/notes",async(req,res)=>{
     const userId = req.session.userId;
     if(!userId){
        return res.status(401).json({
            message : "please login first"
        });
     }
     const {title,content,category }= req.body;
    const result = await db.query("INSERT INTO notes (title,content,category,user_id) VALUES($1,$2,$3,$4) RETURNING *",[title,content,category,userId]);
    res.json(result.rows[0]);
});

app.delete("/notes/:id",async(req,res)=>{
    const userId= req.session.userId;

    if(!userId){
        return res.status(401).json({
            message : "please login first"
        });
     }

    const id = req.params.id;
    const result= await db.query("DELETE FROM notes WHERE id= $1 AND user_id=$2 RETURNING *",[id,userId]);
     if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }
    res.json({message:"note deleted"}); 
});

app.put("/notes/:id",async(req,res)=>{
    const userId= req.session.userId;

    if(!userId){
        return res.status(401).json({
            message : "please login first"
        });
     }

    const id = req.params.id;
    const {title,content,category} = req.body;
    const result =await db.query("UPDATE notes SET title=$1 , content = $2 , category= $3 WHERE id =$4 AND user_id = $5 RETURNING *",[title,content,category,id,userId]);
     if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }
    res.json(result.rows[0]);
});

app.put("/notes/:id/pin",async(req,res)=>{
  const userId= req.session.userId;

    if(!userId){
        return res.status(401).json({
            message : "please login first"
        });
     }

const id = req.params.id;

    const result = await db.query(
        "UPDATE notes SET is_pinned = NOT is_pinned WHERE id = $1 AND user_id=$2 RETURNING *",
        [id,userId]
    );
      if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }
    res.json(result.rows[0]);


})

app.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, setSalt);
    const result = await db.query("INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,name,email",[name,email,hashedPassword]);
    res.json(result.rows[0]);
})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const result = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

     const user = result.rows[0];

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({
            message:"Invalid username or password"
        });
    }

    req.session.userId =user.id;
    res.json({
        message:"Login Successful",
        user:{
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
    
});

app.get("/me",async(req,res)=>{
    const userId = req.session.userId;
    if(!userId){
        return res.status(401).json({
            message : "Not Logged in"
        });
    }

    const result = await db.query("SELECT id, name ,email from users WHERE id=$1",[userId]);
    res.json(result.rows[0]);
})

app.post("/logout",async(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({
                message : "Logout Failed"
            });
        }
        res.json({
            message:"logout successfull"
        });
    })
})

app.listen(port,()=>{
    console.log(`server running port of ${port}`);
});