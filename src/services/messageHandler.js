import whatsappService from "./whatsappService.js";
import appendToSheet from "./googleSheetsService.js";

class MessageHandler {

  constructor(){
    this.appointmentState={}
  }

  async handleIncomingMessage(message, senderInfo) {

    // console.log(message)

    if (message?.type === "text") {
      const textMessage = message.text.body.toLowerCase().trim()
      if (this.isGreeting(textMessage)) {
        this.sendWelcomeMessage(message.from, message.id, senderInfo)
      } else if(textMessage=="audio"||textMessage=="image"||textMessage=="document"||textMessage=="video"){
        this.sendMedia(message.from, textMessage)
      } else if(this.appointmentState[message.from]){
        await this.handleAppointmentFlow(message.from, textMessage)
      }else {
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
          title: "Agendar"
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
    let response

    switch (option){
      case "agendar":
        this.appointmentState[to]={step: 'name'}
        response = "Ingresa tu nombre por favor."
        break
      case "llorar":
        response="Come together"
        break
      case "reir":
        response="Let's remember this moment forever"
      default:
        response= "No entendí la selección. Escoge una opción nuevamente"
      
    }

    await whatsappService.sendMessage(to, response)
  }

  async sendMedia(to, textMessage){

    const mediaTypes = [
      {
        mediaUrl : 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac',
        caption : 'Bienvenida',
        type : 'audio'
      },
      {
        mediaUrl :'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png',
        caption : '¡Esto es una Imagen!',
        type : 'image'
      },
      {
        mediaUrl : 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4',
        caption : '¡Esto es una video!',
        type : 'video'
      },
      {    
        mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf',
        caption : '¡Esto es un PDF!',
        type : 'document'

      }
    ]

    let messageTypeObject = mediaTypes.find(el=>el.type===textMessage)

    await whatsappService.sendMediaMessage(to, messageTypeObject.type, messageTypeObject.mediaUrl, messageTypeObject.caption);
  }

  completeAppointment(to){
    const appointment = this.appointmentState[to]
    delete this.appointmentState[to]

    const userData=[
      to,
      appointment.name,
      appointment.petName,
      appointment.petType,
      appointment.reason,
      new Date().toISOString()
    ]

    appendToSheet(userData)

    return `
    Gracias por agendar tu cita
    
    Resumen:
    Nombre: ${appointment.name.charAt(0).toUpperCase()+appointment.name.slice(1)}
    Nombre de la mascota: ${appointment.petName}
    Tipo de la mascota: ${appointment.petType}
    Razón de la consulta: ${appointment.reason}
    `
  }

  async handleAppointmentFlow(to, message){
    const state = this.appointmentState[to]
    let response

    
    
    switch (state.step) {
      case 'name':
        state.name=message
        state.step='petName'
        response = "¿Cuál es el nombre de la mascota?"
        break;
      case 'petName':
        state.petName=message
        state.step='petType'
        response = "¿Cuál es el tipo de mascota?"
        break;
      case 'petType':
        state.petType=message
        state.step='reason'
        response = "¿Cuál es el motivo de la consulta?"
        break;
      case 'reason':
        state.reason=message
        response = this.completeAppointment(to)
        break;
    }
    await whatsappService.sendMessage(to, response)
  }
}

export default new MessageHandler();