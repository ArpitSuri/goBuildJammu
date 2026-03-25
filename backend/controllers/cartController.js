import Cart from "../model/cartModel.js";
import Variant from "../model/varientModel.js";

/* ---------------- ADD TO CART ---------------- */
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { variantId, quantity } = req.body;

        if (!variantId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const variant = await Variant.findById(variantId)
            .populate("product", "name");

        if (!variant || !variant.isActive) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // 🔥 Stock check (no reservation here)
        const availableStock = variant.stock - variant.reservedStock;

        if (availableStock < quantity) {
            return res.status(400).json({
                message: `Only ${availableStock} items available`
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.variant.toString() === variantId
        );

        const finalPrice = variant.discountPrice || variant.price;

        if (existingItem) {
            const newQty = existingItem.quantity + quantity;

            if (availableStock < newQty) {
                return res.status(400).json({
                    message: `Only ${availableStock} items available`
                });
            }

            existingItem.quantity = newQty;
        } else {
            cart.items.push({
                variant: variantId,
                quantity,
                price: finalPrice,
                name: variant.product.name,
                attributes: variant.attributes.map(attr => ({
                    name: attr.name,
                    value: attr.value
                }))
            });
        }

        await cart.save();

        res.json({
            message: "Added to cart",
            cart
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- UPDATE CART ITEM ---------------- */
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { variantId, quantity } = req.body;

        if (!variantId) {
            return res.status(400).json({ message: "Variant required" });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            i => i.variant.equals(variantId)
        );

        console.log("Incoming variantId:", variantId);

        console.log(
            "Cart variants:",
            cart.items.map(i => i.variant.toString())
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (quantity <= 0) {
            // remove item
            cart.items = cart.items.filter(
                i => i.variant.toString() !== variantId
            );
        } else {
            const variant = await Variant.findById(variantId);

            const availableStock = variant.stock - variant.reservedStock;

            if (availableStock < quantity) {
                return res.status(400).json({
                    message: `Only ${availableStock} items available`
                });
            }

            item.quantity = quantity;
        }

        await cart.save();

        res.json({
            message: "Cart updated",
            cart
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- REMOVE CART ITEM ---------------- */
export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { variantId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.variant.toString() !== variantId
        );

        await cart.save();

        res.json({
            message: "Item removed",
            cart
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- GET CART ---------------- */
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.variant");

        res.json(cart || { items: [] });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- CLEAR CART ---------------- */
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        await Cart.findOneAndUpdate(
            { user: userId },
            { items: [] }
        );

        res.json({ message: "Cart cleared" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};