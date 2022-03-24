import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import timezone from 'mongoose-timezone'

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    lastname: {
      type: String,
      unique: true
    },
    dni: {
      type: String,
      unique: true
    },
    cargo: String,
    avatar: String,
    password: String,
    valid: {
      type: Boolean,
      default: false
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role"
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

userSchema.plugin(timezone)
export default model("User", userSchema);
