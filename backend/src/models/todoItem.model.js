import mongoose, {Schema} from "mongoose";

const todoItemSchema = new Schema({
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }, {timestamps: true});

  export const Todo = mongoose.model("Todo", todoItemSchema)