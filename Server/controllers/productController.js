const supabase = require("../config/supabase");


// ==========================
// GET PRODUCTS
// ==========================

const getProducts = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: false });


        if (error) {
            throw error;
        }


        res.status(200).json({
            success: true,
            products: data,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });

    }
};


// ==========================
// ADD PRODUCT
// ==========================

const addProduct = async (req, res) => {

    try {

        const {
            title,
            price,
            category,
            description,
            thumbnail,
            rating,
            stock,
        } = req.body;


        const { data, error } = await supabase
            .from("products")
            .insert([
                {
                    title,
                    price,
                    category,
                    description,
                    thumbnail,
                    rating,
                    stock,
                },
            ])
            .select()
            .single();


        if (error) {
            throw error;
        }


        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: data,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add product",
        });

    }
};


// ==========================
// UPDATE PRODUCT
// ==========================

const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            price,
            category,
            description,
            thumbnail,
            rating,
            stock,
        } = req.body;


        const { data, error } = await supabase
            .from("products")
            .update({
                title,
                price,
                category,
                description,
                thumbnail,
                rating,
                stock,
            })
            .eq("id", id)
            .select()
            .single();


        if (error) {
            throw error;
        }


        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: data,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });

    }
};


// ==========================
// DELETE PRODUCT
// ==========================

const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;


        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);


        if (error) {
            throw error;
        }


        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });

    }
};


module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};