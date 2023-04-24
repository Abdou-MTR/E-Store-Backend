require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");

const multer = require("multer");
require("dotenv").config();
const cors = require("cors");
const connection = require("./mongo");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// DB Connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// morgan for logging and bodyparser for parsing the body of the request
const morgan = require("morgan");
const sharp = require("sharp");
app.use(morgan("dev"));

app.listen(process.env.API_PORT);
console.log(`server run on ${process.env.API_PORT}`);
app.use("/uploads", express.static("/app/src/uploads"));
const Product = require("./modules/product");
//upload
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../app/public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

app.post("/upload/products", upload.single("image"), async (req, res) => {
  try {
    // Resize and compress the uploaded image using Sharp
    const buffer = await sharp(req.file.path)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
    // Save the optimized image to disk
    fs.writeFileSync(req.file.path, buffer);
    // Create new product object from request body and uploaded image filename
    const newProduct = new Product({
      name: req.body.name,
      miniDescription: req.body.miniDescription,
      category: req.body.category,
      rating: req.body.rating,
      price: req.body.price,
      brand: req.body.brand,
      weight: req.body.weight,
      size: req.body.size,
      color: req.body.color,
      dimensions: req.body.dimensions,
      shippingFees: req.body.shippingFees,
      description: req.body.description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    // Save product to database
    await newProduct.save();
    // Send success response
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: "Error while creating a new product",
    });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    const productData = products.map((product) => {
      return {
        id: product._id,
        name: product.name,
        miniDescription: product.miniDescription,
        category: product.category,
        rating: product.rating,
        price: product.price,
        brand: product.brand,
        weight: product.weight,
        size: product.size,
        color: product.color,
        dimensions: product.dimensions,
        shippingFees: product.shippingFees,
        description: product.description,
        image: product.image,
      };
    });
    res.json(productData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: "Error while retrieving products",
    });
  }
});
