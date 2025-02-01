const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

app.post("/create-payment", async (req, res) => {
    try {
        const { transaction_amount, description } = req.body;
        
        const response = await axios.post(
            "https://api.mercadopago.com/v1/payments",
            {
                transaction_amount,
                description,
                payment_method_id: "pix",
                payer: { email: "test@test.com" }
            },
            {
                headers: {
                    Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
