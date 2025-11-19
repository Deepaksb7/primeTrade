
import { Schema, model, models } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      default: "",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

  },
  { timestamps: true }
);

const noteModel = models.Note || model("Note", noteSchema);
export default noteModel;
