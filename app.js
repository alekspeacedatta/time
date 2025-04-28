require("dotenv").config();
const multer = require("multer");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use("/uploads", express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => console.log("done"))
.catch((err) => console.log("error", err));

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });
const Watch = require("./model/watch");

app.get("/", async (req, res) => {
    try {
        const watches = await Watch.find();
        res.render('index', { watches });
    } catch (error) {
        res.status(500).send("Server Error");
    }
})

app.get("/add", (req, res) => {
    res.render('add');
})
app.post("/add-watch", upload.single('image'), async (req, res) => {
    const { name, brand, price } = req.body;
    const imagePath = req.file ? "uploads/" + req.file.filename : null;

    const newWatch = new Watch({name, brand, price, imagePath});
    await newWatch.save();
    res.redirect('/');
})

app.get("/edit/:watchId", async (req, res) => {
    const watch = await Watch.findById(req.params.watchId);
    res.render('edit', { watch } );
})
app.post("/update/:watchId", upload.single('image'), async (req, res) => {
    const {name, brand, price} = req.body;
    const imagePath = req.file ? "uploads/" + req.file.filename : null;

    await Watch.findByIdAndUpdate(req.params.watchId, {name, brand, price, imagePath});
    res.redirect("/");
})

app.get("/:watchName/:watchId", async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.watchId);
        if(!watch){ 
            return res.status(404).send("Watch not found")
        };
        res.render("product", { watch });
    } catch (error) {
        res.status(500).send("Server Error");
    }
})




app.listen(3000, () => {
    console.log("http://localhost:3000");
})