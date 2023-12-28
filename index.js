const express=require("express");

const app=express();

require("dotenv").config();

const PORT=process.env.PORT || 5000;

const cookieParser=require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

const user=require('./routes/user');

app.use("/api/v1",user);

require("./config/database").connect();

app.get("/", (req,res) => {
    res.send(`<h1> this is home page ejdn </h1>`);
});
app.listen(PORT, ()=>{
    console.log(`app node is running successfully at  ${PORT} `);
});