import { config } from "dotenv";
config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  SECRET: 'enviroment'
};
