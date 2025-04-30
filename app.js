require("dotenv").config();
const session = require("express-session")
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
app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.cartItems = req.session.cart || [];
    res.locals.subtotal = res.locals.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
  });

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
app.post("/add-watch", upload.fields([
    {name: 'mainImage', maxCount: 1},
    {name: 'images', maxCount: 6}
]), async (req, res) => {
    try {
        const { name, brand, price } = req.body;
        const mainImage = req.files['mainImage'] ? "uploads/" + req.files['mainImage'][0].filename : null;
        const images = req.files['images'] ? req.files['images'].map(file => "uploads/" + file.filename) : [];
        
        const newWatch = new Watch({name, brand, price, mainImage, images});
        await newWatch.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post("/add-to-cart/:id", async (req, res) => {
  const product = await Watch.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");

  if (!req.session.cart) req.session.cart = [];

  const cartItem = req.session.cart.find(item => item._id == product._id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    req.session.cart.push({
      _id: product._id,
      name: product.name,
      image: product.mainImage,
      price: product.price,
      description: product.description,
      quantity: 1
    });
  }

  res.redirect("/");
});

app.post("/cart/increase/:id", (req, res) => {
    const cart = req.session.cart;
    const item = cart.find(p => p._id == req.params.id);
    if (item) item.quantity += 1;
    res.redirect("/");
});
  
app.post("/cart/decrease/:id", (req, res) => {
    const cart = req.session.cart;
    const item = cart.find(p => p._id == req.params.id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        req.session.cart = cart.filter(p => p._id != req.params.id);
      }
    }
    res.redirect("/");
});
  
app.get("/bag", async (req, res) => {
    const watch = await Watch.findById("6810a0d69c1936b1cdfc1a61");
    res.render("shopping-bag", { watch });
})

app.get("/edit/:watchId", async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.watchId);
        if(!watch) return res.status(404).send("watch not found");
        res.render('edit', { watch });
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post("/update/:watchId", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 6 }
]), async (req, res) => {
    try {
        const {name, brand, price} = req.body;
        const updates = { name, brand, price };
        if(req.files['mainImages']){
            updates.mainImage = "uploads/" + req.files['mainImage'][0].filename;
        }
        if(req.files['images']){
            updates.images = req.files['images'].map(file => "uploads/" + file.filename);
        }

        await Watch.findByIdAndUpdate(req.params.watchId, updates);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
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