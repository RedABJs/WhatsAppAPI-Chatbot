import whatsappService from "./whatsappService.js";

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {

    // console.log(message)

    if (message?.type === "text") {
      const textMessage = message.text.body
      if (this.isGreeting(textMessage.toLowerCase().trim())) {
        this.sendWelcomeMessage(message.from, message.id, senderInfo)
      } else {
        const response = 'Etche Guevarixto te estoy respondiendo: ' + textMessage
        await whatsappService.sendMessage(message.from, response, message.id)
      }
      await whatsappService.markAsRead(message.id)
    } else if (message?.type === "interactive"){
      const option = message?.interactive?.button_reply.title.toLowerCase().trim()
      await this.handleMenuOption(message.from, option)
      await whatsappService.markAsRead(message.id)
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
    this.sendWelcomeMenu(to)

  }

  async sendWelcomeMenu(to){
    const bodyText = "Seleccione una opción."
    const buttons = [
      {
        type: "reply",
        reply:{
          id: "m1_op1",
          title: "No sé"
        }
      },
      {
        type: "reply",
        reply:{
          id: "m2_op2",
          title: "Llorar"
        }
      },
      {
        type: "reply",
        reply:{
          id: "m3_op3",
          title: "Reir"
        }
      }
    ]

    await whatsappService.sendWelcomeMenu(to, bodyText, buttons)
  }

  async handleMenuOption(to, option){
    let answer

    switch (option){
      case "no sé":
        answer= "Yo tampoco."
        break
      case "llorar":
        answer="Come together"
        break
      case "reir":
        answer="Let's remember this moment forever"
      default:
        answer= "No entendí la selección. Escoge una opción nuevamente"
      
    }

    await whatsappService.sendMessage(to, answer)
  }
}

export default new MessageHandler();