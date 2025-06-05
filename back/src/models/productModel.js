import mongoose, { Schema, model, mongo } from "mongoose";

const productSchema = new Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    photos: {
      type: [String],
      minLength: 1,
      maxLength: 3,
    },
    product: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorys",
        required: true,
        minLength: 1,
        maxLength: 5,
      },
    ],
    subCategoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategorys",
        required: true,
        minLength: 1,
      },
    ],
    reason: {
      type: String,
      maxLength: 350,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const productModel = model("products", productSchema);

export default productModel;
