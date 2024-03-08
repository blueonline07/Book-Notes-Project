import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "1201",
    port: 5432,
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
db.connect();

app.get("/", async (req, res)=>{
    let books = [];
    const result = await db.query("select * from reviews join books on books.id = reviews.book_id");
    result.rows.forEach((item) => {
      books.push(item);
    });
    res.render("index.ejs",{data: books});
});
let book;
app.get("/book",async (req, res)=>{
    book = {id: 0,title: "", author: "", coverId : "", new: false};
    const resp = await db.query("select id from books where cover_i = $1",[req.query.coverId]);
    if(resp.rows.length == 0) book.new = true;
    else{
        book.id = resp.rows[0].id;
    }
    book.title = req.query.title;
    book.author = req.query.author;
    book.coverId = req.query.coverId;
    res.render("new.ejs",{data: book});
})
app.post("/book", async (req, res)=>{
    if (book.new) {
      const resp = await db.query(
        "insert into books (title, author, cover_i) values ($1,$2,$3) returning id",
        [book.title, book.author, book.coverId]
      );
      await db.query(
        "insert into reviews (content, book_id, rating) values ($1,$2,$3)",
        [req.body.description, resp.rows[0].id, parseInt(req.body.rate)]
      );
    }
    else{
        await db.query("update reviews set content = $1, rating = $2 where book_id = $3",[req.body.description, req.body.rate, book.id]);
    }
    res.redirect("/");
})

app.delete("/delete/:id", async (req, res)=>{
    let deleteId = req.params.id;
    await db.query("delete from reviews where book_id = $1",[deleteId]);
    await db.query("delete from books where id = $1",[deleteId]);
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})