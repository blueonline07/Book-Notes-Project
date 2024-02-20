import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todo",
    password: "1201",
    port: 5432,
});
let books = [
    {
        id: 1,
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "JK Rowling",
        ISBN: "9781338815283",
        rating: "8/10",
        img: ""
    },
    {
        id: 2,
        title: "Life of Pi",
        author: "Yann Martel",
        ISBN: "9780770430078",
        rating: "7/10",
        img: ""
    }
];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
db.connect();

app.get("/", async (req, res)=>{
    try{
        const result = await axios.get("https://covers.openlibrary.org/b/isbn/9781338815283.json");
        books[0].img = result.data.source_url;
        res.render("index.ejs", {data: books});
    }
    catch(err){
        console.log(err);
    }
})
app.post("/new", async (req, res)=>{
    console.log(req.body);
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})