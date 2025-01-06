/* Maneja la lógica de las variables de entorno para no repetir las variables
y su asignación en diferentes archivos*/

import dotenv from "dotenv"

dotenv.config();

export default {
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
  API_TOKEN: process.env.API_TOKEN,
  PORT: process.env.PORT || 5432,
  BUSINESS_PHONE: process.env.BUSINESS_PHONE,
  API_VERSION: process.env.API_VERSION
}