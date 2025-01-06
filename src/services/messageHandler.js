import whatsappService from "./whatsappService.js";

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === "text") {
      const textMessage = message.text.body
      if (this.isGreeting(textMessage.toLowerCase().trim())) {
        this.sendWelcomeMessage(message.from, message.id, senderInfo)
      } else {
        const response = 'Etche Guevarixto te estoy respondiendo: ' + textMessage
        await whatsappService.sendMessage(message.from, response, message.id)
        await whatsappService.markAsRead(message.id)
      }
    }
  }

  isGreeting(message) {
    const greetings = ["hola", "holi", "hi", "hello", "buenas"]
    const messageWords = message.replace(/[.,!¡¿?]/g, "").split(/\s+/)

    return messageWords.some(word => greetings.includes(word))
  }

  async sendWelcomeMessage(to, messageID, senderInfo) {

    const senderName = senderInfo.name.replace(/[.,!¡¿?]/g,"").split(/\s+/)[0]

    const welcomeMessage = `Hola ${senderName}, bienvenido a MDPT. Qué podemos hacer por ti hoy?`
    await whatsappService.sendMessage(to, welcomeMessage, messageID)
  }
}

export default new MessageHandler();