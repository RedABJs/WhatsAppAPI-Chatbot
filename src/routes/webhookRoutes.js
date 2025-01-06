/*Se encarga de recibir y enviar solicitudes y ejecutar 
servicios de acuerdo a la información dada */
import express from "express";
import webhookController from "../controllers/webhookController.js";


const router = express.Router();

router.post("/webhook", webhookController.handleIncoming)
router.get("/webhook", webhookController.verifyWebhook)

export default router;