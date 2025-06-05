import mongoose, { Schema, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const subCategoryModel = model("subcategorys", subCategorySchema);

export default subCategoryModel;
