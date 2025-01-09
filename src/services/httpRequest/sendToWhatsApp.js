import axios from "axios";
import config from "../../config/env.js"

const sendToWhatsApp = async(data) => {
  const baseURL = `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`
  const headers = { Authorization:`Bearer ${config.API_TOKEN}` }

  try {
    await axios({
      method: 'POST',
      url: baseURL,
      headers: headers,
      data
    })
  } catch (error) {
    console.error("Error sending message", error)
  }

}

export default sendToWhatsApp
