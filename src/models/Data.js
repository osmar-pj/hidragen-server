import { Schema, model } from "mongoose";
import timezone from 'mongoose-timezone'

const dataSchema = new Schema(
  {
    nm: String,
    reactors: {},
    btnon: {},
    altin: {},
    swcab: {}
  },
  {
    versionKey: false,
  }
)

dataSchema.plugin(timezone)
export default model("Data", dataSchema);
