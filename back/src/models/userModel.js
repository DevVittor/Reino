import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorys",
      },
    ],
    subCategoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategorys",
      },
    ],
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);

export default userModel;
