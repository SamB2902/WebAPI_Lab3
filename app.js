const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const path = require("path")

const app = express();
const port = process.env.port||3000;

//public folder
app.use(express.static(path.join(__dirname,"public")));


app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//MongoDB connection setup
const mongoURI = "mongodb://localhost:27017/Lab3";
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

//Setup Mongoose Schema
const movieSchema = new mongoose.Schema({
    moviename:String
});

const Movies = mongoose.model("Movies", movieSchema, "moviedata");
  


//app.get("/moveis",function(req,res){
    //res.send("Hello Everyone!")
//    res.sendFile(path.join(__dirname, "public", "index.html"));
//})

app.get("/", (req,res)=>{
    res.sendFile("index.html");
});

//Read routes
app.get("/movies", async (req, res)=>{
    try{
        const movies = await Movies.find();
        res.json(movies);
        console.log(movies);
    }catch(err){
        res.status(500).json({error:"Failed to get movie."});
    }
});

app.get("/movies/:id", async (req,res)=>{
    try{
        console.log(req.params.id);
        const movie = await Movies.findById(req.params.id);
        if(!movie){
            return res.status(404).json({error:"{Movie not found}"});
        }
        res.json(movie);

    }catch(err){
        res.status(500).json({error:"Failed to get Movie."});
    }
});

//Create routes
app.post("/addmovie", async (req, res)=>{
    try{
        const newMovie = new Movies(req.body);
        const saveMovie = await newMovie.save();
        res.redirect("/");
        console.log(saveMovie);
    }catch(err){
        res.status(501).json({error:"Failed to add new movie."});
    }
});

//Update Route
app.put("/updatemovie/:id", (req,res)=>{
    //Example of a promise statement for async fucntion
    Movie.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedMovie)=>{
        if(!updatedMovie){
            return res.status().json({error:"Failed to find Movie."});
        }
        res.json(updatedMovie);
    }).catch((err)=>{
        res.status(400).json({error:"Failed to update the Movie Name."});
    });
});

//Delete route
app.delete("/deletemovie/moviename", async (req,res)=>{
    try{
        const moviename = req.query;
        const movie = await Movie.find(moviename);

       if(movie.length === 0){
            return res.status(404).json({error:"Failed to find the Movie."});
        }

        const deletedMovie = await Movie.findOneAndDelete(moviename);
        res.json({message:"Movie deleted Successfully"});

    }catch(err){
        console.log(err);
        res.status(404).json({error:"Movie not found"});
    }
});

app.listen(port, function(){
    console.log(`Server is running on port: ${port}`);
})