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
    res.locals.shoppingBag = req.session.cart || [];    
    res.locals.subtotal = res.locals.shoppingBag.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    res.locals.isEmptyCart = res.locals.shoppingBag.length === 0;    

    res.locals.wishList = req.session.wishlist || [];
    // res.locals.isEmptyWishList = req.locals.wishList.length === 0;

    res.locals.showWishList = req.session.showWishList || false;
    req.session.showWishList = false;

    res.locals.showBag = req.session.showBag || false;    
    req.session.showBag = false;
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
        res.render("index", { watches });
    } catch (error) {
        res.status(500).send("Server Error");
    }
})
app.get("/:watchName/:watchId", async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.watchId);
        if(!watch){ 
            return res.status(404).send("Watch not found");
        };
        res.render("product", { watch });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.get("/search", async (req, res) => {
    const searchQuery = req.query.query;
    try {
        const regex = new RegExp(searchQuery, 'i'); 
        const watches = await Watch.find({ 
            $or: [
                { name: regex },
                { brand: regex }
            ]
        });
        res.render("index", { watches });
    } catch (err) {
        res.status(500).send("Search error");
    }
});

app.post("/add-to-wishlist/:id", async (req, res) => {
    const product = await Watch.findById(req.params.id);
    if(!product) return res.status(404).send("Product not found");

    if(!req.session.wishlist) req.session.wishlist = [];

    const wishlistItem = req.session.wishlist.find(item => item._id == product._id);

    if(!wishlistItem){
        req.session.wishlist.push({
            _id: product._id,
            name: product.name,
            image: product.mainImage,
            price: product.price,
        })
    }
    req.session.showWishList = true;
    res.redirect(req.get('Referrer' || '/'));
})
app.post("/add-to-cart/:id", async (req, res) => {
  const product = await Watch.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");

  if (!req.session.cart) req.session.cart = [];

  const cartItem = req.session.cart.find(item => item._id == product._id);

  if (!cartItem) {
      req.session.cart.push({
          _id: product._id,
          name: product.name,
          image: product.mainImage,
          price: product.price,
          quantity: 1
        });
    } else {
      cartItem.quantity += 1;
  }
  req.session.showBag = true;
//   console.log("cartItem variable only === ");
//   console.log(cartItem);
//   req.session.cart.forEach(element => {
//     console.log("req.session.cart object name:   " + element.name);
//     console.log(element);
//   });
  res.redirect(req.get('Referrer' || '/'));
});
app.post("/cart/increase/:id", (req, res) => {
    const cart = req.session.cart;
    const item = cart.find(p => p._id == req.params.id);
    if (item) item.quantity += 1;

    res.redirect(req.get('Referrer' || '/'));
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
    res.redirect(req.get('Referrer' || '/'));
});
  

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

app.listen(3000, () => {
    console.log("http://localhost:3000");
})