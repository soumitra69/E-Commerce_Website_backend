const express = require("express");

const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();


// GET all products
router.get("/", getProducts);


// ADD product
router.post("/", addProduct);


// UPDATE product
router.put("/:id", updateProduct);


// DELETE product
router.delete("/:id", deleteProduct);


module.exports = router;