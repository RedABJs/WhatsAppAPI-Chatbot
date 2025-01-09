import sendToWhatsApp from "./httpRequest/sendToWhatsApp.js";

class WhatsAppService {

  async sendMessage(to, body, messageId) {
    const data = {
      messaging_product: 'whatsapp',
          to,
          text: { body },
          // context: {
          //   message_id: messageId,
          // },
    }
    await sendToWhatsApp(data)
  }

  async markAsRead(messageId) {
    const data = {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }
    await sendToWhatsApp(data)
  }

  async sendWelcomeMenu(to, bodyText, buttons) {
    const data = {
      messaging_product: "whatsapp",
      // recipient_type: "individual",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText},
        action: {
          buttons: buttons
        }
      }
    }
    
    await sendToWhatsApp(data)   
    
  }

  async sendMediaMessage(to, type, mediaURL, caption) {

    const mediaObject={}

    switch(type){
      case 'audio':
        mediaObject.audio={link: mediaURL}
        break
      case 'image':
        mediaObject.image={link: mediaURL, caption: caption}
        break
      case 'video':
        mediaObject.video={link: mediaURL, caption: caption}
        break
      case 'document':
        mediaObject.document={link: mediaURL, caption:caption, filename: 'medpet-file.pdf'}
        break
      default: throw new Error ('Not soported media type')
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: type,
      ...mediaObject
    }
    
    await sendToWhatsApp(data)
  }
}

export default new WhatsAppService();