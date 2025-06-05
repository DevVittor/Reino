import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    category: {
      type: String,
      required: true,
      unique: true,
    },
    subCategoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategorys",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const categoryModel = model("categorys", categorySchema);

export default categoryModel;
