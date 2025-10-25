const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");

// Create Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body; // amount in rupees
    const options = {
        amount: amount * 100, // convert rupees to paise
        currency: currency || "INR",
        receipt: `receipt_order_${Date.now()}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        res.status(500).json({ error: "Order creation failed" });
    }
});

// Verify payment
router.post("/verify", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
});

module.exports = router;
