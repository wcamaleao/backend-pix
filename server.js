const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const MERCADOPAGO_ACCESS_TOKEN = "APP_USR-3082032028704496-020111-4cfac22a985254c9ee0496ad7cb5635d-46826037"; // Substitua pelo seu token do Mercado Pago

// Criar um pagamento PIX
app.post("/criar-pagamento", async (req, res) => {
    try {
        const { valor } = req.body; // Valor enviado pelo Typebot

        const pagamento = await axios.post(
            "https://api.mercadopago.com/v1/payments",
            {
                transaction_amount: parseFloat(valor),
                payment_method_id: "pix",
                payer: {
                    email: "cliente@email.com",
                    first_name: "Nome",
                    last_name: "Sobrenome",
                    identification: {
                        type: "CPF",
                        number: "12345678900",
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            qr_code: pagamento.data.point_of_interaction.transaction_data.qr_code,
            qr_code_base64:
                pagamento.data.point_of_interaction.transaction_data.qr_code_base64,
            id: pagamento.data.id,
        });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao criar pagamento PIX." });
    }
});

// Consultar o status do pagamento
app.get("/status-pagamento/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const pagamento = await axios.get(
            `https://api.mercadopago.com/v1/payments/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
                },
            }
        );

        res.json({ status: pagamento.data.status });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao consultar status do pagamento." });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
    
