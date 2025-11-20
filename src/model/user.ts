
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don't return password by default
    },

    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ]
  },
  { timestamps: true }
);

const userModel = models.User || model("User", userSchema);
export default userModel;
