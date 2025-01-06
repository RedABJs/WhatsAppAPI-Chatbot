/* Se encarga de recibir las solicitudes (entrantes o salientes) del webhook
que a su vez se comunica con el API en la nube de WhatsApp */
import config from "../config/env.js"
import messageHandler from "../services/messageHandler.js"

class WebHookController {
  async handleIncoming(req, res) {
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    // const senderInfo = req.body.entry?.[0]?.changes[0]?.contacts
    const senderInfo= req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0].profile

    if (message) {
      await messageHandler.handleIncomingMessage(message, senderInfo);
    }
    res.sendStatus(200)
  }

  verifyWebhook(req, res) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // check the mode and token sent are correct
    if (mode === "subscribe" && token === config.WEBHOOK_VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

export default new WebHookController();